"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  Trash2,
} from "lucide-react";
import { formatDate } from "../../utils/dateUtils";
import ModalMessage from "../common/ModalMessage";
import { deleteFileFromStorage } from "../../utils/fileUtils";

/**
 * 사용자 카드 컴포넌트
 * 그리드 뷰에서 사용자 정보를 표시합니다.
 */
const UserCard = ({ user, onClick, onDelete, isSelected, onSelect }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation(); // 이벤트 전파 중단
    try {
      // 프로필 이미지가 있는 경우 삭제
      if (user.profileImage) {
        await deleteFileFromStorage(user.profileImage);
      }
      // 사용자 데이터 삭제
      onDelete(user.id, user.name);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("사용자 삭제 중 오류 발생:", error);
    }
  };

  return (
    <>
      <div
        className={`relative group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer ${
          isSelected ? "ring-2 ring-indigo-500" : ""
        }`}
        onClick={onClick}
      >
        {/* 프로필 이미지 영역 */}
        <div className="relative h-40 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-16 h-16 text-indigo-400 dark:text-indigo-500" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* 사용자 정보 영역 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-indigo-600 dark:text-indigo-400">
                {user.employeeNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.gender || "-"}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-indigo-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-indigo-500" />
              <span>{user.phone || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-indigo-500" />
              <span>{user.department || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-500" />
              <span>{user.position || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              <span>{user.location || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              <span>{formatDate(user.joinDate) || "-"}</span>
            </div>
            {user.notes && (
              <div className="flex items-start gap-2 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <ModalMessage
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="사용자 삭제"
        message={`${user.name} 사용자를 삭제하시겠습니까?`}
        type="confirm"
        actions={[
          {
            label: "취소",
            onClick: () => setShowDeleteModal(false),
            variant: "outline",
          },
          {
            label: "삭제",
            onClick: handleDelete,
            variant: "error",
          },
        ]}
      />
    </>
  );
};

export default UserCard;
