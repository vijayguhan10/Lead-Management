const AuthRightPanel = () => (
  <div className="hidden lg:flex flex-col items-center justify-start relative w-full h-full bg-white p-0 pt-8">
    <video
      src="https://cdnl.iconscout.com/lottie/premium/preview-watermark/man-doing-tyre-change-animation-download-in-lottie-json-gif-static-svg-file-formats--car-repairing-service-pack-services-animations-9748775.mp4"
      className="w-full h-full object-contain max-h-[90vh]"
      autoPlay
      loop
      muted
      playsInline
    />
    <div className="absolute bottom-10 left-0 right-0 mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg w-11/12 max-w-lg flex flex-col items-center text-center">
      <h3 className="font-semibold text-gray-800 whitespace-nowrap">
        Your data, your rules
      </h3>
      <p className="text-sm text-gray-600 whitespace-nowrap">
        Your data belongs to you, and our encryption ensures that
      </p>
    </div>
  </div>
);

export default AuthRightPanel;
