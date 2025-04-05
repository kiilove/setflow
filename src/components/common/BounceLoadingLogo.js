import "../../styles/bounce-loading.css";

const BounceLoadingLogo = () => {
  return (
    <div className="bounce-loading-container">
      <div className="bounce-loading-logo">
        {["S", "e", "t", "F", "l", "o", "w"].map((letter, index) => (
          <span
            key={index}
            className={`bounce-letter ${index === 3 ? "highlight" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="bounce-loading-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
};

export default BounceLoadingLogo;
