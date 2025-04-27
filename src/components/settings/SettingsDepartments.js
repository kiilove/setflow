"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useMessageContext } from "../../context/MessageContext";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  Building,
  ArrowLeft,
} from "lucide-react";
import * as Icons from "lucide-react";
import DepartmentIconSelector from "../departments/DepartmentIconSelector";
import DepartmentForm from "../departments/DepartmentForm";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import ModalMessage from "../common/ModalMessage";

const SettingsDepartments = () => {
  const { showSuccess, showError } = useMessageContext();

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    loadDepartments();
    loadLocations();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "settings", "departments");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setDepartments(data.departments || []);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      showError("오류", "부서 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      setLoadingLocations(true);
      const docRef = doc(db, "settings", "locations");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLocations(data.locations || []);
      } else {
        setLocations([]);
      }
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

  const handleSubmit = async (data) => {
    try {
      const docRef = doc(db, "settings", "departments");
      const docSnap = await getDoc(docRef);

      let updatedDepartments = [];
      if (docSnap.exists()) {
        updatedDepartments = [...docSnap.data().departments];
      }

      if (editingDepartment) {
        // 수정
        const index = updatedDepartments.findIndex(
          (d) => d.id === editingDepartment.id
        );
        if (index !== -1) {
          updatedDepartments[index] = { ...data, id: editingDepartment.id };
        }
      } else {
        // 추가
        const newId = Date.now().toString();
        updatedDepartments.push({ ...data, id: newId });
      }

      await setDoc(docRef, { departments: updatedDepartments });
      showSuccess(
        "저장 완료",
        editingDepartment ? "부서가 수정되었습니다." : "부서가 추가되었습니다."
      );

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
      showError("오류", "부서 저장에 실패했습니다.");
    }
  };

  const handleDelete = async (id) => {
    setDepartmentToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    try {
      const docRef = doc(db, "settings", "departments");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updatedDepartments = docSnap
          .data()
          .departments.filter((d) => d.id !== departmentToDelete);
        await setDoc(docRef, { departments: updatedDepartments });
        showSuccess("삭제 완료", "부서가 삭제되었습니다.");
        loadDepartments();
      }
    } catch (error) {
      showError("오류", "부서 삭제에 실패했습니다.");
    } finally {
      setShowDeleteConfirm(false);
      setDepartmentToDelete(null);
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

  // 모바일에서 전체 화면 폼
  if (showForm) {
    return (
      <div className="h-full flex flex-col">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
          <div className="p-3 sm:p-4 border-border theme-transition flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingDepartment(null);
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </button>
            </div>
            <h3 className="text-base font-semibold">
              {editingDepartment ? "부서 수정" : "부서 추가"}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <DepartmentForm
            initialValues={formData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingDepartment(null);
            }}
            isEditing={!!editingDepartment}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-3 sm:p-4 border-b border-border theme-transition flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">부서 관리</h3>
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
              <h4 className="text-base font-medium mb-2">
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
                      <h3 className="text-base font-medium text-foreground">
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

      <ModalMessage
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDepartmentToDelete(null);
        }}
        title="부서 삭제"
        message={
          <>
            정말로 이 부서를 삭제하시겠습니까?
            <br />
            삭제된 부서는 복구할 수 없습니다.
          </>
        }
        type="confirm"
        actions={[
          {
            label: "취소",
            onClick: () => {
              setShowDeleteConfirm(false);
              setDepartmentToDelete(null);
            },
            variant: "outline",
          },
          {
            label: "삭제",
            onClick: confirmDelete,
            variant: "error",
          },
        ]}
      />
    </div>
  );
};

export default SettingsDepartments;
