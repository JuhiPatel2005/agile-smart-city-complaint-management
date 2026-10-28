// Day 4: duplicate civic-issue detection for CivicTrack.
//
// Purpose
// -------
// Before a complaint record is created, this module looks for an existing
// ACTIVE complaint that describes the same real-world civic issue, so that:
//   * the same citizen cannot register the same active complaint twice, and
//   * a different citizen can follow the existing complaint instead of
//     creating a duplicate civic complaint.
//
// Design rules (intentionally conservative)
// -----------------------------------------
// 1. Only ACTIVE complaints are considered. A "Closed" complaint is never a
//    duplicate candidate, so a recurring issue can always be reported again.
//    "Resolved" is still active because the citizen has not confirmed the
//    fix yet; the existing resubmission workflow keeps working unchanged.
// 2. Department alone is never enough. Two complaints from the same
//    department in the same general area may be completely different
//    problems (for example two different potholes on the same road).
// 3. A strong match requires BOTH a matching location AND a matching issue
//    description. Anything less certain is reported as "no match" so the
//    citizen is allowed to file a new complaint rather than having an
//    unrelated problem silently merged away.
// 4. No new model provider, paid API or dependency is introduced: the
//    citizen-selected complaint category and location
//    service is reused, and text comparison is done locally with a
//    token-similarity (Jaccard) measure.

const { COMPLAINT_STATUSES } = require("./statusWorkflow.js");

// A "Closed" complaint is terminal: the citizen confirmed the resolution.
// Every other status in the existing workflow is treated as active.
const ACTIVE_STATUSES = COMPLAINT_STATUSES.filter(
  (status) => status !== "Closed"
);
//second commit
// Tuning thresholds. Deliberately conservative: when a match is uncertain
// we return null and let the citizen file a new complaint.
const STRONG_LOCATION_SIMILARITY = 0.75;
const STRONG_DESCRIPTION_SIMILARITY = 0.6;
const WEAK_DESCRIPTION_SIMILARITY = 0.4;
const LOCATION_WORD_THRESHOLD = 2;

// Near-identical wording means the citizen is describing the very same
// observation. complaint intake workflow re-classifies identical text independently on every
// submission and occasionally re-words the location (for example "Sector 21
// bus stop, Gandhinagar" versus "main bus stand, Sector 21, Gandhinagar"),
// which can push the location score below the strict threshold even though
// it is plainly the same place. When the wording is near-identical the
// location test is relaxed to "do these two locations share any meaningful
// place token?", because requiring the strict score would let the same
// citizen register the same active complaint twice by resubmitting the same
// sentence.
//
// The location is relaxed, never ignored: a completely different place
// shares no token at all and is still allowed through as a separate
// complaint, which matters when a citizen typed a different location by
// hand the first time.
const IDENTICAL_DESCRIPTION_SIMILARITY = 0.85;

// Common English stop words. They carry no civic meaning and would
// otherwise inflate the similarity of two unrelated descriptions.
const STOP_WORDS = new Set([
  "a", "about", "after", "all", "also", "am", "an", "and", "any", "are",
  "around", "as", "at", "be", "because", "been", "before", "being", "big",
  "but", "by", "can", "could", "day", "did", "do", "does", "for", "from",
  "get", "had", "has", "have", "he", "her", "here", "him", "his", "how",
  "i", "if", "in", "into", "is", "it", "its", "just", "last", "lot",
  "many", "me", "more", "most", "much", "must", "my", "near", "need",
  "new", "no", "not", "now", "of", "on", "one", "only", "or", "other",
  "our", "out", "over", "people", "please", "really", "same", "see",
  "she", "should", "since", "so", "some", "still", "such", "than", "that",
  "the", "their", "them", "then", "there", "these", "they", "this",
  "those", "time", "to", "too", "under", "until", "up", "us", "very",
  "was", "we", "week", "were", "what", "when", "where", "which", "while",
  "who", "why", "will", "with", "would", "you", "your",
]);

// Lowercases and strips punctuation so "Pothole!" and "pothole" compare
// equally. Whitespace is collapsed to single spaces.
function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Locations use the same normalization, so "Sector 21, Gandhinagar" and
// "sector 21 gandhinagar" are recognised as the same place.
function normalizeLocation(value) {
  return normalizeText(value);
}

