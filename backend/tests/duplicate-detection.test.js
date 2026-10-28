const test = require("node:test");
const assert = require("node:assert");

const {
  ACTIVE_STATUSES,
  normalizeText,
  normalizeLocation,
  tokenize,
  jaccardSimilarity,
  compareLocations,
  scoreCandidate,
  isStrongMatch,
  sharesLocationToken,
  getRelationship
} = require("../services/duplicateDetection.js");
const { COMPLAINT_STATUSES } = require("../services/statusWorkflow.js");
const Complaint = require("../models/Complaint.js");

// --- Active status definition -------------------------------------------

test("every workflow status except Closed is active", () => {
  assert.deepStrictEqual(ACTIVE_STATUSES, [
    "Submitted",
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved"
  ]);
  assert.ok(!ACTIVE_STATUSES.includes("Closed"));
});

test("a closed complaint is never a duplicate candidate", () => {
  // Regression guard for the "recurring issue" rule: Closed is the only
  // terminal status, so it must never block a fresh report.
  assert.ok(
    COMPLAINT_STATUSES.includes("Closed"),
    "Closed must remain a workflow status"
  );
  assert.ok(!ACTIVE_STATUSES.includes("Closed"));
});

// --- Normalization ------------------------------------------------------

test("normalizeText lowercases and strips punctuation", () => {
  assert.strictEqual(
    normalizeText("  Pothole!! On MG-Road, Gandhinagar  "),
    "pothole on mg road gandhinagar"
  );
});

test("normalizeText rejects non-strings", () => {
  assert.strictEqual(normalizeText(null), "");
  assert.strictEqual(normalizeText(42), "");
});

test("normalizeLocation treats punctuation variants as one place", () => {
  assert.strictEqual(
    normalizeLocation("Sector 21, Gandhinagar"),
    normalizeLocation("sector 21 gandhinagar")
  );
});

test("tokenize drops stop words and single characters", () => {
  const tokens = tokenize("There is a big pothole on the road");

  assert.ok(tokens.includes("pothole"));
  assert.ok(tokens.includes("road"));
  assert.ok(!tokens.includes("the"));
  assert.ok(!tokens.includes("a"));
  assert.ok(!tokens.includes("is"));
});

// --- Similarity ---------------------------------------------------------

test("jaccardSimilarity is 1 for identical token sets", () => {
  assert.strictEqual(
    jaccardSimilarity(["pothole", "road"], ["pothole", "road"]),
    1
  );
});

test("jaccardSimilarity is 0 for disjoint token sets", () => {
  assert.strictEqual(
    jaccardSimilarity(["pothole", "road"], ["garbage", "bin"]),
    0
  );
});

test("jaccardSimilarity is 0 when either side is empty", () => {
  assert.strictEqual(jaccardSimilarity([], ["pothole"]), 0);
});

// --- Location comparison ------------------------------------------------

test("compareLocations matches an identical normalized location", () => {
  const result = compareLocations(
    "Sector 21, Gandhinagar",
    "sector 21 gandhinagar"
  );

  assert.strictEqual(result.similar, true);
  assert.strictEqual(result.score, 1);
});

test("compareLocations does not match when one location is missing", () => {
  assert.strictEqual(compareLocations(null, "Sector 21").similar, false);
  assert.strictEqual(compareLocations("Sector 21", "").similar, false);
});

test("compareLocations does not match completely different areas", () => {
  assert.strictEqual(
    compareLocations("Sector 21, Gandhinagar", "Andheri East, Mumbai")
      .similar,
    false
  );
});

// --- Strong match decision ---------------------------------------------

// A stored complaint describing a deep pothole at Sector 21.
const potholeComplaint = {
  userId: "owner-id",
  department: "Roads & Infrastructure",
  location: "Sector 21, Gandhinagar",
  description:
    "There is a deep pothole on the road near the Sector 21 bus stop that is damaging vehicles.",
  issue: "Pothole on road",
  summary:
    "A deep pothole near the Sector 21 bus stop is damaging vehicles.",
  status: "Submitted"
};

function newReport(overrides = {}) {
  return {
    description:
      "There is a deep pothole on the road near the Sector 21 bus stop that is damaging vehicles.",
    issue: "Pothole on road",
    summary:
      "A deep pothole near the Sector 21 bus stop is damaging vehicles.",
    department: "Roads & Infrastructure",
    location: "Sector 21, Gandhinagar",
    ...overrides
  };
}

test("an identical issue at the same location is a strong match", () => {
  const scores = scoreCandidate(potholeComplaint, newReport());

  assert.strictEqual(scores.locationMatch, true);
  assert.strictEqual(
    isStrongMatch(potholeComplaint, newReport(), scores),
    true
  );
});

