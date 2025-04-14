"use client";
import { useState } from "react";
import {
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const DisposeModal = ({
  showDisposeModal,
  setShowDisposeModal,
  asset,
  onDisposeSubmit,
  isSubmitting,
}) => {
  const [disposeReason, setDisposeReason] = useState("");
  const [confirmDispose, setConfirmDispose] = useState(false);

  if (!showDisposeModal || !asset) return null;

  // 모달 내부 클릭 시 이벤트 전파 중지
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmDispose) return;
    onDisposeSubmit(disposeReason);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowDisposeModal(false)}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center">
              <FaTrashAlt className="mr-2 text-red-500" />
              자산 폐기
            </h2>
            <button
              onClick={() => setShowDisposeModal(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 mb-6">
                <FaExclamationTriangle className="text-red-500 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">
                    경고: 이 작업은 되돌릴 수 없습니다
                  </p>
                  <p className="text-sm text-muted-foreground">
                    자산 "{asset.name || "이름 없음"}"을(를) 폐기하려고 합니다.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="disposeReason"
                    className="block text-sm font-medium text-muted-foreground mb-1"
                  >
                    폐기 사유 <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="disposeReason"
                    value={disposeReason}
                    onChange={(e) => setDisposeReason(e.target.value)}
                    rows={4}
                    required
                    placeholder="폐기 사유를 입력하세요"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={confirmDispose}
                      onChange={(e) => setConfirmDispose(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                      required
                    />
                    <span className="text-sm text-foreground">
                      이 자산을 폐기하고 싶다는 것을 확인합니다. 이 작업은
                      되돌릴 수 없습니다.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDisposeModal(false);
                }}
                className="px-4 py-2 rounded-md border border-input bg-background hover:bg-muted transition-colors flex items-center"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                취소
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                  "danger"
                )} flex items-center`}
                disabled={
                  isSubmitting || !confirmDispose || !disposeReason.trim()
                }
                onClick={(e) => e.stopPropagation()}
              >
                {isSubmitting ? (
                  <div className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                ) : (
                  <FaTrashAlt className="mr-2 h-4 w-4" />
                )}
                폐기 확인
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DisposeModal;
