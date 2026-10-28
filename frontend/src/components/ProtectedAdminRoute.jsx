import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthenticated } from "../utils/adminAuth";

function ProtectedAdminRoute() {
  const location = useLocation();

  if (!isAdminAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;