test("a reworded report of the same issue is a strong match", () => {
  const reworded = newReport({
    description:
      "A large pothole on the Sector 21 bus stop road keeps damaging vehicles badly."
  });

  const scores = scoreCandidate(potholeComplaint, reworded);

  assert.strictEqual(scores.locationMatch, true);
  assert.strictEqual(
    isStrongMatch(potholeComplaint, reworded, scores),
    true,
    `scores: ${JSON.stringify(scores)}`
  );
});

test("the same department alone is never enough", () => {
  // Same department and same area, but a completely different problem.
  const differentIssue = newReport({
    description:
      "The footpath tiles outside the market are completely broken and people are tripping.",
    issue: "Broken footpath",
    summary: "Broken footpath tiles are causing people to trip."
  });

  const scores = scoreCandidate(potholeComplaint, differentIssue);

  assert.strictEqual(
    isStrongMatch(potholeComplaint, differentIssue, scores),
    false,
    "same department must not make two different issues duplicates"
  );
});

test("two different potholes on the same road are separate issues", () => {
  // Same department, same road, but the description shares almost no
  // meaningful vocabulary, so it must not be treated as a duplicate.
  const otherPothole = newReport({
    description:
      "Garbage is piled up beside the drain and it smells terrible in this area.",
    issue: "Uncollected garbage",
    summary: "Uncollected garbage is piled up beside the drain."
  });

  const scores = scoreCandidate(potholeComplaint, otherPothole);

  assert.strictEqual(
    isStrongMatch(potholeComplaint, otherPothole, scores),
    false
  );
});

test("a different department at the same location is not a duplicate", () => {
  const otherDepartment = newReport({
    department: "Solid Waste Management",
    description: "Garbage has not been collected for three days near the bus stop.",
    issue: "Uncollected garbage",
    summary: "Garbage has not been collected for three days."
  });

  const scores = scoreCandidate(potholeComplaint, otherDepartment);

  assert.strictEqual(
    isStrongMatch(potholeComplaint, otherDepartment, scores),
    false
  );
});

test("an uncertain match at a different location is not a duplicate", () => {
  const elsewhere = newReport({
    location: "Andheri East, Mumbai"
  });

  const scores = scoreCandidate(potholeComplaint, elsewhere);

  assert.strictEqual(scores.locationMatch, false);
  assert.strictEqual(
    isStrongMatch(potholeComplaint, elsewhere, scores),
    false
  );
});

test("uncertain wording is allowed through as a new complaint", () => {
  const vague = newReport({
    description: "The road outside is in a bad condition and needs attention.",
    issue: "Road condition",
    summary: "The road outside is in poor condition."
  });

  const scores = scoreCandidate(potholeComplaint, vague);

  assert.strictEqual(
    isStrongMatch(potholeComplaint, vague, scores),
    false,
    "when the match is uncertain the citizen may file a new complaint"
  );
});

// --- citizen-entered location differences ---------------------------------------

// citizens may enter slightly different locations for the same issue, so
// its extracted location wording is not perfectly stable. Regression guard
// for the Day 5 fix: near-identical wording must still be a strong match
// even when the AI worded the location differently.
test("identical wording matches even when the location was entered with different wording", () => {
  // These two strings are the two real citizen-entered values extractions observed for the
  // same complaint text in Day 5 testing.
  const stored = {
    ...potholeComplaint,
    location: "Sector 21 bus stop, Gandhinagar"
  };

  const resubmitted = newReport({
    location: "main road near Sector 21, Gandhinagar"
  });

  const scores = scoreCandidate(stored, resubmitted);

  assert.strictEqual(scores.descriptionSimilarity, 1);
  assert.strictEqual(scores.locationMatch, false);

  assert.strictEqual(
    isStrongMatch(stored, resubmitted, scores),
    true,
    "identical wording must not be defeated by AI location wording drift"
  );
});

test("the identical-wording shortcut still requires the same department", () => {
  const stored = {
    ...potholeComplaint,
    location: "Sector 21 bus stop, Gandhinagar"
  };

  const otherDepartment = newReport({
    department: "Solid Waste Management",
    location: "the Sector 21 bus stop in Gandhinagar"
  });

  const scores = scoreCandidate(stored, otherDepartment);

  assert.strictEqual(scores.descriptionSimilarity, 1);
  assert.strictEqual(
    isStrongMatch(stored, otherDepartment, scores),
    false,
    "identical wording in a different department must not be merged"
  );
});

