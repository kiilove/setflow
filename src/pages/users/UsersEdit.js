"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "../../components/common/PageContainer";
import UserForm from "../../components/users/UserForm";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useAuth } from "../../context/AuthContext";
import { useMessageContext } from "../../context/MessageContext";
import uploadImage from "../../hooks/useImageUpload";
import { sanitizeEmptyValues } from "../../utils/objectUtils";
import { fetchUserData } from "../../utils/firebaseUtils";
import BounceLoadingLogo from "../../components/common/BounceLoadingLogo";

const UsersEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userUUID } = useAuth();
  const { getDocument, updateDocument } = useFirestoreSubcollection(
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

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState(null);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Firestore에서 사용자 데이터 가져오기
        const userData = await getDocument(id);
        if (!userData) {
          throw new Error("사용자를 찾을 수 없습니다.");
        }

        // 암호화된 데이터 복호화
        const decryptedData = await fetchUserData(id);

        // 원본 데이터와 복호화된 데이터 병합
        const mergedData = {
          ...userData,
          ...decryptedData,
        };

        setUser(mergedData);
        setFormData(mergedData);

        // 부서 데이터 로드
        const departmentsData = await getDepartments("departments");
        if (departmentsData && departmentsData.departments) {
          setDepartments(departmentsData.departments);
        }

        // 위치 데이터 로드
        const locationsData = await getLocations("locations");
        if (locationsData && locationsData.locations) {
          setLocations(locationsData.locations);
        }
      } catch (error) {
        setError(error.message);
        showError(
          "데이터 로드 실패",
          "사용자 데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getDocument, getDepartments, getLocations, showError]);

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
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

      // Firestore에 사용자 데이터 업데이트
      // 주의: 민감한 정보(name, email, phone, extension)는 Firestore 트리거에서 자동으로 암호화됩니다.
      await updateDocument(id, sanitizedData);

      showSuccess("사용자 수정", "사용자 정보가 성공적으로 수정되었습니다.");
      navigate("/users");
    } catch (error) {
      showError("사용자 수정 실패", "사용자 수정 중 오류가 발생했습니다.");
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="사용자 정보 수정">
        <div className="flex justify-center items-center h-64">
          <BounceLoadingLogo />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="사용자 정보 수정">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => navigate("/users")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            사용자 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="사용자 정보 수정">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p>사용자 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate("/users")}
            className="mt-2 px-4 py-2 bg-background border border-input rounded-md hover:bg-muted transition-colors"
          >
            사용자 목록으로 돌아가기
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="사용자 정보 수정">
      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow p-6 border border-border">
          {submitting ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-muted-foreground">처리 중...</span>
            </div>
          ) : (
            <UserForm
              user={user}
              onSubmit={handleSubmit}
              isEditing={true}
              departments={departments}
              locations={locations}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default UsersEdit;
