"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { Building2, Save, Search } from "lucide-react";
import ModalMessage from "../common/ModalMessage";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const SettingsCompany = () => {
  const { updateDocument } = useFirestore("settings");
  const { userUUID } = useAuth();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({
    name: "",
    businessNumber: "",
    representative: "",
    businessType: "",
    businessCategory: "",
    phone: "",
    fax: "",
    address: {
      postcode: "",
      roadAddress: "",
      detailAddress: "",
    },
  });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNew, setIsNew] = useState(true);

  useEffect(() => {
    loadCompany();
    // 카카오 주소 API 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, `clients/${userUUID}/settings`, "company");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCompany(docSnap.data());
        setIsNew(false);
      }
    } catch (error) {
      setErrorMessage("회사 정보를 불러오는데 실패했습니다.");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!company.name.trim()) {
      setError("회사명을 입력해주세요.");
      return false;
    }
    if (!company.businessNumber.trim()) {
      setError("사업자등록번호를 입력해주세요.");
      return false;
    }
    if (!company.representative.trim()) {
      setError("대표자명을 입력해주세요.");
      return false;
    }
    if (!company.phone.trim()) {
      setError("전화번호를 입력해주세요.");
      return false;
    }
    if (!company.address.roadAddress.trim()) {
      setError("주소를 입력해주세요.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const docRef = doc(db, `clients/${userUUID}/settings`, "company");
      const docSnap = await getDoc(docRef);

      // 저장할 데이터를 변수에 담기
      const dataToSave = {
        ...company,
        updatedAt: serverTimestamp(),
      };

      // 저장 전 데이터 로깅
      console.log("=== 저장 전 데이터 ===");
      console.log("전체 데이터:", dataToSave);
      console.log("사용자 UUID:", userUUID);

      // 데이터 유효성 검사
      if (
        !dataToSave.name ||
        !dataToSave.businessNumber ||
        !dataToSave.representative
      ) {
        throw new Error("필수 필드가 누락되었습니다.");
      }

      // 문서 저장
      await setDoc(docRef, dataToSave);

      // 저장 후 데이터 로깅
      console.log("=== 저장 후 데이터 ===");
      console.log("전체 데이터:", dataToSave);

      setShowSuccessModal(true);
      setIsNew(false);
    } catch (error) {
      console.error("회사 정보 저장 중 오류 발생:", error);
      setErrorMessage(`회사 정보 저장에 실패했습니다. (${error.message})`);
      setShowErrorModal(true);
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setCompany({
          ...company,
          address: {
            postcode: data.zonecode,
            roadAddress: data.roadAddress,
            detailAddress: company.address.detailAddress,
          },
        });
      },
    }).open();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ModalMessage
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="저장 완료"
        message="회사 정보가 성공적으로 저장되었습니다."
        type="success"
      />

      <ModalMessage
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="오류 발생"
        message={errorMessage}
        type="error"
      />

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border theme-transition flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">회사 정보</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="회사명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                사업자등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={company.businessNumber}
                onChange={(e) =>
                  setCompany({ ...company, businessNumber: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="000-00-00000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                대표자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={company.representative}
                onChange={(e) =>
                  setCompany({ ...company, representative: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="대표자명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                업태
              </label>
              <input
                type="text"
                value={company.businessType}
                onChange={(e) =>
                  setCompany({ ...company, businessType: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="업태를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                종목
              </label>
              <input
                type="text"
                value={company.businessCategory}
                onChange={(e) =>
                  setCompany({ ...company, businessCategory: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="종목을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) =>
                  setCompany({ ...company, phone: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="02-0000-0000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                팩스번호
              </label>
              <input
                type="tel"
                value={company.fax}
                onChange={(e) =>
                  setCompany({ ...company, fax: e.target.value })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="02-0000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              주소 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={company.address.postcode}
                  readOnly
                  className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="우편번호"
                />
                <button
                  onClick={handleAddressSearch}
                  className="inline-flex items-center px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Search className="h-4 w-4 mr-1" />
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                value={company.address.roadAddress}
                readOnly
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="도로명 주소"
              />
              <input
                type="text"
                value={company.address.detailAddress}
                onChange={(e) =>
                  setCompany({
                    ...company,
                    address: {
                      ...company.address,
                      detailAddress: e.target.value,
                    },
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="상세 주소"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isNew ? "등록" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsCompany;
