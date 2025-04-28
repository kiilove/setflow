"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestoreSubcollection } from "../../hooks/useFirestoreSubcollection";
import { useAuth } from "../../context/AuthContext";
import { useMessageContext } from "../../context/MessageContext";
import CategoriesForm from "./CategoriesForm";

const CategoriesTable = ({ categories, onEdit, onDelete, onAdd, loading }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocuments, deleteDocument } = useFirestoreSubcollection(
    "clients",
    user.uid,
    "categories"
  );
  const { showSuccess, showError } = useMessageContext();
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      showSuccess("삭제 완료", "카테고리가 성공적으로 삭제되었습니다.");
      onDelete(id);
    } catch (error) {
      console.error("카테고리 삭제 중 오류가 발생했습니다:", error);
      showError("삭제 오류", "카테고리 삭제에 실패했습니다.");
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await updateDocument(editingCategory.id, formData);
        showSuccess("수정 완료", "카테고리가 성공적으로 수정되었습니다.");
      } else {
        await addDocument(formData);
        showSuccess("추가 완료", "카테고리가 성공적으로 추가되었습니다.");
      }
      setShowForm(false);
      const data = await getDocuments();
      setCategories(data);
    } catch (error) {
      console.error("카테고리 저장 중 오류가 발생했습니다:", error);
      showError("저장 오류", "카테고리 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (showForm) {
    return (
      <CategoriesForm
        initialData={editingCategory}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              이름
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              설명
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              아이콘
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              감가상각 방법
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              감가상각 기간
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              잔존가치
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {category.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full ${category.iconColor} flex items-center justify-center`}
                  >
                    <i
                      className={`fas fa-${category.icon} ${category.iconTextColor}`}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.depreciation.method === "straight-line"
                    ? "정액법"
                    : "정률법"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.depreciation.years}년
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {category.depreciation.residualValueType === "percentage"
                    ? `${category.depreciation.residualValue}%`
                    : `${category.depreciation.residualValue}원`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          카테고리 추가
        </button>
      </div>
    </div>
  );
};

export default CategoriesTable;