function tokenize(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

// Jaccard similarity of two token sets: |intersection| / |union|.
function jaccardSimilarity(firstTokens, secondTokens) {
  if (firstTokens.length === 0 || secondTokens.length === 0) {
    return 0;
  }

  const firstSet = new Set(firstTokens);
  const secondSet = new Set(secondTokens);

  const intersectionSize = [...firstSet].filter((token) =>
    secondSet.has(token)
  ).length;

  const unionSize = new Set([...firstSet, ...secondSet]).size;

  if (unionSize === 0) {
    return 0;
  }

  return intersectionSize / unionSize;
}

// True when two locations share at least one meaningful place token. Used
// only for near-identical wording, where a re-worded AI location must not
// defeat an otherwise obvious duplicate.
function sharesLocationToken(first, second) {
  const firstTokens = tokenize(first);
  const secondSet = new Set(tokenize(second));

  if (firstTokens.length === 0 || secondSet.size === 0) {
    return false;
  }

  return firstTokens.some((token) => secondSet.has(token));
}

function compareLocations(first, second) {
  const firstNormalized = normalizeLocation(first);
  const secondNormalized = normalizeLocation(second);

  // A complaint without a usable location can never be a strong location
  // match, so it never blocks or redirects a new report on its own.
  if (!firstNormalized || !secondNormalized) {
    return { similar: false, score: 0 };
  }

  if (firstNormalized === secondNormalized) {
    return { similar: true, score: 1 };
  }

  const firstTokens = tokenize(firstNormalized);
  const secondTokens = tokenize(secondNormalized);

  if (
    firstTokens.length < LOCATION_WORD_THRESHOLD ||
    secondTokens.length < LOCATION_WORD_THRESHOLD
  ) {
    return { similar: false, score: 0 };
  }

  const score = jaccardSimilarity(firstTokens, secondTokens);

  return { similar: score >= STRONG_LOCATION_SIMILARITY, score };
}


function round(value) {
  return Math.round(value * 1000) / 1000;
}

// Scores a single candidate complaint against the new report.
//
// candidate: a complaint document (or lean object) already stored by CivicTrack.
// input:      the freshly classified new report
//               { description, issue, summary, department, location }
function scoreCandidate(candidate, input) {
  const locationComparison = compareLocations(
    candidate.location,
    input.location
  );

  const descriptionSimilarity = jaccardSimilarity(
    tokenize(candidate.description),
    tokenize(input.description)
  );

  const issueSimilarity = jaccardSimilarity(
    tokenize(candidate.issue),
    tokenize(input.issue)
  );

  const summarySimilarity = jaccardSimilarity(
    tokenize(candidate.summary),
    tokenize(input.summary)
  );

  return {
    locationScore: round(locationComparison.score),
    locationMatch: locationComparison.similar,
    descriptionSimilarity: round(descriptionSimilarity),
    issueSimilarity: round(issueSimilarity),
    summarySimilarity: round(summarySimilarity)
  };
}

// Decides whether a scored candidate is a STRONG duplicate.
//
// Strong = same department + matching location + clearly matching issue
// description. A candidate that only matches the department, or only
// matches the general area, is rejected here so that genuinely different
// problems at the same place are never merged.
function isStrongMatch(candidate, input, scores) {
  if (candidate.department !== input.department) {
    return false;
  }

  // Near-identical wording is the same observation, so a re-worded AI
  // location must not defeat it. This is what stops the same citizen
  // registering the same active complaint twice by resubmitting the same
  // sentence. The location is relaxed, never ignored: a completely
  // different place shares no token and is still allowed through.
  if (
    scores.descriptionSimilarity >= IDENTICAL_DESCRIPTION_SIMILARITY &&
    sharesLocationToken(candidate.location, input.location)
  ) {
    return true;
  }

  // Otherwise a matching location is still required, so a strong match must
  // describe the same real-world place as well as the same kind of problem.
  if (!scores.locationMatch) {
    return false;
  }

  // Clearly matching text plus a matching location.
  if (
    scores.descriptionSimilarity >= STRONG_DESCRIPTION_SIMILARITY ||
    scores.issueSimilarity >= STRONG_DESCRIPTION_SIMILARITY
  ) {
    return true;
  }

  // Combined evidence: a comparable description plus a comparable
  // citizen-entered description of the same issue.
  if (
    scores.descriptionSimilarity >= WEAK_DESCRIPTION_SIMILARITY &&
    scores.summarySimilarity >= WEAK_DESCRIPTION_SIMILARITY
  ) {
    return true;
  }

  return false;
}

function describeMatch(scores) {
  return [
    `location match ${scores.locationScore}`,
    `description match ${scores.descriptionSimilarity}`,
    `issue match ${scores.issueSimilarity}`
  ].join(", ");
}

// Finds the best active complaint that matches the new report, or null.
//
// Matching runs in memory over a small candidate set that the database has
// already narrowed to the same department and the active statuses, so no
// scan of closed history is required.
//
// Returns null when the match is uncertain, which means the citizen is
// allowed to file a new complaint.
async function findMatchingActiveComplaint(input, options = {}) {
  const complaintModel = options.complaintModel;

  if (!complaintModel) {
    throw new Error("A complaint model is required for duplicate detection.");
  }

  if (
    !input ||
    typeof input.description !== "string" ||
    typeof input.department !== "string"
  ) {
    return null;
  }

  // Only active complaints can be duplicates. A "Closed" complaint is
  // excluded so a recurring issue is never blocked by old history.
  const candidates = await complaintModel
    .find({
      department: input.department,
      status: { $in: ACTIVE_STATUSES }
    })
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  let best = null;

  for (const candidate of candidates) {
    const scores = scoreCandidate(candidate, input);

    if (!isStrongMatch(candidate, input, scores)) {
      continue;
    }

    // Prefer the newest matching complaint when several match.
    if (!best || candidate.createdAt > best.candidate.createdAt) {
      best = {
        candidate,
        scores,
        reason: describeMatch(scores)
      };
    }
  }

  return best;
}

// Returns the caller's relationship to an existing complaint.
//   "owner"    - the complaint was reported by this citizen
//   "follower" - this citizen already tracks this complaint
//   "other"    - the complaint belongs to a different citizen
function getRelationship(complaint, userId) {
  if (!complaint || !userId) {
    return "other";
  }

  if (complaint.userId && String(complaint.userId) === String(userId)) {
    return "owner";
  }

  const followers = Array.isArray(complaint.followers)
    ? complaint.followers
    : [];

  if (followers.some((follower) => String(follower) === String(userId))) {
    return "follower";
  }

  return "other";
}

module.exports = {
  ACTIVE_STATUSES,
  STRONG_LOCATION_SIMILARITY,
  STRONG_DESCRIPTION_SIMILARITY,
  WEAK_DESCRIPTION_SIMILARITY,
  IDENTICAL_DESCRIPTION_SIMILARITY,
  sharesLocationToken,
  normalizeText,
  normalizeLocation,
  tokenize,
  jaccardSimilarity,
  compareLocations,
  scoreCandidate,
  isStrongMatch,
  describeMatch,
  findMatchingActiveComplaint,
  getRelationship
};
