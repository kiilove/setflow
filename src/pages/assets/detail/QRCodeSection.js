import { FaQrcode, FaDownload, FaPrint } from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const QRCodeSection = ({ assetId }) => {
  if (!assetId) return null;

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
        <FaQrcode className="mr-2 text-primary h-4 w-4" />
        QR 코드
      </h2>
      <div className="aspect-square bg-white rounded-md flex items-center justify-center p-4 border border-border">
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=asset:${assetId}`}
          alt="자산 QR 코드"
          className="w-full h-full"
          onError={(e) => {
            e.target.alt = "QR 코드를 불러올 수 없습니다";
          }}
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className={`${getButtonVariantClass(
            "outline"
          )} flex-1 px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
        >
          <FaDownload className="mr-1.5 h-3.5 w-3.5" />
          다운로드
        </button>
        <button
          className={`${getButtonVariantClass(
            "outline"
          )} flex-1 px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
        >
          <FaPrint className="mr-1.5 h-3.5 w-3.5" />
          인쇄
        </button>
      </div>
    </div>
  );
};

export default QRCodeSection;
