/**
 * 클래스명을 조건부로 결합하는 유틸리티 함수
 * @param  {...string} classes - 결합할 클래스명 목록
 * @returns {string} - 결합된 클래스명
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 버튼 변형에 따른 클래스명을 반환하는 함수
 * @param {string} variant - 버튼 변형 (primary, secondary, outline, destructive 등)
 * @returns {string} - 해당 변형에 맞는 클래스명
 */
export function getButtonVariantClass(variant) {
  switch (variant) {
    case "primary":
      return "bg-primary text-primary-foreground hover:bg-primary/90";
    case "secondary":
      return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
    case "outline":
      return "border border-input bg-background hover:bg-muted hover:text-foreground";
    case "destructive":
    case "danger":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    case "ghost":
      return "hover:bg-muted hover:text-foreground";
    case "link":
      return "text-primary underline-offset-4 hover:underline";
    case "success":
      return "bg-green-600 text-white hover:bg-green-700";
    case "warning":
      return "bg-yellow-600 text-white hover:bg-yellow-700";
    case "info":
      return "bg-blue-600 text-white hover:bg-blue-700";
    default:
      return "bg-primary text-primary-foreground hover:bg-primary/90";
  }
}

/**
 * 상태에 따른 색상 클래스를 반환하는 함수
 * @param {string} status - 상태 (active, inactive, pending, processing, error, success 등)
 * @returns {string} - 해당 상태에 맞는 클래스명
 */
export function getStatusColorClass(status) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "success":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "info":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
  }
}
