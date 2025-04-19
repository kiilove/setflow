"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";

// useFirestore 훅을 컴포넌트 최상위 레벨에서 호출하도록 수정
const UsersAdd = () => {
  const navigate = useNavigate();
  const { addDocument } = useFirestore("users");
  const { getCollection: getDepartments } = useFirestore("departments");
  const { getCollection: getLocations } = useFirestore("locations");
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  // 초기 데이터 설정
  const initialData = {
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    title: "",
    employeeId: "",
    joinDate: "",
    status: "재직중",
    role: "사용자",
    location: "",
  };

  // 부서 및 위치 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const departmentsData = await getDepartments();
        const locationsData = await getLocations();

        if (!departmentsData || departmentsData.length === 0) {
          console.warn("부서 데이터가 없습니다.");
          setDepartments([]);
        } else {
          setDepartments(departmentsData);
        }

        if (!locationsData || locationsData.length === 0) {
          console.warn("위치 데이터가 없습니다.");
          setLocations([]);
        } else {
          setLocations(locationsData);
        }
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        setDepartments([]);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDepartments, getLocations]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      // Firestore에 사용자 추가 (createdAt, updatedAt은 useFirestore에서 처리)
      const newUserId = await addDocument(formData);

      if (!newUserId) {
        throw new Error("사용자 추가에 실패했습니다.");
      }

      showSuccess("사용자 추가 완료", "사용자가 성공적으로 추가되었습니다.");
      navigate("/users");
    } catch (error) {
      console.error("사용자 추가 중 오류가 발생했습니다:", error);
      if (error.message.includes("settings/employeeIdFormats")) {
        showError(
          "설정 오류",
          "사원번호 형식 설정이 없습니다. 관리자에게 문의하세요."
        );
      } else {
        showError("추가 오류", "사용자 추가에 실패했습니다.");
      }
      setLoading(false);
    }
  };

  return (
    <PageContainer title="사용자 등록">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <UserForm
              initialData={initialData}
              onSubmit={handleSubmit}
              departments={departments}
              locations={locations}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersAdd;
