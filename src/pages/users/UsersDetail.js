"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  BadgeCheck,
  Calendar,
  Shield,
  MapPin,
  Edit,
  Trash2,
  History,
  Laptop,
  FileText,
  Download,
  QrCode,
  X,
  Clock,
  User,
} from "lucide-react";
import PageContainer from "../../components/common/PageContainer";
import {
  getButtonVariantClass,
  getStatusColorClass,
} from "../../utils/themeUtils";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

// QRCode 컴포넌트 대체 구현
const SimpleQRCode = ({ value, size = 200 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ddd",
        borderRadius: "4px",
      }}
    >
      <div className="text-center">
        <QrCode size={size / 2} />
        <div className="mt-2 text-xs">QR Code for: {value}</div>
      </div>
    </div>
  );
};

// InfoItem 컴포넌트
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <div className="mr-3">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

// formatDate 함수
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString();
};

// TabButton 컴포넌트
const TabButton = ({ active, onClick, icon, label }) => (
  <button
    className={`flex items-center gap-2 py-3 px-1 border-b-2 ${
      active
        ? "border-primary text-primary"
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const UsersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, deleteDocument } = useFirestore("users");
  const { showConfirm, showSuccess, showError } = useMessageContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("assets");
  const [showQRModal, setShowQRModal] = useState(false);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getDocument(id);

        if (!data) {
          throw new Error("사용자를 찾을 수 없습니다.");
        }

        // 자산 및 문서 데이터 로드 (실제 구현에서는 API 호출)
        // 예시 데이터
        const userData = {
          ...data,
          assets: [
            {
              id: 1,
              name: "MacBook Pro 16인치",
              type: "노트북",
              assignedDate: "2022-01-15",
              status: "사용중",
            },
            {
              id: 2,
              name: "iPhone 13 Pro",
              type: "모바일",
              assignedDate: "2022-01-15",
              status: "사용중",
            },
            {
              id: 3,
              name: "Dell 27인치 모니터",
              type: "모니터",
              assignedDate: "2022-01-15",
              status: "사용중",
            },
          ],
          history: [
            {
              id: 1,
              date: "2023-11-25",
              action: "로그인",
              details: "시스템 로그인 (IP: 192.168.1.45)",
            },
            {
              id: 2,
              date: "2023-11-20",
              action: "자산 반납",
              details: "Samsung Galaxy S21 반납 처리",
            },
            {
              id: 3,
              date: "2023-11-15",
              action: "정보 수정",
              details: "연락처 정보 업데이트",
            },
          ],
          documents: [
            {
              id: 1,
              name: "입사 계약서",
              type: "PDF",
              uploadDate: "2020-03-15",
              size: "2.4MB",
            },
            {
              id: 2,
              name: "보안 서약서",
              type: "PDF",
              uploadDate: "2020-03-15",
              size: "1.1MB",
            },
          ],
        };

        setUser(userData);
      } catch (err) {
        console.error("사용자 로딩 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getDocument]);

  // 사용자 삭제 핸들러
  const handleDelete = async () => {
    const confirmed = await showConfirm(
      "사용자 삭제",
      `"${user.name}" 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      {
        confirmText: "삭제",
        cancelText: "취소",
        confirmVariant: "error",
      }
    );

    if (confirmed) {
      try {
        await deleteDocument(id);
        showSuccess("사용자 삭제 완료", "사용자가 성공적으로 삭제되었습니다.");
        navigate("/users");
      } catch (error) {
        console.error("사용자 삭제 중 오류가 발생했습니다:", error);
        showError("��제 오류", "사용자 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return (
      <PageContainer title="사용자 상세 정보">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-muted-foreground">로딩 중...</span>
        </div>
      </PageContainer>
    );
  }

  if (error || !user) {
    return (
      <PageContainer title="사용자 상세 정보">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground">
            사용자를 찾을 수 없습니다
          </h3>
          <p className="text-muted-foreground mt-2">
            {error || "요청하신 사용자 ID가 존재하지 않습니다."}
          </p>
          <Link
            to="/users"
            className={`mt-4 inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
              "primary"
            )}`}
          >
            사용자 목록으로 돌아가기
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="사용자 상세 정보">
      {/* 상단 정보 카드 */}
      <div className="mb-6 rounded-lg border border-border bg-card p-6 shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <img
                src={user.profileImage || "/placeholder.svg"}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                <span className="text-4xl font-bold text-primary">
                  {user.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                {user.name}
                <span
                  className={`ml-3 text-sm px-2 py-1 rounded-full ${getStatusColorClass(
                    user.status
                  )}`}
                >
                  {user.status}
                </span>
              </h2>
              <div className="flex space-x-2 mt-2 md:mt-0">
                <Link
                  to={`/users/edit/${user.id}`}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "secondary"
                  )}`}
                >
                  <Edit className="h-4 w-4" />
                  <span>편집</span>
                </Link>
                <button
                  onClick={handleDelete}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "destructive"
                  )}`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>삭제</span>
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                    "outline"
                  )}`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>QR 코드</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                icon={<Mail className="text-blue-500" />}
                label="이메일"
                value={user.email}
              />
              <InfoItem
                icon={<Phone className="text-green-500" />}
                label="전화번호"
                value={user.phone || "-"}
              />
              <InfoItem
                icon={<Building2 className="text-purple-500" />}
                label="부서"
                value={user.department}
              />
              <InfoItem
                icon={<Briefcase className="text-yellow-500" />}
                label="직책"
                value={user.position}
              />
              <InfoItem
                icon={<BadgeCheck className="text-red-500" />}
                label="사원번호"
                value={user.employeeId}
              />
              <InfoItem
                icon={<Calendar className="text-teal-500" />}
                label="입사일"
                value={formatDate(user.joinDate)}
              />
              <InfoItem
                icon={<Shield className="text-indigo-500" />}
                label="권한"
                value={user.role}
              />
              <InfoItem
                icon={<MapPin className="text-pink-500" />}
                label="위치"
                value={user.location || "-"}
              />
              <InfoItem
                icon={<Clock className="text-gray-500" />}
                label="마지막 로그인"
                value={user.lastLogin || "-"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="mb-6 border-b border-border">
        <div className="flex space-x-6">
          <TabButton
            active={activeTab === "assets"}
            onClick={() => setActiveTab("assets")}
            icon={<Laptop />}
            label="할당된 자산"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<History />}
            label="활동 이력"
          />
          <TabButton
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
            icon={<FileText />}
            label="문서"
          />
        </div>
      </div>

      {/* 탭 내용 */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        {activeTab === "assets" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                할당된 자산 ({user.assets?.length || 0})
              </h3>
              <Link
                to={`/assignments/add?userId=${user.id}`}
                className={`flex items-center gap-1 px-3 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <Laptop className="h-4 w-4" />
                <span>자산 할당</span>
              </Link>
            </div>
            {user.assets && user.assets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-2 text-left">자산</th>
                      <th className="px-4 py-2 text-left">유형</th>
                      <th className="px-4 py-2 text-left">할당일</th>
                      <th className="px-4 py-2 text-left">상태</th>
                      <th className="px-4 py-2 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.assets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="border-b border-border hover:bg-muted/20"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <Laptop className="h-4 w-4 text-blue-500" />
                            </div>
                            <span>{asset.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{asset.type}</td>
                        <td className="px-4 py-3">{asset.assignedDate}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/assets/detail/${asset.id}`}
                              className="text-primary hover:text-primary/80"
                              title="자산 상세 보기"
                            >
                              <Laptop className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/assignments/return?assetId=${asset.id}&userId=${user.id}`}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="자산 반납"
                            >
                              <FileText className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                할당된 자산이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">활동 이력</h3>
            {user.history && user.history.length > 0 ? (
              <div className="space-y-4">
                {user.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex border-b border-border pb-4"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {item.action === "로그인" && (
                          <User className="text-blue-500" />
                        )}
                        {item.action === "자산 반납" && (
                          <Laptop className="text-red-500" />
                        )}
                        {item.action === "정보 수정" && (
                          <Edit className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{item.action}</h4>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                활동 이력이 없습니다.
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">문서</h3>
            {user.documents && user.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/20"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <FileText className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <div className="flex text-xs text-muted-foreground">
                            <span>{doc.type}</span>
                            <span className="mx-1">•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-primary hover:text-primary/80"
                        title="다운로드"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      업로드: {doc.uploadDate}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                문서가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR 코드 모달 */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="relative">
              <h3 className="text-xl font-semibold mb-4">사용자 QR 코드</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <SimpleQRCode
                value={window.location.origin + `/users/${user.id}`}
                size={200}
              />
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              이 QR 코드를 스캔하여 사용자 정보에 빠르게 접근하세요.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowQRModal(false)}
                className={`px-4 py-2 rounded-md ${getButtonVariantClass(
                  "secondary"
                )}`}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default UsersDetail;
