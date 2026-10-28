const test = require("node:test");
const assert = require("node:assert");

const {
  COMPLAINT_STATUSES,
  ADMIN_STATUSES,
  isSupportedStatus,
  getNextAdminStatus,
  validateAdminStatusValue,
  validateAdminStatusChange,
  validateLocationForResolution
} = require("../services/statusWorkflow.js");

// --- Workflow definition -------------------------------------------------

test("workflow statuses match the Complaint model enum exactly", () => {
  assert.deepStrictEqual(COMPLAINT_STATUSES, [
    "Submitted",
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved",
    "Closed"
  ]);
});

test("admins may only set the first five statuses", () => {
  assert.deepStrictEqual(ADMIN_STATUSES, [
    "Submitted",
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved"
  ]);
  assert.ok(!ADMIN_STATUSES.includes("Closed"));
});

// --- Next permitted status ----------------------------------------------

test("each status maps to the next sequential status", () => {
  assert.strictEqual(getNextAdminStatus("Submitted"), "Under Review");
  assert.strictEqual(getNextAdminStatus("Under Review"), "Assigned");
  assert.strictEqual(getNextAdminStatus("Assigned"), "In Progress");
  assert.strictEqual(getNextAdminStatus("In Progress"), "Resolved");
});

test("Resolved has no admin transition: closure is citizen-only", () => {
  assert.strictEqual(getNextAdminStatus("Resolved"), null);
});

test("Closed is terminal", () => {
  assert.strictEqual(getNextAdminStatus("Closed"), null);
});

test("unknown current status has no transition", () => {
  assert.strictEqual(getNextAdminStatus("Archived"), null);
});

// --- Valid sequential transitions ----------------------------------------

for (let i = 0; i < ADMIN_STATUSES.length - 1; i += 1) {
  const current = ADMIN_STATUSES[i];
  const next = ADMIN_STATUSES[i + 1];

  test(`valid transition: ${current} -> ${next}`, () => {
    const result = validateAdminStatusChange(current, next);
    assert.strictEqual(result.valid, true);
    assert.ok(!result.noChange);
  });
}

test("citizen confirmation transition Resolved -> Closed is reserved for the citizen route", () => {
  // The admin validator must refuse it; the citizen close route applies
  // it directly with its own conditional update.
  const result = validateAdminStatusChange("Resolved", "Closed");
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("citizen confirmation"));
});

// --- Same status is a no-op, not a transition ---------------------------

test("requesting the current status again is a no-op", () => {
  const result = validateAdminStatusChange("In Progress", "In Progress");
  assert.strictEqual(result.valid, true);
  assert.strictEqual(result.noChange, true);
});

// --- Direct jumps are rejected -------------------------------------------

test("direct jump Submitted -> Resolved is rejected", () => {
  const result = validateAdminStatusChange("Submitted", "Resolved");
  assert.strictEqual(result.valid, false);
  assert.ok(
    result.error.includes('Cannot change status from "Submitted" to "Resolved"')
  );
  assert.ok(result.error.includes("Under Review"));
});

test("skipping a step Assigned -> Resolved is rejected", () => {
  const result = validateAdminStatusChange("Assigned", "Resolved");
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("Assigned"));
});

test("skipping a step Under Review -> In Progress is rejected", () => {
  const result = validateAdminStatusChange("Under Review", "In Progress");
  assert.strictEqual(result.valid, false);
});

test("Submitted -> Closed is rejected", () => {
  const result = validateAdminStatusChange("Submitted", "Closed");
  assert.strictEqual(result.valid, false);
});

// --- Backwards transitions are rejected ----------------------------------

test("backwards transition Assigned -> Under Review is rejected", () => {
  const result = validateAdminStatusChange("Assigned", "Under Review");
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("Backwards status transitions are not allowed."));
});

test("backwards transition Resolved -> In Progress is rejected", () => {
  const result = validateAdminStatusChange("Resolved", "In Progress");
  assert.strictEqual(result.valid, false);
  // Resolved is the final administrative status, so any change from it
  // is refused before the backwards-transition check.
  assert.ok(result.error.includes("final administrative status"));
});

test("backwards transition Closed -> Submitted is rejected", () => {
  const result = validateAdminStatusChange("Closed", "Submitted");
  assert.strictEqual(result.valid, false);
});

// --- Unsupported status values are rejected ------------------------------

test("unsupported status string is rejected", () => {
  const result = validateAdminStatusChange("Submitted", "Archived");
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("Invalid complaint status."));
});

test("wrong-cased status string is rejected", () => {
  const result = validateAdminStatusChange("Submitted", "in progress");
  assert.strictEqual(result.valid, false);
});

test("non-string status values are rejected", () => {
  assert.strictEqual(validateAdminStatusChange("Submitted", 42).valid, false);
  assert.strictEqual(validateAdminStatusChange("Submitted", null).valid, false);
  assert.strictEqual(validateAdminStatusChange("Submitted", {}).valid, false);
});

test("Closed requested through the admin value validator is rejected", () => {
  const result = validateAdminStatusValue("Closed");
  assert.strictEqual(result.valid, false);
  assert.ok(result.error.includes("citizen confirmation"));
});

test("isSupportedStatus accepts only exact workflow spellings", () => {
  COMPLAINT_STATUSES.forEach((status) => {
    assert.strictEqual(isSupportedStatus(status), true);
  });
  assert.strictEqual(isSupportedStatus("Closed "), false);
  assert.strictEqual(isSupportedStatus("Resolve"), false);
  assert.strictEqual(isSupportedStatus(undefined), false);
});

// --- Day 2 rule preserved: no location, no resolution --------------------

test("admin PATCH rejects resolving a complaint with null location", () => {
  const result = validateLocationForResolution({ location: null });
  assert.strictEqual(result.valid, false);
  assert.ok(
    result.error.includes("Cannot resolve complaint without a valid location")
  );
});

test("admin PATCH rejects resolving a complaint with missing location", () => {
  const result = validateLocationForResolution({});
  assert.strictEqual(result.valid, false);
});

test("admin PATCH rejects resolving a complaint with whitespace-only location", () => {
  const result = validateLocationForResolution({ location: "  " });
  assert.strictEqual(result.valid, false);
});

test("admin PATCH rejects resolving a complaint with non-string location", () => {
  const result = validateLocationForResolution({
    location: { area: "Sector 21" }
  });
  assert.strictEqual(result.valid, false);
});

test("admin PATCH allows resolving a complaint with valid location", () => {
  const result = validateLocationForResolution({ location: "Andheri East" });
  assert.strictEqual(result.valid, true);
});

test("admin PATCH allows resolving a complaint with whitespace-padded location", () => {
  const result = validateLocationForResolution({ location: " Andheri East " });
  assert.strictEqual(result.valid, true);
});

// --- Full workflow walk-through ------------------------------------------

test("a complaint can be walked from Submitted to Resolved one step at a time", () => {
  let status = "Submitted";

  const expectedPath = [
    "Under Review",
    "Assigned",
    "In Progress",
    "Resolved"
  ];

  expectedPath.forEach((expected) => {
    const result = validateAdminStatusChange(status, expected);
    assert.strictEqual(
      result.valid,
      true,
      `expected ${status} -> ${expected} to be valid`
    );
    status = expected;
  });

  assert.strictEqual(status, "Resolved");
  assert.strictEqual(getNextAdminStatus(status), null);
});

test("server.js can be required without errors", () => {
  const app = require("../server.js");
  assert.ok(app, "Express app should be exported");
  assert.strictEqual(typeof app.listen, "function", "app.listen should exist");
});

