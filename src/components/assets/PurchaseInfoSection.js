"use client";

import { useEffect } from "react";
import DateInput from "../common/DateInput";
import NumberInput from "../common/NumberInput";
import PhoneInput from "../common/PhoneInput";

const PurchaseInfoSection = ({ formData, handleChange }) => {
  // 구매일로부터 보증 만료일을 계산하는 함수
  const calculateWarrantyExpiry = (purchaseDate) => {
    if (!purchaseDate) return "";

    const warrantyDate = new Date(purchaseDate);
    warrantyDate.setFullYear(warrantyDate.getFullYear() + 1);
    warrantyDate.setDate(warrantyDate.getDate() - 1);

    return warrantyDate.toISOString().split("T")[0];
  };

  // 컴포넌트가 마운트될 때 오늘 날짜를 기본값으로 설정
  useEffect(() => {
    // 구매일이 비어있는 경우에만 오늘 날짜로 설정
    if (!formData.purchaseDate) {
      const today = new Date().toISOString().split("T")[0];

      // 구매일 업데이트
      const purchaseDateEvent = {
        target: {
          name: "purchaseDate",
          value: today,
        },
      };
      handleChange(purchaseDateEvent);

      // 보증 만료일 업데이트
      const warrantyExpiryEvent = {
        target: {
          name: "warrantyExpiry",
          value: calculateWarrantyExpiry(today),
        },
      };
      handleChange(warrantyExpiryEvent);
    } else if (formData.purchaseDate && !formData.warrantyExpiry) {
      // 구매일은 있지만 보증 만료일이 없는 경우 보증 만료일 자동 계산
      const warrantyExpiryEvent = {
        target: {
          name: "warrantyExpiry",
          value: calculateWarrantyExpiry(formData.purchaseDate),
        },
      };
      handleChange(warrantyExpiryEvent);
    }
  }, [formData.purchaseDate, formData.warrantyExpiry, handleChange]);

  // 구매일이 변경될 때 보증 만료일을 자동으로 설정하는 함수
  const handlePurchaseDateChange = (e) => {
    const purchaseDate = e.target.value;

    // 기본 handleChange 호출
    handleChange(e);

    // 구매일이 있는 경우에만 보증 만료일 계산
    if (purchaseDate) {
      // 보증 만료일 필드 업데이트를 위한 가상 이벤트 생성
      const warrantyEvent = {
        target: {
          name: "warrantyExpiry",
          value: calculateWarrantyExpiry(purchaseDate),
        },
      };

      // handleChange 함수 호출하여 보증 만료일 업데이트
      handleChange(warrantyEvent);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateInput
          id="purchaseDate"
          name="purchaseDate"
          label="구매일"
          value={formData.purchaseDate}
          onChange={handlePurchaseDateChange}
          required
        />
        <NumberInput
          id="purchasePrice"
          name="purchasePrice"
          label="구매 가격"
          value={formData.purchasePrice}
          onChange={handleChange}
          prefix="₩"
          placeholder="0"
        />
        <div className="space-y-2">
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-foreground"
          >
            공급업체
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="공급업체명"
          />
        </div>
        <DateInput
          id="warrantyExpiry"
          name="warrantyExpiry"
          label="보증 만료일"
          value={formData.warrantyExpiry}
          onChange={handleChange}
        />
        <NumberInput
          id="currentValue"
          name="currentValue"
          label="현재 가치"
          value={formData.currentValue}
          onChange={handleChange}
          prefix="₩"
          placeholder="0"
        />
        <PhoneInput
          id="supplierContact"
          name="supplierContact"
          label="공급업체 연락처"
          value={formData.supplierContact || ""}
          onChange={handleChange}
          placeholder="02-1234-5678"
        />
      </div>
    </div>
  );
};

export default PurchaseInfoSection;
