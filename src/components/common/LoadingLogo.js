import "../../styles/loading-logo.css";

const LoadingLogo = () => {
  return (
    <div className="loading-logo-container">
      <div className="loading-logo">
        {["S", "e", "t", "F", "l", "o", "w"].map((letter, index) => (
          <span
            key={index}
            className={`loading-letter ${index === 3 ? "highlight" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="loading-text">로딩 중...</div>
    </div>
  );
};

export default LoadingLogo;
