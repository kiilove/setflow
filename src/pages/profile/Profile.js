"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import PageContainer from "../../components/common/PageContainer";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
    department: "",
    position: "",
    location: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profileDoc = await getDoc(
            doc(db, `clients/${user.uid}/profile/default`)
          );
          if (profileDoc.exists()) {
            const profileData = profileDoc.data();
            setProfile(profileData);
            setFormData({
              displayName: user.displayName || "",
              email: user.email || "",
              phoneNumber: profileData.phoneNumber || "",
              department: profileData.department || "",
              position: profileData.position || "",
              location: profileData.location || "",
            });
          }
        } catch (error) {
          console.error("프로필 조회 에러:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Firebase Auth 프로필 업데이트
      await updateProfile(user, {
        displayName: formData.displayName,
      });

      // Firestore 프로필 업데이트
      await updateDoc(doc(db, `clients/${user.uid}/profile/default`), {
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        position: formData.position,
        location: formData.location,
        updatedAt: new Date(),
      });

      setIsEditing(false);
      setProfile({
        ...profile,
        ...formData,
      });
    } catch (error) {
      console.error("프로필 업데이트 에러:", error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer title="프로필">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
              <User className="h-5 w-5 mr-2" />
              개인 정보
            </h3>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium">
                    이름
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">
                    전화번호
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="department" className="text-sm font-medium">
                    부서
                  </label>
                  <input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium">
                    직책
                  </label>
                  <input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    위치
                  </label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          displayName: user.displayName || "",
                          email: user.email || "",
                          phoneNumber: profile?.phoneNumber || "",
                          department: profile?.department || "",
                          position: profile?.position || "",
                          location: profile?.location || "",
                        });
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      저장
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    수정
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
