"use client";
import { Link } from "react-router-dom";
import {
  FaExchangeAlt,
  FaTools,
  FaHistory,
  FaQrcode,
  FaDownload,
  FaPrint,
  FaUndo,
  FaTrashAlt,
} from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const ActionButtons = ({
  id,
  onAssignClick,
  onReturnClick,
  onDisposeClick,
  status,
}) => {
  // 자산 상태에 따라 버튼 표시 여부 결정
  const canAssign =
    status !== "폐기됨" && status !== "폐기예정" && status !== "분실";
  const canReturn = status === "사용중";
  const canDispose = status !== "폐기됨";

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {/* 할당 버튼 */}
      {canAssign && (
        <button
          onClick={onAssignClick}
          className={`${getButtonVariantClass(
            "success"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
        >
          <FaExchangeAlt className="mr-2 -ml-1 h-4 w-4" />
          할당
        </button>
      )}

      {/* 반납 버튼 */}
      {canReturn && onReturnClick && (
        <button
          onClick={onReturnClick}
          className={`${getButtonVariantClass(
            "warning"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
        >
          <FaUndo className="mr-2 -ml-1 h-4 w-4" />
          반납
        </button>
      )}

      {/* 폐기 버튼 */}
      {canDispose && onDisposeClick && (
        <button
          onClick={onDisposeClick}
          className={`${getButtonVariantClass(
            "danger"
          )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors`}
        >
          <FaTrashAlt className="mr-2 -ml-1 h-4 w-4" />
          폐기
        </button>
      )}

      {/* 유지보수 버튼 */}
      <Link
        to={`/maintenance/add?assetId=${id}`}
        className={`${getButtonVariantClass(
          "outline"
        )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
      >
        <FaTools className="mr-2 -ml-1 h-4 w-4" />
        유지보수
      </Link>

      {/* 이력 버튼 */}
      <Link
        to={`/assets/history?assetId=${id}`}
        className={`${getButtonVariantClass(
          "outline"
        )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
      >
        <FaHistory className="mr-2 -ml-1 h-4 w-4" />
        이력
      </Link>

      {/* QR 코드 버튼 */}
      <button
        className={`${getButtonVariantClass(
          "outline"
        )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
      >
        <FaQrcode className="mr-2 -ml-1 h-4 w-4" />
        QR 코드
      </button>

      {/* 내보내기 버튼 */}
      <button
        className={`${getButtonVariantClass(
          "outline"
        )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
      >
        <FaDownload className="mr-2 -ml-1 h-4 w-4" />
        내보내기
      </button>

      {/* 인쇄 버튼 */}
      <button
        className={`${getButtonVariantClass(
          "outline"
        )} inline-flex items-center px-3 py-2 rounded-md shadow-sm text-sm font-medium transition-colors hover:bg-primary/5`}
      >
        <FaPrint className="mr-2 -ml-1 h-4 w-4" />
        인쇄
      </button>
    </div>
  );
};

export default ActionButtons;
