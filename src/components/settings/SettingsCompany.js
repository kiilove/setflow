"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { useMessageContext } from "../../context/MessageContext";
import { Building2 } from "lucide-react";

const SettingsCompany = ({ onDataChange, initialData }) => {
  const { getDocument } = useFirestore("settings");
  const { showError } = useMessageContext();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState({
    name: "",
    businessRegistrationNumber: "",
    representativeName: "",
    industry: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        setLoading(true);
        const data = await getDocument("company");
        if (data) {
          setCompany(data);
          if (onDataChange) {
            onDataChange(data);
          }
        }
      } catch (error) {
        console.error("회사 정보 로딩 중 오류 발생:", error);
        showError(
          "회사 정보 로딩 실패",
          "회사 정보를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    if (initialData) {
      setCompany(initialData);
    } else {
      loadCompanySettings();
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    const newData = { ...company, [field]: value };
    setCompany(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center">
        <Building2 className="mr-2 h-5 w-5" />
        회사 기본 정보 설정
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            회사명
          </label>
          <input
            id="name"
            type="text"
            value={company.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="businessRegistrationNumber"
            className="block text-sm font-medium mb-1"
          >
            사업자등록번호
          </label>
          <input
            id="businessRegistrationNumber"
            type="text"
            value={company.businessRegistrationNumber}
            onChange={(e) =>
              handleChange("businessRegistrationNumber", e.target.value)
            }
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="representativeName"
            className="block text-sm font-medium mb-1"
          >
            대표자명
          </label>
          <input
            id="representativeName"
            type="text"
            value={company.representativeName}
            onChange={(e) => handleChange("representativeName", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium mb-1">
            업종
          </label>
          <input
            id="industry"
            type="text"
            value={company.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            주소
          </label>
          <input
            id="address"
            type="text"
            value={company.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            전화번호
          </label>
          <input
            id="phone"
            type="text"
            value={company.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={company.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">
            웹사이트
          </label>
          <input
            id="website"
            type="url"
            value={company.website}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsCompany;
