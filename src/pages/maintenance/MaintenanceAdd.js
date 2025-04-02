"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaSearch } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const MaintenanceAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const assetId = searchParams.get("assetId");

  const [formData, setFormData] = useState({
    assetId: assetId || "",
    assetName: "",
    type: "정기점검",
    scheduledDate: new Date().toISOString().split("T")[0],
    estimatedCompletionDate: "",
    technician: "",
    technicianContact: "",
    priority: "중간",
    estimatedCost: "",
    notes: "",
  });

  // 자산 목록 (예시 데이터)
  const assets = [
    {
      id: "AST-001",
      name: "노트북 Dell XPS 15",
      category: "노트북",
      location: "본사 3층",
    },
    {
      id: "AST-002",
      name: "모니터 LG 27인치",
      category: "모니터",
      location: "본사 2층",
    },
    {
      id: "AST-003",
      name: "프린터 HP LaserJet",
      category: "프린터",
      location: "본사 2층",
    },
    {
      id: "AST-004",
      name: "태블릿 iPad Pro",
      category: "태블릿",
      location: "외부",
    },
    {
      id: "AST-005",
      name: "서버 Dell PowerEdge",
      category: "서버",
      location: "서버실",
    },
    {
      id: "AST-008",
      name: "네트워크 스위치",
      category: "네트워크장비",
      location: "서버실",
    },
    {
      id: "AST-015",
      name: "UPS 시스템",
      category: "전원장비",
      location: "서버실",
    },
  ];

  // 기술자 목록 (예시 데이터)
  const technicians = [
    {
      id: 1,
      name: "박기술자",
      specialty: "하드웨어",
      contact: "010-1234-5678",
    },
    {
      id: 2,
      name: "이수리",
      specialty: "프린터/스캐너",
      contact: "010-2345-6789",
    },
    {
      id: 3,
      name: "김엔지니어",
      specialty: "서버/네트워크",
      contact: "010-3456-7890",
    },
    {
      id: 4,
      name: "정보안",
      specialty: "보안시스템",
      contact: "010-4567-8901",
    },
    {
      id: 5,
      name: "최소프트",
      specialty: "소프트웨어",
      contact: "010-5678-9012",
    },
  ];

  // 모달 상태
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [assetSearch, setAssetSearch] = useState("");
  const [technicianSearch, setTechnicianSearch] = useState("");

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
    setShowAssetModal(false);
  };

  const handleTechnicianSelect = (technician) => {
    setFormData((prev) => ({
      ...prev,
      technician: technician.name,
      technicianContact: technician.contact,
    }));
    setShowTechnicianModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 유지보수 일정 등록 로직 구현
    console.log("유지보수 일정 등록:", formData);
    alert("유지보수 일정이 등록되었습니다.");
    navigate("/maintenance/schedule");
  };

  // 자산 필터링
  const filteredAssets = assets.filter(
    (asset) =>
      asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.category.toLowerCase().includes(assetSearch.toLowerCase()) ||
      asset.location.toLowerCase().includes(assetSearch.toLowerCase())
  );

  // 기술자 필터링
  const filteredTechnicians = technicians.filter(
    (technician) =>
      technician.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
      technician.specialty
        .toLowerCase()
        .includes(technicianSearch.toLowerCase())
  );

  return (
    <PageContainer title="유지보수 일정 등록">
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
                    className="flex-grow rounded-l-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAssetModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-border rounded-r-md bg-muted text-muted-foreground hover:bg-muted/80"
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
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 유지보수 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              유지보수 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  유지보수 유형 <span className="text-destructive">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="정기점검">정기점검</option>
                  <option value="수리">수리</option>
                  <option value="업그레이드">업그레이드</option>
                  <option value="배터리 교체">배터리 교체</option>
                  <option value="소프트웨어 업데이트">
                    소프트웨어 업데이트
                  </option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  우선순위 <span className="text-destructive">*</span>
                </label>
                <select
                  id="priority"
                  name="priority"
                  required
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="높음">높음</option>
                  <option value="중간">중간</option>
                  <option value="낮음">낮음</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="scheduledDate"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  예정일 <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  required
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="estimatedCompletionDate"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  예상 완료일
                </label>
                <input
                  type="date"
                  id="estimatedCompletionDate"
                  name="estimatedCompletionDate"
                  value={formData.estimatedCompletionDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="estimatedCost"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  예상 비용
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground sm:text-sm">₩</span>
                  </div>
                  <input
                    type="text"
                    id="estimatedCost"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    placeholder="0"
                    className="block w-full pl-7 rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 기술자 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              기술자 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="technician"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  기술자 <span className="text-destructive">*</span>
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="technician"
                    name="technician"
                    required
                    value={formData.technician}
                    onChange={handleChange}
                    className="flex-grow rounded-l-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTechnicianModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-border rounded-r-md bg-muted text-muted-foreground hover:bg-muted/80"
                  >
                    <FaSearch className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="technicianContact"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  연락처
                </label>
                <input
                  type="text"
                  id="technicianContact"
                  name="technicianContact"
                  value={formData.technicianContact}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">
              추가 정보
            </h3>
            <div>
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
                className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3">
            <Link
              to="/maintenance/schedule"
              className={`${getButtonVariantClass(
                "outline"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <FaTimes className="mr-2 -ml-1 h-4 w-4" />
              취소
            </Link>
            <button
              type="submit"
              className={`${getButtonVariantClass(
                "primary"
              )} inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors`}
            >
              <FaSave className="mr-2 -ml-1 h-4 w-4" />
              저장
            </button>
          </div>
        </form>
      </div>

      {/* 자산 선택 모달 */}
      {showAssetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              자산 선택
            </h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="자산명, 카테고리 또는 위치로 검색..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      자산 ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      자산명
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      위치
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-4 text-center text-muted-foreground"
                      >
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {asset.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                          {asset.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {asset.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {asset.location}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <button
                            type="button"
                            onClick={() => handleAssetSelect(asset)}
                            className={`${getButtonVariantClass(
                              "primary"
                            )} px-3 py-1 rounded-md text-xs`}
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAssetModal(false)}
                className={`${getButtonVariantClass(
                  "outline"
                )} px-4 py-2 rounded-md text-sm`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 기술자 선택 모달 */}
      {showTechnicianModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              기술자 선택
            </h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="이름 또는 전문 분야로 검색..."
                value={technicianSearch}
                onChange={(e) => setTechnicianSearch(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      이름
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      전문 분야
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTechnicians.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-4 text-center text-muted-foreground"
                      >
                        검색 결과가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredTechnicians.map((technician) => (
                      <tr
                        key={technician.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                          {technician.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {technician.specialty}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-foreground">
                          {technician.contact}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <button
                            type="button"
                            onClick={() => handleTechnicianSelect(technician)}
                            className={`${getButtonVariantClass(
                              "primary"
                            )} px-3 py-1 rounded-md text-xs`}
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTechnicianModal(false)}
                className={`${getButtonVariantClass(
                  "outline"
                )} px-4 py-2 rounded-md text-sm`}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default MaintenanceAdd;
