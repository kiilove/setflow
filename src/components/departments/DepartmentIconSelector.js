"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import {
  Building,
  Building2,
  Landmark,
  Factory,
  Home,
  Store,
  Warehouse,
  School,
  Library,
  Hospital,
  Hotel,
  Briefcase,
  Users,
  UserCog,
  Code,
  PenTool,
  Brush,
  LineChart,
  BarChart,
  ShoppingCart,
  Truck,
  Wrench,
  Cog,
  HeartPulse,
  BookOpen,
  Microscope,
  Beaker,
  Laptop,
  Server,
  Shield,
  Headphones,
  Coffee,
  Utensils,
  Leaf,
  Plane,
  Car,
  Train,
  Ship,
  Zap,
  Droplet,
  Flame,
  Globe,
} from "lucide-react";
import { getButtonVariantClass } from "../../utils/themeUtils";

// 아이콘 색상 옵션
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

// 부서에 특화된 아이콘 목록
const departmentIcons = [
  // 건물/시설 관련
  { name: "Building", Icon: Building, category: "건물/시설" },
  { name: "Building2", Icon: Building2, category: "건물/시설" },
  { name: "Landmark", Icon: Landmark, category: "건물/시설" },
  { name: "Factory", Icon: Factory, category: "건물/시설" },
  { name: "Home", Icon: Home, category: "건물/시설" },
  { name: "Store", Icon: Store, category: "건물/시설" },
  { name: "Warehouse", Icon: Warehouse, category: "건물/시설" },
  { name: "School", Icon: School, category: "건물/시설" },
  { name: "Library", Icon: Library, category: "건물/시설" },
  { name: "Hospital", Icon: Hospital, category: "건물/시설" },
  { name: "Hotel", Icon: Hotel, category: "건물/시설" },

  // 부서/팀 관련
  { name: "Briefcase", Icon: Briefcase, category: "부서/팀" },
  { name: "Users", Icon: Users, category: "부서/팀" },
  { name: "UserCog", Icon: UserCog, category: "부서/팀" },

  // 직무 관련
  { name: "Code", Icon: Code, category: "직무" },
  { name: "PenTool", Icon: PenTool, category: "직무" },
  { name: "Brush", Icon: Brush, category: "직무" },
  { name: "LineChart", Icon: LineChart, category: "직무" },
  { name: "BarChart", Icon: BarChart, category: "직무" },
  { name: "ShoppingCart", Icon: ShoppingCart, category: "직무" },
  { name: "Truck", Icon: Truck, category: "직무" },
  { name: "Wrench", Icon: Wrench, category: "직무" },
  { name: "Cog", Icon: Cog, category: "직무" },

  // 산업 관련
  { name: "HeartPulse", Icon: HeartPulse, category: "산업" },
  { name: "BookOpen", Icon: BookOpen, category: "산업" },
  { name: "Microscope", Icon: Microscope, category: "산업" },
  { name: "Beaker", Icon: Beaker, category: "산업" },
  { name: "Laptop", Icon: Laptop, category: "산업" },
  { name: "Server", Icon: Server, category: "산업" },
  { name: "Shield", Icon: Shield, category: "산업" },
  { name: "Headphones", Icon: Headphones, category: "산업" },
  { name: "Coffee", Icon: Coffee, category: "산업" },
  { name: "Utensils", Icon: Utensils, category: "산업" },
  { name: "Leaf", Icon: Leaf, category: "산업" },

  // 교통/인프라
  { name: "Plane", Icon: Plane, category: "교통/인프라" },
  { name: "Car", Icon: Car, category: "교통/인프라" },
  { name: "Train", Icon: Train, category: "교통/인프라" },
  { name: "Ship", Icon: Ship, category: "교통/인프라" },
  { name: "Zap", Icon: Zap, category: "교통/인프라" },
  { name: "Droplet", Icon: Droplet, category: "교통/인프라" },
  { name: "Flame", Icon: Flame, category: "교통/인프라" },
  { name: "Globe", Icon: Globe, category: "교통/인프라" },
];

const DepartmentIconSelector = ({
  selectedIcon,
  selectedColor,
  onSelectIcon,
  onSelectColor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState(departmentIcons);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const modalRef = useRef(null);

  // 고유한 카테고리 목록 생성
  const categories = [
    "전체",
    ...new Set(departmentIcons.map((icon) => icon.category)),
  ];

  // 검색어와 카테고리에 따라 아이콘 필터링
  useEffect(() => {
    let filtered = departmentIcons;

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      filtered = filtered.filter((icon) => icon.category === selectedCategory);
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter((icon) =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredIcons(filtered);
  }, [searchTerm, selectedCategory]);

  // 모달 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 아이콘 선택 핸들러
  const handleSelectIcon = (iconName) => {
    onSelectIcon(iconName);
    setIsOpen(false);
  };

  // 현재 선택된 아이콘 컴포넌트 가져오기
  const getSelectedIconComponent = () => {
    const foundIcon = departmentIcons.find(
      (icon) => icon.name === selectedIcon
    );
    if (foundIcon) {
      return foundIcon.Icon;
    }
    return Building; // 기본 아이콘
  };

  const SelectedIconComponent = getSelectedIconComponent();

  return (
    <div className="relative">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          부서 아이콘 선택
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`flex items-center justify-center w-12 h-12 rounded-md border border-input ${
              selectedColor?.bg || "bg-gray-100"
            } ${
              selectedColor?.text || "text-gray-500"
            } hover:border-primary transition-colors`}
          >
            <SelectedIconComponent className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              {selectedIcon || "아이콘 선택"}
            </p>
            <p className="text-xs text-muted-foreground">
              아이콘을 클릭하여 변경하세요
            </p>
          </div>
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="mt-4 space-y-2">
        <label className="block text-sm font-medium text-foreground">
          아이콘 색상
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelectColor(color)}
              className={`w-8 h-8 rounded-full ${color.bg} ${
                color.text
              } flex items-center justify-center ${
                selectedColor?.name === color.name
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
              title={color.name}
            >
              {selectedColor?.name === color.name && <X className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* 아이콘 선택 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-background rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">부서 아이콘 선택</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 border-b border-border space-y-4">
              {/* 검색창 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <input
                  type="text"
                  placeholder="아이콘 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* 카테고리 필터 */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
              {filteredIcons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                  {filteredIcons.map((icon) => {
                    const IconComponent = icon.Icon;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => handleSelectIcon(icon.name)}
                        className={`p-3 rounded-md flex flex-col items-center justify-center hover:bg-muted transition-colors ${
                          selectedIcon === icon.name
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : "border border-transparent"
                        }`}
                      >
                        <IconComponent className="h-6 w-6 mb-1" />
                        <span className="text-xs text-center truncate w-full">
                          {icon.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`px-4 py-2 rounded-md text-sm ${getButtonVariantClass(
                  "outline"
                )}`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentIconSelector;
