const ISSUE_CATEGORIES = [
  "Water Supply & Sewerage",
  "Roads & Infrastructure",
  "Electricity & Street Lighting",
  "Solid Waste Management"
];
//this is first change
const ALLOWED_SEVERITIES = ["Low", "Medium", "High"];

function buildComplaintRecord(input = {}) {
  const category = typeof input.category === "string" ? input.category.trim() : "";
  const description = typeof input.complaint === "string" ? input.complaint.trim() : "";
  const location = typeof input.location === "string" ? input.location.trim() : "";
  const landmark = typeof input.landmark === "string" ? input.landmark.trim() : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  const postalCode = typeof input.postalCode === "string" ? input.postalCode.trim() : "";
  const severity = typeof input.severity === "string" ? input.severity.trim() : "";

  if (!ISSUE_CATEGORIES.includes(category)) throw new Error("Please select a valid complaint category.");
  if (description.length < 10 || description.length > 1000) throw new Error("Complaint description must be between 10 and 1000 characters.");
  if (!location || location.length > 180) throw new Error("Please enter the area or street where the issue occurred.");
  if (!city || city.length > 100) throw new Error("Please enter the city.");
  if (landmark.length > 180) throw new Error("Landmark must be 180 characters or fewer.");
  if (postalCode && !/^\d{6}$/.test(postalCode)) throw new Error("PIN code must contain exactly 6 digits.");
  if (!ALLOWED_SEVERITIES.includes(severity)) throw new Error("Please select a valid urgency level.");

  const fullLocation = [location, landmark, city, postalCode].filter(Boolean).join(", ");
  return {
    issue: category, category, department: category, description,
    area: location, location: fullLocation, landmark, city, postalCode, severity,
    summary: description.length > 220 ? `${description.slice(0, 217).trim()}...` : description
  };
}

module.exports = { ISSUE_CATEGORIES, ALLOWED_SEVERITIES, buildComplaintRecord };
