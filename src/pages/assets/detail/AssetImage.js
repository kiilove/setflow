import { FaImage, FaDownload } from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const AssetImage = ({ asset }) => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
      <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center">
        <FaImage className="mr-2 text-primary h-4 w-4" />
        자산 이미지
      </h2>
      <div className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden border border-border">
        {asset.image ? (
          <img
            src={asset.image || "/placeholder.svg"}
            alt={asset.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=300&width=300";
              e.target.alt = "이미지를 불러올 수 없습니다";
            }}
          />
        ) : (
          <div className="text-muted-foreground text-sm flex flex-col items-center justify-center">
            <FaImage className="h-12 w-12 mb-2 opacity-20" />
            <span>이미지 없음</span>
          </div>
        )}
      </div>
      {asset.image && (
        <div className="mt-4">
          <button
            className={`${getButtonVariantClass(
              "outline"
            )} w-full px-4 py-2 rounded-md text-sm inline-flex items-center justify-center transition-colors hover:bg-primary/5`}
          >
            <FaDownload className="mr-1.5 h-3.5 w-3.5" />
            이미지 다운로드
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetImage;
