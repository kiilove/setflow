"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const CategoriesTemplateForm = ({ initialData, onSubmit, loading }) => {
  const [specFields, setSpecFields] = useState(initialData?.specFields || []);

  const handleAddField = () => {
    setSpecFields([
      ...specFields,
      {
        id: `field_${Date.now()}`,
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const handleRemoveField = (index) => {
    setSpecFields(specFields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, field, value) => {
    const updatedFields = [...specFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };
    setSpecFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ specFields });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">사양 필드 관리</h3>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            onClick={handleAddField}
            disabled={loading}
          >
            <Plus className="inline-block mr-2 h-4 w-4" />
            필드 추가
          </button>
        </div>

        {specFields.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <p className="text-gray-500">
              추가된 사양 필드가 없습니다. 필드를 추가해주세요.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {specFields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-4 p-4 border rounded-md"
              >
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`label-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        필드 이름
                      </label>
                      <input
                        id={`label-${index}`}
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={field.label}
                        onChange={(e) =>
                          handleFieldChange(index, "label", e.target.value)
                        }
                        placeholder="필드 이름을 입력하세요"
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor={`type-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        필드 유형
                      </label>
                      <select
                        id={`type-${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={field.type}
                        onChange={(e) =>
                          handleFieldChange(index, "type", e.target.value)
                        }
                        disabled={loading}
                      >
                        <option value="text">텍스트</option>
                        <option value="number">숫자</option>
                        <option value="date">날짜</option>
                        <option value="select">선택</option>
                        <option value="checkbox">체크박스</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${index}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={field.required}
                      onChange={(e) =>
                        handleFieldChange(index, "required", e.target.checked)
                      }
                      disabled={loading}
                    />
                    <label
                      htmlFor={`required-${index}`}
                      className="text-sm text-gray-700"
                    >
                      필수 필드
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-red-500 focus:outline-none"
                  onClick={() => handleRemoveField(index)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={() => window.history.back()}
          disabled={loading}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "저장 중..." : "저장"}
        </button>
      </div>
    </form>
  );
};

export default CategoriesTemplateForm;
