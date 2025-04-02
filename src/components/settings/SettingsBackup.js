"use client";

import { useState, useEffect } from "react";
import { dataService } from "../../data/mockData";
import {
  getStatusColorClass,
  getButtonVariantClass,
} from "../../utils/themeUtils";

const SettingsBackup = () => {
  const [backupHistory, setBackupHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBackupHistory = async () => {
      try {
        const data = await dataService.getBackupHistory();
        setBackupHistory(data);
        setLoading(false);
      } catch (error) {
        console.error("백업 이력을 불러오는 중 오류가 발생했습니다:", error);
        setLoading(false);
      }
    };

    fetchBackupHistory();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      const result = await dataService.createBackup();
      if (result.success) {
        setBackupHistory([result.backup, ...backupHistory]);
        setMessage({
          type: "success",
          text: "백업이 성공적으로 생성되었습니다.",
        });
      }
    } catch (error) {
      console.error("백업 생성 중 오류가 발생했습니다:", error);
      setMessage({ type: "error", text: "백업 생성 중 오류가 발생했습니다." });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (id) => {
    if (
      window.confirm(
        "정말로 이 백업을 복원하시겠습니까? 현재 데이터가 모두 백업 시점의 데이터로 대체됩니다."
      )
    ) {
      try {
        setLoading(true);
        const result = await dataService.restoreBackup(id);
        if (result.success) {
          setMessage({
            type: "success",
            text: "백업이 성공적으로 복원되었습니다.",
          });
        }
      } catch (error) {
        console.error("백업 복원 중 오류가 발생했습니다:", error);
        setMessage({
          type: "error",
          text: "백업 복원 중 오류가 발생했습니다.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">백업 및 복원</h2>
        <button
          onClick={handleCreateBackup}
          disabled={loading}
          className={`${getButtonVariantClass(
            "primary"
          )} px-4 py-2 rounded-md transition-colors disabled:opacity-50`}
        >
          {loading ? "처리 중..." : "백업 생성"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${getStatusColorClass(message.type)}`}>
          {message.text}
        </div>
      )}

      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-sm font-medium">
                  날짜
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  크기
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  생성자
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  비고
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {backupHistory.map((backup) => (
                <tr
                  key={backup.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">
                    {new Date(backup.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">{backup.size}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColorClass(
                        backup.status
                      )}`}
                    >
                      {backup.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{backup.createdBy}</td>
                  <td className="px-4 py-3 text-sm">{backup.notes}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button
                      onClick={() => handleRestoreBackup(backup.id)}
                      className={`${getButtonVariantClass(
                        "warning"
                      )} px-3 py-1 rounded-md text-xs transition-colors`}
                    >
                      복원
                    </button>
                  </td>
                </tr>
              ))}
              {backupHistory.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-3 text-sm text-center text-muted-foreground"
                  >
                    {loading
                      ? "백업 이력을 불러오는 중..."
                      : "백업 이력이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsBackup;
