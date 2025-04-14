"use client";

import DateInput from "../common/DateInput";
import PhoneInput from "../common/PhoneInput";

const LocationAssignmentSection = ({ formData, handleChange }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-foreground"
          >
            위치
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="자산 위치"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-foreground"
          >
            할당 대상
          </label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="담당자 이름"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-foreground"
          >
            부서
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="부서명"
          />
        </div>
        <DateInput
          id="assignedDate"
          name="assignedDate"
          label="할당일"
          value={formData.assignedDate || ""}
          onChange={handleChange}
        />
        <PhoneInput
          id="contactNumber"
          name="contactNumber"
          label="담당자 연락처"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="010-0000-0000"
        />
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="example@company.com"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationAssignmentSection;
