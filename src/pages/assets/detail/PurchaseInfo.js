import InfoSection, { InfoItem } from "./InfoSection";
import { FaMoneyBillWave, FaCalendarAlt, FaBuilding } from "react-icons/fa";

const PurchaseInfo = ({ asset, formatDate, formatCurrency }) => {
  // 감가상각률 계산
  const calculateDepreciation = () => {
    if (!asset.purchasePrice || !asset.currentValue) return "-";
    if (asset.purchasePrice <= 0) return "-";

    const depreciation = Math.round(
      ((asset.purchasePrice - asset.currentValue) / asset.purchasePrice) * 100
    );
    return `${depreciation}%`;
  };

  return (
    <InfoSection title="구매 정보" icon={FaMoneyBillWave}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem
          label="구매일"
          value={formatDate(asset.purchaseDate)}
          icon={FaCalendarAlt}
        />
        <InfoItem
          label="구매 가격"
          value={formatCurrency(asset.purchasePrice)}
          icon={FaMoneyBillWave}
        />
        <InfoItem
          label="공급업체"
          value={asset.supplier || "-"}
          icon={FaBuilding}
        />
        <InfoItem
          label="보증 만료일"
          value={formatDate(asset.warrantyExpiry)}
          icon={FaCalendarAlt}
        />
        <InfoItem
          label="현재 가치"
          value={formatCurrency(asset.currentValue)}
          icon={FaMoneyBillWave}
        />
        <InfoItem label="감가상각률" value={calculateDepreciation()} />
      </div>
    </InfoSection>
  );
};

export default PurchaseInfo;
