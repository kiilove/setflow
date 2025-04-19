"use client";

import { Plus, Package } from "lucide-react";
import EmptyState from "../../components/common/EmptyState";

const AssetsEmptyState = () => {
  return (
    <EmptyState
      icon={Package}
      title="등록된 자산이 없습니다"
      description="새로운 자산을 등록하여 체계적인 자산 관리를 시작해보세요."
      buttonText="자산 추가하기"
      buttonIcon={Plus}
      buttonPath="/assets/add"
    />
  );
};

export default AssetsEmptyState;