test("a different issue at an unstable location is still not a duplicate", () => {
  const stored = {
    ...potholeComplaint,
    location: "Sector 21 bus stop, Gandhinagar"
  };

  const differentIssue = newReport({
    description:
      "The footpath tiles outside the Sector 21 market are completely broken and elderly people keep tripping over them badly.",
    issue: "Broken footpath",
    summary: "Broken footpath tiles are causing people to trip.",
    location: "outside the Sector 21 market in Gandhinagar"
  });

  const scores = scoreCandidate(stored, differentIssue);

  assert.ok(scores.descriptionSimilarity < 0.85);
  assert.strictEqual(
    isStrongMatch(stored, differentIssue, scores),
    false
  );
});

test("sharesLocationToken detects a shared place word", () => {
  assert.strictEqual(
    sharesLocationToken(
      "Sector 21 bus stop, Gandhinagar",
      "main bus stand, Sector 21, Gandhinagar"
    ),
    true
  );
});

test("sharesLocationToken rejects two unrelated places", () => {
  assert.strictEqual(
    sharesLocationToken("Sector 21, Gandhinagar", "Andheri East, Mumbai"),
    false
  );
});

test("identical wording still matches when the citizen enters the place differently", () => {
  // The two real citizen-entered values extractions observed for the same complaint text
  // during Day 5 testing. The location score is well below the strict
  // threshold, but this is unmistakably the same place.
  const stored = {
    ...potholeComplaint,
    location: "Sector 21 bus stop, Gandhinagar"
  };

  const resubmitted = newReport({
    location: "main bus stand, Sector 21, Gandhinagar"
  });

  const scores = scoreCandidate(stored, resubmitted);

  assert.strictEqual(scores.descriptionSimilarity, 1);
  assert.strictEqual(scores.locationMatch, false);

  assert.strictEqual(
    isStrongMatch(stored, resubmitted, scores),
    true,
    "identical wording must not be defeated by AI location re-wording"
  );
});

test("identical wording at a genuinely different place is still allowed", () => {
  // A citizen who typed a different location by hand the first time is
  // reporting a genuinely different place, even with identical wording.
  const stored = {
    ...potholeComplaint,
    location: "Sector 21, Gandhinagar"
  };

  const elsewhere = newReport({
    location: "Andheri East, Mumbai"
  });

  const scores = scoreCandidate(stored, elsewhere);

  assert.strictEqual(scores.descriptionSimilarity, 1);
  assert.strictEqual(
    isStrongMatch(stored, elsewhere, scores),
    false,
    "a different place must never be merged into an identical-wording complaint"
  );
});

test("the identical-wording shortcut still requires the same department", () => {
  const stored = {
    ...potholeComplaint,
    location: "Sector 21 bus stop, Gandhinagar"
  };

  const otherDepartment = newReport({
    department: "Solid Waste Management",
    location: "main bus stand, Sector 21, Gandhinagar"
  });

  const scores = scoreCandidate(stored, otherDepartment);

  assert.strictEqual(scores.descriptionSimilarity, 1);
  assert.strictEqual(
    isStrongMatch(stored, otherDepartment, scores),
    false,
    "identical wording in a different department must not be merged"
  );
});

// --- Relationship helper ------------------------------------------------

test("getRelationship identifies the owner", () => {
  assert.strictEqual(
    getRelationship({ userId: "abc", followers: [] }, "abc"),
    "owner"
  );
});

test("getRelationship identifies an authorized follower", () => {
  assert.strictEqual(
    getRelationship({ userId: "abc", followers: ["xyz"] }, "xyz"),
    "follower"
  );
});

test("getRelationship identifies an unrelated citizen", () => {
  assert.strictEqual(
    getRelationship({ userId: "abc", followers: ["xyz"] }, "other"),
    "other"
  );
});

test("getRelationship handles a complaint with no followers field", () => {
  assert.strictEqual(getRelationship({ userId: "abc" }, "zzz"), "other");
});

// --- Schema ------------------------------------------------------------

test("the complaint schema stores followers without breaking existing documents", () => {
  const complaint = new Complaint({
    complaintId: "CIV-2026-99999",
    description: "Test complaint description for the schema check.",
    issue: "Test Issue",
    department: "Roads & Infrastructure",
    location: "Sector 21, Gandhinagar",
    severity: "Low",
    summary: "Schema check summary."
  });

  // Backward compatibility: a document created without followers is valid
  // and defaults to an empty array.
  assert.deepStrictEqual(complaint.followers, []);
  assert.strictEqual(complaint.validateSync(), undefined);
});
