"use client";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../../utils/themeUtils";

const AssetHeader = ({ asset, id, onDelete }) => {
  return (
    <div className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 shadow-sm border border-primary/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {asset.name || "이름 없음"}
          </h1>
          <div className="flex items-center mt-2">
            <span
              className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(
                asset.status || "미지정"
              )}`}
            >
              {asset.status || "상태 미지정"}
            </span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">
              {asset.category || "카테고리 없음"}
            </span>
            {asset.serialNumber && (
              <>
                <span className="mx-2 text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {asset.serialNumber}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/assets/edit/${id}`}
            className={`${getButtonVariantClass(
              "primary"
            )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
          >
            <FaEdit className="mr-2 -ml-1 h-4 w-4" />
            편집
          </Link>
          <button
            onClick={onDelete}
            className={`${getButtonVariantClass(
              "danger"
            )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
          >
            <FaTrash className="mr-2 -ml-1 h-4 w-4" />
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
