"use client";

import React, { useState } from "react";
import * as Icons from "lucide-react";

/**
 * 부서 아이콘 선택 컴포넌트
 * @param {Object} props
 * @param {string} props.selectedIcon - 선택된 아이콘 이름
 * @param {Object} props.selectedColor - 선택된 색상 객체 {name, bg, text}
 * @param {Function} props.onSelectIcon - 아이콘 선택 핸들러
 * @param {Function} props.onSelectColor - 색상 선택 핸들러
 */
const DepartmentIconSelector = ({
  selectedIcon,
  selectedColor,
  onSelectIcon,
  onSelectColor,
}) => {
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 아이콘 목록 (부서 관련 아이콘만 포함)
  const departmentIcons = [
    "Building",
    "Building2",
    "Briefcase",
    "Users",
    "UserCircle",
    "Landmark",
    "Home",
    "Factory",
    "Network",
    "Globe",
    "Laptop",
    "Smartphone",
    "Wrench",
    "Settings",
    "Code",
    "PenTool",
    "Palette",
    "FileText",
    "BarChart",
    "DollarSign",
    "ShoppingCart",
    "HeartPulse",
    "GraduationCap",
    "BookOpen",
    "Coffee",
    "Utensils",
  ];

  // 색상 옵션
  const colorOptions = [
    { name: "기본", bg: "bg-gray-100", text: "text-gray-500" },
    { name: "빨강", bg: "bg-red-100", text: "text-red-500" },
    { name: "주황", bg: "bg-orange-100", text: "text-orange-500" },
    { name: "노랑", bg: "bg-yellow-100", text: "text-yellow-500" },
    { name: "초록", bg: "bg-green-100", text: "text-green-500" },
    { name: "청록", bg: "bg-teal-100", text: "text-teal-500" },
    { name: "파랑", bg: "bg-blue-100", text: "text-blue-500" },
    { name: "남색", bg: "bg-indigo-100", text: "text-indigo-500" },
    { name: "보라", bg: "bg-purple-100", text: "text-purple-500" },
    { name: "분홍", bg: "bg-pink-100", text: "text-pink-500" },
  ];

  // 아이콘 렌더링 함수
  const renderIcon = (iconName) => {
    if (Icons[iconName]) {
      return React.createElement(Icons[iconName], {
        className: "h-5 w-5",
      });
    }
    return null;
  };

  // 검색어에 따른 아이콘 필터링
  const filteredIcons = departmentIcons.filter((icon) =>
    icon.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        부서 아이콘 및 색상
      </label>

      <div className="flex flex-wrap gap-4">
        {/* 선택된 아이콘 표시 */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">아이콘</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center justify-center w-12 h-12 rounded-md border border-input bg-background hover:bg-muted transition-colors"
            >
              {selectedIcon && renderIcon(selectedIcon)}
            </button>
            {showIconPicker && (
              <div className="absolute z-10 mt-2 p-4 bg-card border border-border rounded-md shadow-lg w-72">
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="아이콘 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto">
                  {filteredIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        onSelectIcon(icon);
                        setShowIconPicker(false);
                        setSearchTerm("");
                      }}
                      className={`flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors ${
                        selectedIcon === icon
                          ? "bg-primary/10 border border-primary"
                          : ""
                      }`}
                      title={icon}
                    >
                      {renderIcon(icon)}
                    </button>
                  ))}
                </div>
                {filteredIcons.length === 0 && (
                  <div className="text-center py-2 text-muted-foreground">
                    검색 결과가 없습니다
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 선택된 색상 표시 */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">색상</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`flex items-center justify-center w-12 h-12 rounded-md border border-input ${selectedColor.bg} ${selectedColor.text} hover:opacity-90 transition-opacity`}
            >
              {selectedIcon && renderIcon(selectedIcon)}
            </button>
            {showColorPicker && (
              <div className="absolute z-10 mt-2 p-4 bg-card border border-border rounded-md shadow-lg w-72">
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        onSelectColor(color);
                        setShowColorPicker(false);
                      }}
                      className={`flex items-center justify-center p-2 rounded-md ${
                        color.bg
                      } ${color.text} hover:opacity-90 transition-opacity ${
                        selectedColor.name === color.name
                          ? "ring-2 ring-primary"
                          : ""
                      }`}
                      title={color.name}
                    >
                      {selectedIcon && renderIcon(selectedIcon)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 선택된 아이콘 및 색상 정보 */}
        <div className="flex-grow">
          <div className="text-sm text-muted-foreground mb-1">미리보기</div>
          <div className="flex items-center gap-2 p-2 border border-border rounded-md">
            <div
              className={`p-2 rounded-full ${selectedColor.bg} ${selectedColor.text}`}
            >
              {selectedIcon && renderIcon(selectedIcon)}
            </div>
            <div>
              <div className="text-sm font-medium">
                {selectedIcon || "아이콘 선택"}
              </div>
              <div className="text-xs text-muted-foreground">
                {selectedColor.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        부서를 대표하는 아이콘과 색상을 선택하세요. 아이콘은 부서 목록과 상세
        페이지에 표시됩니다.
      </p>
    </div>
  );
};

export default DepartmentIconSelector;
