"use client";

const DepreciationSection = ({
  formData,
  handleChange,
  handleDepreciationChange,
}) => {
  // 감가상각 방법 옵션
  const depreciationMethods = [
    { value: "straight-line", label: "정액법 (Straight-Line)" },
    { value: "declining-balance", label: "정률법 (Declining Balance)" },
    { value: "sum-of-years-digits", label: "연수합계법 (Sum-of-Years-Digits)" },
    {
      value: "units-of-production",
      label: "생산량비례법 (Units of Production)",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="depreciationMethod"
            className="block text-sm font-medium text-foreground"
          >
            감가상각 방법
          </label>
          <select
            id="depreciationMethod"
            name="depreciationMethod"
            value={formData.depreciation?.method || "straight-line"}
            onChange={handleDepreciationChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            {depreciationMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {formData.depreciation?.method === "straight-line" &&
              "정액법: 자산의 가치가 매년 동일한 금액으로 감가상각됩니다."}
            {formData.depreciation?.method === "declining-balance" &&
              "정률법: 자산의 장부가치에 일정 비율을 곱하여 감가상각됩니다."}
            {formData.depreciation?.method === "sum-of-years-digits" &&
              "연수합계법: 자산의 내용연수 합계를 기준으로 감가상각됩니다."}
            {formData.depreciation?.method === "units-of-production" &&
              "생산량비례법: 자산의 총 예상 생산량에 대한 실제 생산량 비율로 감가상각됩니다."}
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="depreciationYears"
            className="block text-sm font-medium text-foreground"
          >
            내용연수 (년)
          </label>
          <input
            type="number"
            id="depreciationYears"
            name="depreciationYears"
            value={formData.depreciation?.years || ""}
            onChange={handleDepreciationChange}
            min={1}
            max={50}
            placeholder="예: 5"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          <p className="text-xs text-muted-foreground">
            자산의 예상 사용 기간을 년 단위로 입력하세요.
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            잔존가치 유형
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="residualValueType"
                checked={
                  formData.depreciation?.residualValueType === "percentage"
                }
                onChange={() =>
                  handleDepreciationChange({
                    target: { name: "residualValueType", value: "percentage" },
                  })
                }
                className="h-4 w-4 text-primary border-input focus:ring-primary"
              />
              <span className="ml-2 text-sm text-foreground">퍼센트 (%)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="residualValueType"
                checked={formData.depreciation?.residualValueType === "fixed"}
                onChange={() =>
                  handleDepreciationChange({
                    target: { name: "residualValueType", value: "fixed" },
                  })
                }
                className="h-4 w-4 text-primary border-input focus:ring-primary"
              />
              <span className="ml-2 text-sm text-foreground">정액 (원)</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          {formData.depreciation?.residualValueType === "percentage" ? (
            <>
              <label
                htmlFor="residualValue"
                className="block text-sm font-medium text-foreground"
              >
                잔존가치 (%)
              </label>
              <input
                type="number"
                id="residualValue"
                name="residualValue"
                value={formData.depreciation?.residualValue || ""}
                onChange={handleDepreciationChange}
                min={0}
                max={100}
                step="0.1"
                placeholder="예: 10"
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                내용연수 종료 후 자산의 예상 잔존가치를 원가 대비 백분율로
                입력하세요.
              </p>
            </>
          ) : (
            <>
              <label
                htmlFor="residualValue"
                className="block text-sm font-medium text-foreground"
              >
                잔존가치 (원)
              </label>
              <input
                type="number"
                id="residualValue"
                name="residualValue"
                value={formData.depreciation?.residualValue || ""}
                onChange={handleDepreciationChange}
                min={0}
                placeholder="예: 100000"
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground">
                내용연수 종료 후 자산의 예상 잔존가치를 원 단위로 입력하세요.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepreciationSection;
