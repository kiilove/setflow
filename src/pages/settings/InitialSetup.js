"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { doc, setDoc, collection, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import categoryInitialData from "../../data/categoryInitialData";
import { categoryGroups } from "../../data/categoryInitialData";

const InitialSetup = () => {
  const navigate = useNavigate();
  const { userUUID } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeSettings = async () => {
    if (!userUUID) {
      setError("사용자 UUID를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 배치 작업 시작
      const batch = writeBatch(db);

      // 1. 기본 설정 문서들 생성
      await Promise.all([
        // 회사 설정
        setDoc(doc(db, `users/${userUUID}/settings`, "company"), {
          name: "",
          address: "",
          phone: "",
          email: "",
          website: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),

        // 위치 설정
        setDoc(doc(db, `users/${userUUID}/settings`, "locations"), {
          locations: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),

        // 직원 설정
        setDoc(doc(db, `users/${userUUID}/settings`, "employees"), {
          employees: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),

        // 작업 설정
        setDoc(doc(db, `users/${userUUID}/settings`, "tasks"), {
          taskTypes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),

        // 알림 설정
        setDoc(doc(db, `users/${userUUID}/settings`, "notifications"), {
          emailNotifications: true,
          pushNotifications: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      ]);

      // 2. 카테고리 그룹 데이터 저장
      const categoryGroupsRef = collection(
        db,
        `users/${userUUID}/categoryGroups`
      );
      categoryGroups.forEach((group) => {
        const groupDocRef = doc(categoryGroupsRef);
        batch.set(groupDocRef, {
          ...group,
          id: groupDocRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      // 3. 카테고리 데이터 저장
      const categoriesRef = collection(db, `users/${userUUID}/categories`);
      categoryInitialData.forEach((category) => {
        const categoryDocRef = doc(categoriesRef);
        batch.set(categoryDocRef, {
          ...category,
          id: categoryDocRef.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      // 배치 작업 실행
      await batch.commit();

      navigate("/settings");
    } catch (error) {
      console.error("초기 설정 중 오류 발생:", error);
      setError("초기 설정 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>초기 설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              시스템을 사용하기 위해 필요한 기본 설정을 초기화합니다. 이 작업은
              한 번만 수행하면 됩니다.
            </p>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              onClick={initializeSettings}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  설정 중...
                </>
              ) : (
                "초기 설정 시작"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitialSetup;
