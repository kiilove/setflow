"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  MapPin,
} from "lucide-react";
import { getStatusColorClass } from "../../utils/themeUtils";

/**
 * 사용자 카드 컴포넌트
 * 그리드 뷰에서 사용자 정보를 표시합니다.
 */
const UserCard = ({ user, onClick, onDelete, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 상태에 따른 색상 클래스
  const statusColorClass = getStatusColorClass(user.status);

  // 프로필 이미지 또는 이니셜
  const renderProfileImage = () => {
    if (user.profileImage) {
      return (
        <img
          src={user.profileImage || "/placeholder.svg"}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      );
    } else {
      // 이름의 첫 글자를 이니셜로 사용
      const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
      return (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
          {initial}
        </div>
      );
    }
  };

  return (
    <div
      className={`bg-card border rounded-lg shadow-sm overflow-hidden transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 체크박스 (선택 기능이 있는 경우) */}
      {onSelect && (
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(user.id, e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </div>
      )}

      {/* 카드 내용 */}
      <div className="cursor-pointer" onClick={() => onClick(user)}>
        {/* 프로필 헤더 */}
        <div className="relative pt-6 pb-10 px-6 border-b border-border">
          {/* 상태 표시 */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}`}
            >
              {user.status}
            </span>
          </div>

          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
              {renderProfileImage()}
            </div>
          </div>

          {/* 이름 및 직책 */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">
              {user.position} · {user.department}
            </p>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="p-4 space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-muted-foreground truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-muted-foreground">{user.phone}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Building className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-muted-foreground">{user.department}</span>
          </div>
          <div className="flex items-center text-sm">
            <Briefcase className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-muted-foreground">{user.position}</span>
          </div>
          {user.joinDate && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-teal-500 mr-2" />
              <span className="text-muted-foreground">
                {formatDate(user.joinDate)}
              </span>
            </div>
          )}
          {user.location && (
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-pink-500 mr-2" />
              <span className="text-muted-foreground">{user.location}</span>
            </div>
          )}
        </div>

        {/* 작업 버튼 */}
        <div className="border-t border-border p-3 bg-muted/30 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(user.id, user.name);
            }}
            className="text-destructive hover:text-destructive/80 p-1 rounded-md hover:bg-destructive/10"
            title="사용자 삭제"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

export default UserCard;
