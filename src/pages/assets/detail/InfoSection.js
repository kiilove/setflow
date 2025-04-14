/**
 * 재사용 가능한 정보 섹션 컴포넌트
 */
const InfoSection = ({ title, children, className = "", icon: Icon }) => (
  <div
    className={`rounded-lg border border-border bg-card p-6 shadow-sm ${className}`}
  >
    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center">
      {Icon && <Icon className="mr-2 text-primary h-4 w-4" />}
      {title}
    </h3>
    {children}
  </div>
);

/**
 * 정보 항목 컴포넌트 - 라벨과 값을 표시
 */
export const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="mb-4">
    <p className="text-sm text-muted-foreground flex items-center mb-1">
      {Icon && <Icon className="mr-1.5 h-3 w-3" />}
      {label}
    </p>
    <p className="text-foreground font-medium">{value}</p>
  </div>
);

export default InfoSection;
