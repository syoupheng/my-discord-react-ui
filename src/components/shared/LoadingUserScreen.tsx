import PublicBackground from "@/components/layouts/PublicBackground";
import Spinner from "@/components/shared/Spinner";

const LoadingUserScreen = () => {
  return (
    <PublicBackground>
      <div className="bg-primary rounded-md p-8 sm:w-[480px] w-full sm:h-auto h-full shadow-xl">
        <Spinner />
      </div>
    </PublicBackground>
  );
};

export default LoadingUserScreen;
