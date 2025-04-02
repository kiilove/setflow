"use client";

import { useEffect } from "react";

const PurchaseInfoSection = ({ formData, handleChange }) => {
  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

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
      const today = getTodayDate();

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

  // 달력 아이콘 SVG
  const CalendarIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );

  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-4">구매 정보</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="purchaseDate"
            className="block text-sm font-medium text-muted-foreground"
          >
            구매일
          </label>
          <div className="relative">
            <input
              type="date"
              id="purchaseDate"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handlePurchaseDateChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            />
            <CalendarIcon />
          </div>
        </div>

        <div>
          <label
            htmlFor="purchasePrice"
            className="block text-sm font-medium text-muted-foreground"
          >
            구매 가격
          </label>
          <input
            type="text"
            id="purchasePrice"
            name="purchasePrice"
            value={formData.purchasePrice}
            onChange={handleChange}
            placeholder="예: 1,000,000"
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="supplier"
            className="block text-sm font-medium text-muted-foreground"
          >
            공급업체
          </label>
          <input
            type="text"
            id="supplier"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="warrantyExpiry"
            className="block text-sm font-medium text-muted-foreground"
          >
            보증 만료일
          </label>
          <div className="relative">
            <input
              type="date"
              id="warrantyExpiry"
              name="warrantyExpiry"
              value={formData.warrantyExpiry}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary pr-10"
            />
            <CalendarIcon />
          </div>
        </div>

        <div>
          <label
            htmlFor="currentValue"
            className="block text-sm font-medium text-muted-foreground"
          >
            현재 가치
          </label>
          <input
            type="text"
            id="currentValue"
            name="currentValue"
            value={formData.currentValue}
            onChange={handleChange}
            placeholder="예: 1,000,000"
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default PurchaseInfoSection;
