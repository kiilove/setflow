import "../../styles/fancy-loading.css";

const FancyLoadingLogo = () => {
  return (
    <div className="fancy-loading-container">
      <div className="fancy-loading-logo">
        {["S", "e", "t", "F", "l", "o", "w"].map((letter, index) => (
          <span
            key={index}
            className="fancy-letter"
            style={{
              animationDelay: `${index * 0.15}s`,
              color:
                index === 3
                  ? "var(--fancy-highlight-color)"
                  : "var(--fancy-text-color)",
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="fancy-loading-spinner">
        <div className="spinner-circle"></div>
        <div className="spinner-circle-inner"></div>
      </div>
    </div>
  );
};

export default FancyLoadingLogo;
