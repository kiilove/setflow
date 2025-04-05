import FancyLoadingLogo from "./FancyLoadingLogo";
import LoadingLogo from "./LoadingLogo";

const FullScreenLoading = () => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 w-full h-screen">
      <FancyLoadingLogo />
    </div>
  );
};

export default FullScreenLoading;
