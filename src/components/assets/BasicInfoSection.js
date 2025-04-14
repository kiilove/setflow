"use client";

const BasicInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground"
          >
            자산명 <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="자산의 이름을 입력하세요"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            자산을 식별할 수 있는 고유한 이름을 입력하세요.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="serialNumber"
            className="block text-sm font-medium text-foreground"
          >
            시리얼 번호
          </label>
          <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber || ""}
            onChange={handleChange}
            placeholder="제품의 시리얼 번호"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="model"
            className="block text-sm font-medium text-foreground"
          >
            모델명
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model || ""}
            onChange={handleChange}
            placeholder="제품의 모델명"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="manufacturer"
            className="block text-sm font-medium text-foreground"
          >
            제조사
          </label>
          <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            value={formData.manufacturer || ""}
            onChange={handleChange}
            placeholder="제조사 이름"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-foreground"
          >
            상태 <span className="text-destructive">*</span>
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status || "사용가능"}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="사용가능">사용가능</option>
            <option value="사용중">사용중</option>
            <option value="수리중">수리중</option>
            <option value="폐기예정">폐기예정</option>
            <option value="분실">분실</option>
          </select>
          <p className="text-xs text-muted-foreground">
            자산의 현재 상태를 선택하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
