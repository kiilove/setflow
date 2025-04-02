"use client";

const CategorySection = ({ formData, handleChange }) => {
  return (
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
        value={formData.category}
        onChange={handleChange}
        className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      >
        <option value="">카테고리 선택</option>
        <optgroup label="컴퓨터 장비">
          <option value="데스크탑">데스크탑</option>
          <option value="노트북">노트북</option>
          <option value="모니터">모니터</option>
          <option value="모바일기기">모바일기기</option>
          <option value="주변기기">주변기기</option>
        </optgroup>
        <optgroup label="사무 장비">
          <option value="사무기기">사무기기</option>
          <option value="가구">가구</option>
        </optgroup>
        <optgroup label="IT 인프라">
          <option value="서버">서버</option>
          <option value="네트워크장비">네트워크장비</option>
          <option value="소프트웨어">소프트웨어</option>
        </optgroup>
        <option value="기타">기타</option>
      </select>
      <p className="text-xs text-muted-foreground">
        자산의 종류를 선택하세요. 카테고리에 따라 사양 정보가 달라집니다.
      </p>

      {formData.category && (
        <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-md">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <span className="font-medium">선택된 카테고리:</span>{" "}
            {formData.category}
          </p>
          <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
            이 카테고리에 맞는 정보를 아래 섹션에서 입력해주세요.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
