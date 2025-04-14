import "../../styles/fancy-loading.css";
import "../../styles/globals.css";

const SetFlowLogo = ({
  size = "medium",
  showSpinner = false,
  animated = false,
}) => {
  // SetFlow 텍스트를 사용
  const letters = ["S", "e", "t", "F", "l", "o", "w"];

  // 크기에 따른 클래스 결정
  const sizeClasses = {
    small: "text-xl",
    medium: "text-3xl",
    large: "text-5xl",
    xlarge: "text-7xl",
  };

  const fontSizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className="fancy-logo-container">
      <div className={`fancy-logo ${fontSizeClass} font-bold`}>
        {letters.map((letter, index) => (
          <span
            key={index}
            style={{
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
    </div>
  );
};

export default SetFlowLogo;
