import PublicBackground from "@/components/layouts/PublicBackground";
import LoadingUserScreen from "@/components/shared/LoadingUserScreen";
import useAuthUser from "@/hooks/auth/useAuthUser";
import { Navigate, Outlet } from "react-router-dom";

const PublicRouteGuard = () => {
  const { data, loading } = useAuthUser({ fetchPolicy: "cache-only" });
  if (loading) return <LoadingUserScreen />;
  return data ? (
    <Navigate to="/channels/@me" />
  ) : (
    <PublicBackground>
      <Outlet />
    </PublicBackground>
  );
};

export default PublicRouteGuard;
