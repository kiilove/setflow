"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";

const CategorySection = ({ formData, handleChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getCollection } = useFirestore("categories");

  // 그룹 우선순위 정의 (컴퓨터 관리 회사에 맞게 순서 지정)
  const groupPriority = [
    "컴퓨터/IT장비",
    "네트워크/인프라",
    "모바일/통신장비",
    "소프트웨어/라이센스",
    "테스트/측정장비",
    "차량/운송장비",
    "사무/비품",
    "기타",
  ];

  // Firestore에서 카테고리 데이터 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCollection();

        // 카테고리를 그룹화
        const groupedCategories = data.reduce((groups, category) => {
          // 그룹이 없으면 '기타'로 설정
          const group = category.group || "기타";
          if (!groups[group]) {
            groups[group] = [];
          }
          groups[group].push(category);
          return groups;
        }, {});

        // 각 그룹 내에서 카테고리 이름으로 정렬
        Object.keys(groupedCategories).forEach((group) => {
          groupedCategories[group].sort((a, b) => a.name.localeCompare(b.name));
        });

        setCategories(groupedCategories);
      } catch (error) {
        console.error(
          "카테고리 데이터를 불러오는 중 오류가 발생했습니다:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [getCollection]);

  // 정렬된 그룹 키 배열 생성
  const sortedGroupKeys = Object.keys(categories).sort((a, b) => {
    const indexA = groupPriority.indexOf(a);
    const indexB = groupPriority.indexOf(b);

    // 우선순위 배열에 없는 그룹은 맨 뒤로
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-2">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-foreground"
        >
          카테고리 <span className="text-destructive">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category || ""}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          disabled={loading}
        >
          <option value="">카테고리 선택</option>

          {loading ? (
            <option value="" disabled>
              카테고리 로딩 중...
            </option>
          ) : (
            sortedGroupKeys.map((group) => (
              <optgroup key={group} label={group}>
                {categories[group].map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            ))
          )}
        </select>
        <p className="text-xs text-muted-foreground">
          자산의 종류를 선택하세요. 카테고리에 따라 사양 정보가 달라집니다.
        </p>

        {formData.category && (
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <span className="font-medium">선택된 카테고리:</span>{" "}
              {formData.category}
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              이 카테고리에 맞는 정보를 아래 섹션에서 입력해주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySection;
