import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isUserAuthenticated } from "../utils/userAuth";

function ProtectedUserRoute() {
  const location = useLocation();

  if (!isUserAuthenticated()) {
    return (
      <Navigate
        to="/login/citizen"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedUserRoute;
