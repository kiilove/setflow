"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import useModalMessage from "../../hooks/useModalMessage";
import { Users, Plus, Pencil, Trash2, X, MapPin, Building } from "lucide-react";
import * as Icons from "lucide-react";
import DepartmentIconSelector from "../departments/DepartmentIconSelector";

const SettingsDepartments = () => {
  const { getCollection, addDocument, updateDocument, deleteDocument } =
    useFirestore();
  const { showModal } = useModalMessage();

  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    locationId: "",
    icon: "Building",
    iconColor: "bg-gray-100",
    iconTextColor: "text-gray-500",
  });
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  useEffect(() => {
    loadDepartments();
    loadLocations();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await getCollection("departments");
      setDepartments(data);
    } catch (error) {
      showModal("error", "부서 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const data = await getCollection("locations");
      setLocations(data);
    } catch (error) {
      console.error("위치 데이터를 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationChange = (e) => {
    const locationId = e.target.value;
    setFormData({
      ...formData,
      locationId: locationId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showModal("error", "부서명을 입력해주세요.");
      return false;
    }
    if (
      departments.some(
        (d) =>
          d.id !== editingDepartment?.id &&
          d.name.toLowerCase() === formData.name.toLowerCase()
      )
    ) {
      showModal("error", "이미 존재하는 부서명입니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingDepartment) {
        await updateDocument("departments", editingDepartment.id, formData);
        showModal("success", "부서가 수정되었습니다.");
      } else {
        await addDocument("departments", formData);
        showModal("success", "부서가 추가되었습니다.");
      }
      setShowForm(false);
      setEditingDepartment(null);
      setFormData({
        name: "",
        description: "",
        locationId: "",
        icon: "Building",
        iconColor: "bg-gray-100",
        iconTextColor: "text-gray-500",
      });
      loadDepartments();
    } catch (error) {
      showModal("error", "부서 저장에 실패했습니다.");
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
      locationId: department.locationId || "",
      icon: department.icon || "Building",
      iconColor: department.iconColor || "bg-gray-100",
      iconTextColor: department.iconTextColor || "text-gray-500",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument("departments", id);
      showModal("success", "부서가 삭제되었습니다.");
      loadDepartments();
    } catch (error) {
      showModal("error", "부서 삭제에 실패했습니다.");
    }
  };

  const renderDepartmentIcon = (department) => {
    if (department.icon && Icons[department.icon]) {
      return React.createElement(Icons[department.icon], {
        className: "h-5 w-5",
      });
    }
    return <Building className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-3 sm:p-4 border-b border-border theme-transition flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">부서 관리</h3>
          </div>
          <button
            onClick={() => {
              setEditingDepartment(null);
              setFormData({
                name: "",
                description: "",
                locationId: "",
                icon: "Building",
                iconColor: "bg-gray-100",
                iconTextColor: "text-gray-500",
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            부서 추가
          </button>
        </div>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {departments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
              <h4 className="text-base sm:text-lg font-medium mb-2">
                등록된 부서가 없습니다
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                새로운 부서를 추가하여 조직을 구성해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {departments.map((department) => (
                <div
                  key={department.id}
                  className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden"
                >
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center mb-2">
                      <div
                        className={`p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 ${
                          department.iconColor || "bg-gray-100"
                        } ${department.iconTextColor || "text-gray-500"}`}
                      >
                        {renderDepartmentIcon(department)}
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-foreground">
                        {department.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 h-8 sm:h-10">
                      {department.description || "설명 없음"}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4">
                    {department.locationId && (
                      <div className="flex items-center text-xs sm:text-sm mb-3 sm:mb-4">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                        <span className="text-muted-foreground">
                          {locations.find(
                            (loc) => loc.id === department.locationId
                          )?.name || "-"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(department)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(department.id)}
                        className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 부서 추가/편집 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg border border-border max-h-[90vh] overflow-y-auto">
            <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h3 className="text-base sm:text-lg font-semibold">
                {editingDepartment ? "부서 수정" : "부서 추가"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingDepartment(null);
                }}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    부서명 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="부서명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    설명
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                    placeholder="부서에 대한 설명을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-foreground mb-1">
                    위치
                  </label>
                  <select
                    name="locationId"
                    value={formData.locationId}
                    onChange={handleLocationChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">위치 선택...</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <DepartmentIconSelector
                  selectedIcon={formData.icon}
                  selectedColor={{
                    name: "기본",
                    bg: formData.iconColor,
                    text: formData.iconTextColor,
                  }}
                  onSelectIcon={(icon) => setFormData({ ...formData, icon })}
                  onSelectColor={(color) =>
                    setFormData({
                      ...formData,
                      iconColor: color.bg,
                      iconTextColor: color.text,
                    })
                  }
                />
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDepartment(null);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {editingDepartment ? "수정" : "추가"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDepartments;
