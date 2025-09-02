interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10" />
  );
};

export default LoadingOverlay;
