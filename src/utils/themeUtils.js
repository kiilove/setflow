/**
 * 테마 유틸리티 함수
 * 테마에 따른 일관된 스타일링을 위한 유틸리티 함수들
 */

// 상태에 따른 색상 클래스 반환
export const getStatusColorClass = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "활성":
    case "good":
    case "양호":
    case "completed":
    case "완료":
    case "사용중":
    case "재직중":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300";
    case "pending":
    case "대기":
    case "대기중":
    case "warning":
    case "경고":
    case "in progress":
    case "진행중":
    case "휴직중":
    case "leave":
      return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300";
    case "inactive":
    case "비활성":
    case "disabled":
    case "비활성화":
    case "퇴사":
      return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300";
    case "error":
    case "오류":
    case "critical":
    case "심각":
      return "bg-rose-100 text-rose-800 dark:bg-rose-800/30 dark:text-rose-300";
    case "info":
    case "정보":
      return "bg-sky-100 text-sky-800 dark:bg-sky-800/30 dark:text-sky-300";
    default:
      return "bg-slate-100 text-slate-800 dark:bg-slate-800/30 dark:text-slate-300";
  }
};

// 우선순위에 따른 색상 클래스 반환
export const getPriorityColorClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
    case "높음":
    case "urgent":
    case "긴급":
      return "text-rose-600 dark:text-rose-400";
    case "medium":
    case "중간":
    case "normal":
    case "보통":
      return "text-amber-600 dark:text-amber-400";
    case "low":
    case "낮음":
      return "text-emerald-600 dark:text-emerald-400";
    default:
      return "text-slate-600 dark:text-slate-400";
  }
};

// 차트 색상 배열 반환 (테마에 따라 다른 색상 배열 반환)
export const getChartColors = (isDark = false) => {
  return isDark
    ? [
        "rgba(var(--primary), 0.8)",
        "rgba(52, 211, 153, 0.8)",
        "rgba(251, 191, 36, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(147, 51, 234, 0.8)",
        "rgba(59, 130, 246, 0.8)",
      ]
    : [
        "rgba(var(--primary), 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(139, 92, 246, 0.8)",
        "rgba(59, 130, 246, 0.8)",
      ];
};

// 버튼 변형에 따른 클래스 반환
export const getButtonVariantClass = (variant) => {
  switch (variant?.toLowerCase()) {
    case "primary":
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
    case "secondary":
      return "bg-secondary hover:bg-secondary/90 text-secondary-foreground";
    case "success":
    case "green":
      return "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-700 dark:hover:bg-emerald-800";
    case "danger":
    case "red":
    case "destructive":
      return "bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-700 dark:hover:bg-rose-800";
    case "warning":
    case "yellow":
      return "bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-800";
    case "info":
    case "blue":
      return "bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-700 dark:hover:bg-sky-800";
    case "outline":
      return "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
    case "ghost":
      return "hover:bg-accent hover:text-accent-foreground";
    default:
      return "bg-primary hover:bg-primary/90 text-primary-foreground";
  }
};

// 배지 변형에 따른 클래스 반환
export const getBadgeVariantClass = (variant) => {
  switch (variant?.toLowerCase()) {
    case "primary":
      return "bg-primary/10 text-primary dark:bg-primary/20";
    case "secondary":
      return "bg-secondary text-secondary-foreground";
    case "success":
    case "green":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/30 dark:text-emerald-300";
    case "danger":
    case "red":
      return "bg-rose-100 text-rose-800 dark:bg-rose-800/30 dark:text-rose-300";
    case "warning":
    case "yellow":
      return "bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-300";
    case "info":
    case "blue":
      return "bg-sky-100 text-sky-800 dark:bg-sky-800/30 dark:text-sky-300";
    case "outline":
      return "border border-input bg-background text-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};
