import InfoSection, { InfoItem } from "./InfoSection";
import {
  FaMapMarkerAlt,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";

const LocationInfo = ({ asset, formatDate }) => {
  return (
    <InfoSection title="위치 및 할당 정보" icon={FaMapMarkerAlt}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem
          label="위치"
          value={asset.location || "-"}
          icon={FaMapMarkerAlt}
        />
        <InfoItem
          label="할당 대상"
          value={asset.assignedTo || "할당되지 않음"}
          icon={FaUser}
        />
        <InfoItem
          label="부서"
          value={asset.department || "-"}
          icon={FaBuilding}
        />
        <InfoItem
          label="할당일"
          value={formatDate(asset.assignedDate)}
          icon={FaCalendarAlt}
        />
      </div>
    </InfoSection>
  );
};

export default LocationInfo;
