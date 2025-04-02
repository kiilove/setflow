"use client";

import { useState } from "react";
import { FaSearch, FaSave } from "react-icons/fa";
import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const UsersPermissions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "관리자",
      description: "모든 기능에 접근 가능한 최고 권한",
      permissions: {
        dashboard: true,
        users: true,
        assets: true,
        finance: true,
        reports: true,
        settings: true,
        maintenance: true,
        categories: true,
      },
    },
    {
      id: 2,
      name: "편집자",
      description: "대부분의 기능에 접근 가능하나 일부 제한됨",
      permissions: {
        dashboard: true,
        users: false,
        assets: true,
        finance: true,
        reports: true,
        settings: false,
        maintenance: true,
        categories: false,
      },
    },
    {
      id: 3,
      name: "사용자",
      description: "기본적인 조회 기능만 접근 가능",
      permissions: {
        dashboard: true,
        users: false,
        assets: false,
        finance: false,
        reports: false,
        settings: false,
        maintenance: false,
        categories: false,
      },
    },
  ]);

  // 권한 변경 핸들러
  const handlePermissionChange = (roleId, permission) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permission]: !role.permissions[permission],
            },
          };
        }
        return role;
      })
    );
  };

  // 검색 필터링
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 변경사항 저장
  const handleSave = () => {
    // 실제로는 API 호출
    alert("권한 설정이 저장되었습니다.");
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">사용자 권한 관리</h1>
          <button
            onClick={handleSave}
            className={`${getButtonVariantClass(
              "primary"
            )} px-4 py-2 rounded-md flex items-center`}
          >
            <FaSave className="mr-2" />
            변경사항 저장
          </button>
        </div>

        <p className="text-muted-foreground">
          각 역할별 권한을 설정하여 사용자의 접근 권한을 관리할 수 있습니다.
        </p>

        {/* 검색 */}
        <div className="relative w-full md:w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="역할 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* 권한 테이블 */}
        <div className="bg-card rounded-lg shadow overflow-hidden border border-border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    역할
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    설명
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    대시보드
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    사용자 관리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    자산 관리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    재무 관리
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    보고서
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    설정
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {role.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.dashboard}
                        onChange={() =>
                          handlePermissionChange(role.id, "dashboard")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"} // 관리자는 항상 모든 권한 보유
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.users}
                        onChange={() =>
                          handlePermissionChange(role.id, "users")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.assets}
                        onChange={() =>
                          handlePermissionChange(role.id, "assets")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.finance}
                        onChange={() =>
                          handlePermissionChange(role.id, "finance")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.reports}
                        onChange={() =>
                          handlePermissionChange(role.id, "reports")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.settings}
                        onChange={() =>
                          handlePermissionChange(role.id, "settings")
                        }
                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        disabled={role.name === "관리자"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow overflow-hidden border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">권한 설명</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="font-medium">대시보드:</div>
                <div className="ml-2 text-muted-foreground">
                  대시보드 및 통계 정보 조회
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">사용자 관리:</div>
                <div className="ml-2 text-muted-foreground">
                  사용자 추가, 수정, 삭제 및 권한 관리
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">자산 관리:</div>
                <div className="ml-2 text-muted-foreground">
                  자산 추가, 수정, 삭제 및 할당 관리
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">재무 관리:</div>
                <div className="ml-2 text-muted-foreground">
                  자산 가치, 감가상각, 비용 관리
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="font-medium">보고서:</div>
                <div className="ml-2 text-muted-foreground">
                  각종 보고서 생성 및 조회
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">설정:</div>
                <div className="ml-2 text-muted-foreground">
                  시스템 설정 및 환경 설정 관리
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">유지보수:</div>
                <div className="ml-2 text-muted-foreground">
                  자산 유지보수 일정 및 기록 관리
                </div>
              </div>
              <div className="flex items-start">
                <div className="font-medium">카테고리:</div>
                <div className="ml-2 text-muted-foreground">
                  자산 카테고리 및 템플릿 관리
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersPermissions;
