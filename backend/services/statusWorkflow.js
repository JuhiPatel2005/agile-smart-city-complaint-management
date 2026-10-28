// Centralized complaint status workflow for CivicTrack.
//
// This module is the single source of truth for every complaint status
// string and for the rules that govern how a complaint may move between
// them. Both the admin workflow routes and the citizen confirmation
// route rely on these helpers instead of re-implementing the rules, so
// the frontend dropdown is never the only validation control.
//
// Established workflow (matches the Complaint model enum):
//   Submitted -> Under Review -> Assigned -> In Progress -> Resolved -> Closed
//
// The first five statuses are advanced through the administrative
// workflow (PATCH /api/admin/complaints/:complaintId). "Closed" is
// reserved for citizen confirmation (PATCH /api/complaints/:id/close)
// and can never be set from an admin route.
const COMPLAINT_STATUSES = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed"
];
//third commit
// Statuses an administrator may set through the admin workflow routes.
const ADMIN_STATUSES = [
  "Submitted",
  "Under Review",
  "Assigned",
  "In Progress",
  "Resolved"
];

function isSupportedStatus(status) {
  return (
    typeof status === "string" && COMPLAINT_STATUSES.includes(status)
  );
}

function getStatusIndex(status) {
  return COMPLAINT_STATUSES.indexOf(status);
}

// Returns the only status an administrator may move the complaint to
// next, or null when no administrative transition is available
// (terminal states: Resolved and Closed).
function getNextAdminStatus(currentStatus) {
  const currentIndex = getStatusIndex(currentStatus);

  if (currentIndex === -1) {
    return null;
  }

  const nextStatus = COMPLAINT_STATUSES[currentIndex + 1];

  return nextStatus && ADMIN_STATUSES.includes(nextStatus)
    ? nextStatus
    : null;
}

// Validates a requested status value coming from a client. Rejects
// unsupported values and any attempt to close a complaint through the
// admin workflow, because closure is reserved for citizen confirmation.
function validateAdminStatusValue(requestedStatus) {
  if (!isSupportedStatus(requestedStatus)) {
    return {
      valid: false,
      error: `Invalid complaint status. Supported statuses are: ${COMPLAINT_STATUSES.join(
        ", "
      )}.`
    };
  }

  if (requestedStatus === "Closed") {
    return {
      valid: false,
      error:
        "A complaint can only be closed through citizen confirmation, not from the admin workflow."
    };
  }

  return { valid: true };
}

// Centralized transition validator. Checks both the current status and
// the requested next status, and only allows a single sequential step
// forward through the administrative workflow.
//
// Returns:
//   { valid: true }                        - valid one-step advance
//   { valid: true, noChange: true }        - requested status equals the
//                                            current status (treated as a
//                                            no-op for the status field so
//                                            department-only updates keep
//                                            working)
//   { valid: false, error }                - unsupported value, backwards
//                                            transition or a skipped step
function validateAdminStatusChange(currentStatus, requestedStatus) {
  if (!isSupportedStatus(currentStatus)) {
    return {
      valid: false,
      error: `Cannot validate the status transition because the complaint has an unknown current status "${currentStatus}".`
    };
  }

  const valueCheck = validateAdminStatusValue(requestedStatus);

  if (!valueCheck.valid) {
    return valueCheck;
  }

  if (requestedStatus === currentStatus) {
    return { valid: true, noChange: true };
  }

  const nextStatus = getNextAdminStatus(currentStatus);

  if (!nextStatus) {
    return {
      valid: false,
      error: `The complaint is already in the final administrative status "${currentStatus}" and cannot be changed by an admin.`
    };
  }

  if (requestedStatus !== nextStatus) {
    const requestedIndex = getStatusIndex(requestedStatus);
    const currentIndex = getStatusIndex(currentStatus);

    const reason =
      requestedIndex < currentIndex
        ? "Backwards status transitions are not allowed."
        : `Only the next workflow status "${nextStatus}" can be applied.`;

    return {
      valid: false,
      error: `Cannot change status from "${currentStatus}" to "${requestedStatus}". ${reason}`
    };
  }

  return { valid: true };
}

// Day 2 rule: a complaint without a valid location can never transition
// to "Resolved". Kept centralized so the admin route and tests share it.
function validateLocationForResolution(complaint) {
  if (
    complaint.location === undefined ||
    complaint.location === null ||
    typeof complaint.location !== "string" ||
    !complaint.location.trim()
  ) {
    return {
      valid: false,
      error:
        "Cannot resolve complaint without a valid location. Correct the location and retry."
    };
  }

  return { valid: true };
}

module.exports = {
  COMPLAINT_STATUSES,
  ADMIN_STATUSES,
  isSupportedStatus,
  getStatusIndex,
  getNextAdminStatus,
  validateAdminStatusValue,
  validateAdminStatusChange,
  validateLocationForResolution
};
