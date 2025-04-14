import InfoSection, { InfoItem } from "./InfoSection";
import { FaInfoCircle } from "react-icons/fa";
import { getStatusColorClass } from "../../../utils/themeUtils";

const BasicInfo = ({ asset }) => {
  return (
    <InfoSection title="기본 정보" icon={FaInfoCircle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem label="자산명" value={asset.name || "-"} />
        <InfoItem label="카테고리" value={asset.category || "-"} />
        <InfoItem label="시리얼 번호" value={asset.serialNumber || "-"} />
        <InfoItem label="모델명" value={asset.model || "-"} />
        <InfoItem label="제조사" value={asset.manufacturer || "-"} />
        <InfoItem
          label="상태"
          value={
            <span
              className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                asset.status || "미지정"
              )}`}
            >
              {asset.status || "상태 미지정"}
            </span>
          }
        />
      </div>
    </InfoSection>
  );
};

export default BasicInfo;
