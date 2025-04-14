import InfoSection, { InfoItem } from "./InfoSection";
import { FaMicrochip } from "react-icons/fa";
import specTemplates from "../../../data/specTemplates";

const SpecsInfo = ({ specifications, customSpecifications = {} }) => {
  // 사양 정보가 없거나 비어있는 경우
  const hasSpecifications =
    (specifications && Object.keys(specifications).length > 0) ||
    (customSpecifications && Object.keys(customSpecifications).length > 0);

  // 필드 ID에 해당하는 라벨을 찾는 함수
  const getFieldLabel = (fieldId, category) => {
    // 모든 카테고리의 템플릿을 검색
    for (const [templateCategory, fields] of Object.entries(specTemplates)) {
      // 카테고리가 지정된 경우 해당 카테고리만 검색
      if (category && templateCategory !== category) continue;

      // 필드 ID에 해당하는 라벨 찾기
      const field = fields.find((f) => f.id === fieldId);
      if (field) return field.label;
    }

    // 템플릿에 없는 경우 필드 ID를 대문자로 변환하여 반환
    return fieldId.charAt(0).toUpperCase() + fieldId.slice(1);
  };

  return (
    <InfoSection title="사양" icon={FaMicrochip}>
      {hasSpecifications ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 사양 정보 */}
          {specifications &&
            Object.entries(specifications).map(
              ([key, value]) =>
                value && (
                  <InfoItem
                    key={key}
                    label={getFieldLabel(key)}
                    value={value || "-"}
                  />
                )
            )}

          {/* 커스텀 사양 정보 */}
          {customSpecifications &&
            Object.entries(customSpecifications).map(
              ([key, value]) =>
                value && (
                  <InfoItem
                    key={`custom-${key}`}
                    label={key}
                    value={value || "-"}
                  />
                )
            )}
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-4">
          사양 정보가 없습니다.
        </div>
      )}
    </InfoSection>
  );
};

export default SpecsInfo;
