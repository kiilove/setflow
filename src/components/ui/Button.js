import React from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";

/**
 * 재사용 가능한 버튼 컴포넌트
 * @param {Object} props
 * @param {string} props.variant - 버튼 스타일 변형 (default, destructive, outline, secondary, ghost, link)
 * @param {string} props.size - 버튼 크기 (default, sm, lg, icon)
 * @param {string} props.className - 추가 클래스명
 * @param {boolean} props.asChild - 자식 요소를 버튼으로 사용할지 여부
 * @param {string} props.to - 링크 경로 (지정 시 Link 컴포넌트로 렌더링)
 * @param {React.ReactNode} props.leftIcon - 왼쪽 아이콘
 * @param {React.ReactNode} props.rightIcon - 오른쪽 아이콘
 * @param {boolean} props.isLoading - 로딩 상태 여부
 * @param {React.ReactNode} props.children - 자식 요소
 */
const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      to,
      leftIcon,
      rightIcon,
      isLoading,
      children,
      ...props
    },
    ref
  ) => {
    // 로딩 스피너 컴포넌트
    const LoadingSpinner = () => (
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    // 크기에 따른 클래스 결정
    const getSizeClass = (size) => {
      switch (size) {
        case "sm":
          return "h-8 px-3 py-1 text-sm";
        case "lg":
          return "h-12 px-6 py-3 text-lg";
        case "icon":
          return "h-10 w-10 p-0";
        case "iconSm":
          return "h-8 w-8 p-0";
        case "iconLg":
          return "h-12 w-12 p-0";
        default:
          return "h-10 px-4 py-2";
      }
    };

    // 버튼 클래스 조합
    const buttonClass = `inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${getButtonVariantClass(
      variant
    )} ${getSizeClass(size)} ${className || ""}`;

    // Link 컴포넌트로 렌더링
    if (to) {
      return (
        <Link to={to} className={buttonClass} ref={ref} {...props}>
          {isLoading && <LoadingSpinner />}
          {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      );
    }

    // 일반 버튼으로 렌더링
    return (
      <button
        className={buttonClass}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
