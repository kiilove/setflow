import { Users, UserPlus } from "lucide-react";
import EmptyState from "../common/EmptyState";

/**
 * 사용자 목록이 비어있을 때 표시할 컴포넌트
 */
const UserEmptyState = () => {
  return (
    <EmptyState
      icon={Users}
      title="등록된 사용자가 없습니다"
      description="아직 등록된 사용자가 없습니다. '사용자 추가' 버튼을 클릭하여 새 사용자를 등록하세요."
      buttonText="사용자 추가"
      buttonIcon={UserPlus}
      buttonPath="/users/add"
    />
  );
};

export default UserEmptyState;
