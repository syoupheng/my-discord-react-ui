import PrivateApp from "@/components/PrivateApp";
import LoadingUserScreen from "@/components/shared/LoadingUserScreen";
import useAuthUser from "@/hooks/auth/useAuthUser";
import useIsAuth from "@/hooks/auth/useIsAuth";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteGuard = () => {
  const { data, loading, subscribeToMore } = useAuthUser();
  useIsAuth();
  if (loading) return <LoadingUserScreen />;
  return data ? (
    <PrivateApp authUserId={data.me.id} subscribeToMore={subscribeToMore}>
      <Outlet />
    </PrivateApp>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRouteGuard;
