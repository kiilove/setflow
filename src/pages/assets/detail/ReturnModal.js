"use client";
import { useState } from "react";
import { FaUndo, FaInfoCircle, FaTimes, FaSave } from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const ReturnModal = ({
  showReturnModal,
  setShowReturnModal,
  asset,
  onReturnSubmit,
  isSubmitting,
}) => {
  const [returnNotes, setReturnNotes] = useState("");

  if (!showReturnModal || !asset) return null;

  // 모달 내부 클릭 시 이벤트 전파 중지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onReturnSubmit(returnNotes);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowReturnModal(false)}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <FaUndo className="mr-2 text-amber-500" />
              자산 반납
            </h2>
            <button
              onClick={() => setShowReturnModal(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 mb-6">
                <FaInfoCircle className="text-amber-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    {asset.name || "이름 없음"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {asset.assignedTo
                      ? `현재 담당자: ${asset.assignedTo}`
                      : "담당자 없음"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="returnNotes"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    반납 비고
                  </label>
                  <textarea
                    id="returnNotes"
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    rows={4}
                    placeholder="반납 사유나 자산 상태 등 추가 정보를 입력하세요"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReturnModal(false);
                }}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                취소
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                  "warning"
                )} flex items-center`}
                disabled={isSubmitting}
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting ? (
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                ) : (
                  <FaSave className="mr-2 h-4 w-4" />
                )}
                반납 완료
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnModal;
