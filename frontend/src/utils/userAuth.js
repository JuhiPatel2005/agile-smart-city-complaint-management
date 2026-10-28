const USER_AUTH_EVENT = "civicai-user-auth-changed";

export function getUserToken() {
  return sessionStorage.getItem("userToken");
}

export function getUserData() {
  const data = sessionStorage.getItem("userData");

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    sessionStorage.removeItem("userData");
    return null;
  }
}

export function isUserAuthenticated() {
  return Boolean(getUserToken());
}

export function saveUserSession(token, user) {
  if (!token) {
    return;
  }

  sessionStorage.setItem("userToken", token);

  if (user) {
    sessionStorage.setItem("userData", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("userData");
  }

  notifyUserAuthChange();
}

export function userLogout() {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("userData");
  sessionStorage.removeItem("complaintData");
  sessionStorage.removeItem("civicai_analysis");

  notifyUserAuthChange();
}

export function subscribeToUserAuth(listener) {
  window.addEventListener(USER_AUTH_EVENT, listener);

  return () => {
    window.removeEventListener(USER_AUTH_EVENT, listener);
  };
}

export async function userFetch(url, options = {}) {
  const token = getUserToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    userLogout();
    window.location.href = "/login/citizen";
    throw new Error("Your session has expired.");
  }

  return response;
}

function notifyUserAuthChange() {
  window.dispatchEvent(new Event(USER_AUTH_EVENT));
}