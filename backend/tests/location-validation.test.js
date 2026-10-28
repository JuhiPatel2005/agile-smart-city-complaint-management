const test = require("node:test");
const assert = require("node:assert/strict");
const { buildComplaintRecord } = require("../services/complaintIntake");

const validInput = {
  category: "Roads & Infrastructure",
  complaint: "A deep pothole is causing problems for passing vehicles.",
  location: "Sector 21",
  landmark: "Near community park",
  city: "Gandhinagar",
  postalCode: "382021",
  severity: "High"
};

test("builds a complaint using citizen-entered fields without external inference", () => {
  const result = buildComplaintRecord(validInput);
  assert.equal(result.issue, "Roads & Infrastructure");
  assert.equal(result.department, "Roads & Infrastructure");
  assert.equal(result.location, "Sector 21, Near community park, Gandhinagar, 382021");
  assert.equal(result.severity, "High");
  assert.equal(result.summary, validInput.complaint);
});

test("rejects missing category", () => {
  assert.throws(() => buildComplaintRecord({ ...validInput, category: "" }), /category/i);
});

test("rejects short complaint descriptions", () => {
  assert.throws(() => buildComplaintRecord({ ...validInput, complaint: "Too short" }), /10 and 1000/i);
});

test("rejects missing area or city", () => {
  assert.throws(() => buildComplaintRecord({ ...validInput, location: "" }), /area or street/i);
  assert.throws(() => buildComplaintRecord({ ...validInput, city: "" }), /city/i);
});

test("rejects invalid PIN codes", () => {
  assert.throws(() => buildComplaintRecord({ ...validInput, postalCode: "123" }), /6 digits/i);
});

test("accepts an omitted optional PIN code and landmark", () => {
  const result = buildComplaintRecord({ ...validInput, postalCode: "", landmark: "" });
  assert.equal(result.location, "Sector 21, Gandhinagar");
});

test("rejects invalid urgency values", () => {
  assert.throws(() => buildComplaintRecord({ ...validInput, severity: "Critical" }), /urgency/i);
});
