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
  const { getDocument, addDocument } = useFirestore("users");
  const { getCollection: getDepartments } = useFirestore("departments");
  const { getCollection: getLocations } = useFirestore("locations");
  const { showSuccess, showError, showWarning } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employeeIdFormats, setEmployeeIdFormats] = useState(null);

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
    console.log("[UsersAdd] Component mounted");
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
    loadEmployeeIdFormats();
  }, [getDepartments, getLocations]);

  const loadEmployeeIdFormats = async () => {
    console.log("[UsersAdd] Loading employee ID formats...");
    try {
      setLoading(true);
      const formats = await getDocument("employeeIdFormats");
      console.log("[UsersAdd] Employee ID formats loaded:", formats);

      if (!formats) {
        console.error("[UsersAdd] Employee ID formats not found");
        showError(
          "사원번호 형식 오류",
          "사원번호 형식 설정이 없습니다. 관리자에게 문의하세요."
        );
        return;
      }

      setEmployeeIdFormats(formats);
    } catch (error) {
      console.error("[UsersAdd] Error loading employee ID formats:", error);
      showError(
        "설정 로드 실패",
        "사원번호 형식 설정을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (userData) => {
    console.log("[UsersAdd] Starting user addition process");
    console.log("[UsersAdd] User data:", userData);

    if (!employeeIdFormats) {
      console.error("[UsersAdd] Cannot proceed: employeeIdFormats is null");
      showError(
        "사원번호 형식 오류",
        "사원번호 형식 설정이 없습니다. 관리자에게 문의하세요."
      );
      return;
    }

    try {
      setSaving(true);
      console.log("[UsersAdd] Saving user data...");

      // 사원번호 생성 로직 디버깅
      const currentYear = new Date().getFullYear().toString().slice(-2);
      const departmentCode = userData.department?.code || "000";
      const randomNumber = Math.floor(
        Math.random() * Math.pow(10, employeeIdFormats.length)
      )
        .toString()
        .padStart(employeeIdFormats.length, "0");

      console.log("[UsersAdd] Employee ID components:", {
        prefix: employeeIdFormats.prefix,
        year: currentYear,
        departmentCode,
        randomNumber,
      });

      const employeeId = `${employeeIdFormats.prefix}${
        employeeIdFormats.useYear ? currentYear : ""
      }${employeeIdFormats.useDepartment ? departmentCode : ""}${
        employeeIdFormats.separator
      }${randomNumber}`;

      console.log("[UsersAdd] Generated employee ID:", employeeId);

      const userWithId = {
        ...userData,
        employeeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("[UsersAdd] Final user data to be saved:", userWithId);

      await addDocument(userWithId);
      console.log("[UsersAdd] User data saved successfully");
      showSuccess("사용자 추가", "새 사용자가 추가되었습니다.");
    } catch (error) {
      console.error("[UsersAdd] Error saving user data:", error);
      showError("사용자 추가 실패", "사용자 추가 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    console.log("[UsersAdd] Loading state: true");
    return <div>로딩 중...</div>;
  }

  if (!employeeIdFormats) {
    console.log("[UsersAdd] Employee ID formats not available");
    return <div>사원번호 형식 설정이 없습니다.</div>;
  }

  console.log(
    "[UsersAdd] Rendering UserForm with employeeIdFormats:",
    employeeIdFormats
  );
  return <UserForm onSubmit={handleSubmit} loading={saving} />;
};

export default UsersAdd;
