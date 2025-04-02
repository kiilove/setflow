"use client";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getButtonVariantClass } from "../../utils/themeUtils";

const SpecificationsSection = ({
  specFields,
  handleSpecChange,
  customFields,
  handleCustomFieldChange,
  addCustomField,
  removeCustomField,
  formData,
  handleChange,
}) => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* 카테고리 선택 드롭다운 */}
      <div className="mb-6">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-foreground mb-2"
        >
          카테고리 변경
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full md:w-1/2 rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
        <p className="text-xs text-muted-foreground mt-1">
          카테고리를 변경하면 사양 템플릿이 자동으로 업데이트됩니다.
        </p>
      </div>

      {/* 사양 정보 (템플릿 기반) */}
      {specFields.length > 0 && (
        <div className="mb-8">
          <div className="bg-primary/5 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">
              선택한 카테고리에 맞는 사양 정보를 입력하세요. 이 정보는 자산 관리
              및 검색에 활용됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label
                  htmlFor={`spec_${field.id}`}
                  className="block text-sm font-medium text-foreground"
                >
                  {field.label}
                </label>
                <input
                  type="text"
                  id={`spec_${field.id}`}
                  value={field.value}
                  onChange={(e) => handleSpecChange(field.id, e.target.value)}
                  placeholder={`${field.label} 입력`}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 커스텀 사양 필드 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-foreground">
            추가 사양 정보
          </h3>
          <button
            type="button"
            onClick={addCustomField}
            className={`${getButtonVariantClass(
              "outline"
            )} inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
          >
            <FaPlus className="mr-2 -ml-1 h-3 w-3" />
            필드 추가
          </button>
        </div>

        {customFields.length > 0 ? (
          <div className="space-y-4">
            {customFields.map((field, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border"
              >
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    필드명
                  </label>
                  <input
                    type="text"
                    placeholder="필드명"
                    value={field.name}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "name", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground">
                    값
                  </label>
                  <input
                    type="text"
                    placeholder="값"
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(index, "value", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomField(index)}
                  className="mt-8 p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="필드 삭제"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg border border-dashed border-border bg-muted/20">
            <p className="text-sm text-muted-foreground text-center mb-3">
              필드 추가 버튼을 클릭하여 추가 사양 정보를 입력할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={addCustomField}
              className={`${getButtonVariantClass(
                "outline"
              )} inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
            >
              <FaPlus className="mr-2 -ml-1 h-3 w-3" />
              필드 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificationsSection;
