"use client";
import { Link } from "react-router-dom";

/**
 * 목록 페이지의 헤더 컴포넌트
 * @param {Object} props
 * @param {string} props.title - 페이지 제목
 * @param {Array} props.actions - 액션 버튼 배열 [{icon, label, to, onClick, variant}]
 */
const ListHeader = ({ title, actions = [] }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const buttonClass =
            action.variant === "primary"
              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
              : "bg-muted hover:bg-muted/80 text-muted-foreground";

          return action.to ? (
            <Link
              key={index}
              to={action.to}
              className={`${buttonClass} px-4 py-2 h-10 rounded-md transition-colors flex items-center`}
            >
              {Icon && <Icon className="mr-1.5 h-4 w-4" />}
              {action.label}
            </Link>
          ) : (
            <button
              key={index}
              onClick={action.onClick}
              className={`${buttonClass} px-4 py-2 h-10 rounded-md transition-colors flex items-center`}
              disabled={action.disabled}
            >
              {Icon && (
                <Icon
                  className={`mr-1.5 h-4 w-4 ${action.iconClassName || ""}`}
                />
              )}
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ListHeader;
