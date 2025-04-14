import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

/**
 * 사용자 목록이 비어있을 때 표시할 컴포넌트
 */
const UserEmptyState = () => {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-lg">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">
        등록된 사용자가 없습니다
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        아직 등록된 사용자가 없습니다. '사용자 추가' 버튼을 클릭하여 새 사용자를
        등록하세요.
      </p>
      <Link
        to="/users/add"
        className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
          "primary"
        )}`}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        사용자 추가
      </Link>
    </div>
  );
};

// Users 아이콘 컴포넌트
const Users = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default UserEmptyState;
