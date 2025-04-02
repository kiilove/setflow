"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSave, FaTimes, FaSearch } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const AssignmentsAdd = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const assetId = searchParams.get("assetId");

  const [formData, setFormData] = useState({
    assetId: assetId || "",
    assetName: "",
    userId: "",
    userName: "",
    department: "",
    assignedDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
  });

  // 자산 목록 (예시 데이터)
  const assets = [
    { id: "AST-001", name: "노트북 Dell XPS 15", status: "사용가능" },
    { id: "AST-002", name: "모니터 LG 27인치", status: "사용가능" },
    { id: "AST-003", name: "프린터 HP LaserJet", status: "사용가능" },
    { id: "AST-004", name: "태블릿 iPad Pro", status: "사용가능" },
    { id: "AST-005", name: "키보드 Logitech", status: "사용가능" },
  ];

  // 사용자 목록 (예시 데이터)
  const users = [
    { id: "USR-001", name: "김철수", department: "개발팀" },
    { id: "USR-002", name: "이영희", department: "마케팅팀" },
    { id: "USR-003", name: "박지민", department: "디자인팀" },
    { id: "USR-004", name: "최민수", department: "영업팀" },
    { id: "USR-005", name: "정다운", department: "인사팀" },
  ];

  // assetId가 있으면 해당 자산 정보 가져오기
  useEffect(() => {
    if (assetId) {
      const asset = assets.find((a) => a.id === assetId);
      if (asset) {
        setFormData((prev) => ({
          ...prev,
          assetId: asset.id,
          assetName: asset.name,
        }));
      }
    }
  }, [assetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssetSelect = (asset) => {
    setFormData((prev) => ({
      ...prev,
      assetId: asset.id,
      assetName: asset.name,
    }));
  };

  const handleUserSelect = (user) => {
    setFormData((prev) => ({
      ...prev,
      userId: user.id,
      userName: user.name,
      department: user.department,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 할당 등록 로직 구현
    console.log("할당 등록:", formData);
    alert("자산이 할당되었습니다.");
    // 폼 초기화 또는 리디렉션
  };

  return (
    <PageContainer title="자산 할당 등록">
      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 자산 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              자산 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="assetId"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  자산 ID <span className="text-destructive">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="assetId"
                    name="assetId"
                    required
                    value={formData.assetId}
                    onChange={handleChange}
                    className="flex-grow rounded-l-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-border rounded-r-md bg-input text-muted-foreground hover:bg-muted"
                    data-bs-toggle="modal"
                    data-bs-target="#assetModal"
                  >
                    <FaSearch className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="assetName"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  자산명
                </label>
                <input
                  type="text"
                  id="assetName"
                  name="assetName"
                  value={formData.assetName}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* 자산 선택 모달 (실제로는 모달 컴포넌트를 사용해야 함) */}
            <div className="mt-4 border border-border rounded-md p-4 bg-card">
              <h4 className="text-md font-medium text-foreground mb-2">
                자산 선택
              </h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        자산명
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        상태
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        선택
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {assets.map((asset) => (
                      <tr key={asset.id}>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {asset.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {asset.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {asset.status}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          <button
                            type="button"
                            onClick={() => handleAssetSelect(asset)}
                            className="text-primary hover:text-primary/80"
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              사용자 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  사용자 ID <span className="text-destructive">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    required
                    value={formData.userId}
                    onChange={handleChange}
                    className="flex-grow rounded-l-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-border rounded-r-md bg-input text-muted-foreground hover:bg-muted"
                    data-bs-toggle="modal"
                    data-bs-target="#userModal"
                  >
                    <FaSearch className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  사용자명
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  부서
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* 사용자 선택 모달 (실제로는 모달 컴포넌트를 사용해야 함) */}
            <div className="mt-4 border border-border rounded-md p-4 bg-card">
              <h4 className="text-md font-medium text-foreground mb-2">
                사용자 선택
              </h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        이름
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        부서
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                        선택
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {user.id}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {user.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          {user.department}
                        </td>
                        <td className="px-4 py-2 text-sm text-foreground">
                          <button
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className="text-primary hover:text-primary/80"
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 할당 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              할당 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="assignedDate"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  할당일 <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="assignedDate"
                  name="assignedDate"
                  required
                  value={formData.assignedDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  만료일
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  비고
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-input px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/assignments"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${getButtonVariantClass(
                "secondary"
              )}`}
            >
              <FaTimes className="mr-2 -ml-1 h-4 w-4" />
              취소
            </Link>
            <button
              type="submit"
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${getButtonVariantClass(
                "primary"
              )}`}
            >
              <FaSave className="mr-2 -ml-1 h-4 w-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default AssignmentsAdd;
