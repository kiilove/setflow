"use client";

const LocationAssignmentSection = ({ formData, handleChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-foreground mb-4">
        위치 및 할당 정보
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-muted-foreground"
          >
            위치
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">위치 선택</option>
            <option value="본사 1층">본사 1층</option>
            <option value="본사 2층">본사 2층</option>
            <option value="본사 3층">본사 3층</option>
            <option value="본사 4층">본사 4층</option>
            <option value="지사 1층">지사 1층</option>
            <option value="지사 2층">지사 2층</option>
            <option value="데이터센터">데이터센터</option>
            <option value="창고">창고</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium text-muted-foreground"
          >
            할당 대상
          </label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-muted-foreground"
          >
            부서
          </label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label
            htmlFor="assignedDate"
            className="block text-sm font-medium text-muted-foreground"
          >
            할당일
          </label>
          <input
            type="date"
            id="assignedDate"
            name="assignedDate"
            value={formData.assignedDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationAssignmentSection;
