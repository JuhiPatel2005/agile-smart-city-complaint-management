export function getAdminToken() {
  return sessionStorage.getItem("adminToken");
}

export function getAdminData() {
  const data = sessionStorage.getItem("adminData");

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    sessionStorage.removeItem("adminData");
    return null;
  }
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function adminLogout() {
  sessionStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminData");
}

export async function adminFetch(url, options = {}) {
  const token = getAdminToken();

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
    adminLogout();
    window.location.href = "/admin/login";
    throw new Error("Your admin session has expired.");
  }

  return response;
}