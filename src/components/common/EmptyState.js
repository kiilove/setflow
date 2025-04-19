"use client";

import { useNavigate } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  buttonPath,
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 text-center bg-background rounded-lg border border-border ${className}`}
    >
      {/* 일러스트레이션 */}
      <div className="mb-6 p-4 rounded-full bg-primary/10">
        <Icon className="w-12 h-12 text-primary" />
      </div>

      {/* 텍스트 */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>

      {/* 버튼 */}
      <button
        onClick={() => navigate(buttonPath)}
        className={`${getButtonVariantClass(
          "primary"
        )} px-4 py-2 flex items-center gap-2 rounded-md`}
      >
        {ButtonIcon && <ButtonIcon className="h-4 w-4" />}
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyState;
