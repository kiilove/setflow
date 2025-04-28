"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useAuth } from "../../context/AuthContext";
import { useMessageContext } from "../../context/MessageContext";
import uploadImage from "../../hooks/useImageUpload";
import { sanitizeEmptyValues } from "../../utils/objectUtils";
import BounceLoadingLogo from "../../components/common/BounceLoadingLogo";

const UsersAdd = () => {
  const navigate = useNavigate();
  const { userUUID } = useAuth();
  const { addDocument } = useFirestoreSubcollection(
    "clients",
    userUUID,
    "users"
  );
  const { getDocument: getDepartments } = useFirestoreSubcollection(
    "clients",
    userUUID,
    "settings"
  );
  const { getDocument: getLocations } = useFirestoreSubcollection(
    "clients",
    userUUID,
    "settings"
  );
  const { showSuccess, showError } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 부서 데이터 로드
        const departmentsData = await getDepartments("departments");
        if (departmentsData && departmentsData.departments) {
          setDepartments(departmentsData.departments);
        } else {
          setDepartments([]);
        }

        // 위치 데이터 로드
        const locationsData = await getLocations("locations");
        if (locationsData && locationsData.locations) {
          setLocations(locationsData.locations);
        } else {
          setLocations([]);
        }
      } catch (error) {
        showError(
          "데이터 로드 실패",
          "부서 및 위치 데이터를 불러오는데 실패했습니다."
        );
        setDepartments([]);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getDepartments, getLocations, showError]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);

      // 빈 값 처리
      const sanitizedData = sanitizeEmptyValues(data);

      // 프로필 이미지가 있는 경우에만 업로드 처리
      if (sanitizedData.profileImage instanceof File) {
        try {
          const imageUrl = await uploadImage(
            sanitizedData.profileImage,
            "users/profiles"
          );
          sanitizedData.profileImage = imageUrl;
        } catch (error) {
          showError(
            "프로필 이미지 업로드 실패",
            "프로필 이미지 업로드 중 오류가 발생했습니다."
          );
          return;
        }
      }

      // Firestore에 사용자 데이터 저장
      // 주의: 민감한 정보(name, email, phone, extension)는 Firestore 트리거에서 자동으로 암호화됩니다.
      const result = await addDocument(sanitizedData);

      if (result) {
        showSuccess("사용자 추가", "새 사용자가 성공적으로 추가되었습니다.");
        navigate("/users");
      } else {
        throw new Error("사용자 데이터 저장 실패");
      }
    } catch (error) {
      showError("사용자 추가 실패", "사용자 추가 중 오류가 발생했습니다.");
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="사용자 추가">
        <div className="flex justify-center items-center h-64">
          <BounceLoadingLogo />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="사용자 추가">
      <UserForm
        departments={departments}
        locations={locations}
        loading={loading}
        saving={saving}
        error={error}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </PageContainer>
  );
};

export default UsersAdd;
