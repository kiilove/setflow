"use client";

import { useState, useEffect } from "react";
import { useMessageContext } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Plus, Pencil, Trash2, X, ArrowLeft } from "lucide-react";
import LocationForm from "../locations/LocationForm";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import ModalMessage from "../common/ModalMessage";

const SettingsLocations = () => {
  const { showSuccess, showError } = useMessageContext();
  const { userUUID } = useAuth();

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    detail: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, `clients/${userUUID}/settings`, "locations");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setLocations(data.locations || []);
      } else {
        setLocations([]);
      }
    } catch (error) {
      showError("오류", "위치 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const docRef = doc(db, `clients/${userUUID}/settings`, "locations");
      const docSnap = await getDoc(docRef);

      let updatedLocations = [];
      if (docSnap.exists()) {
        updatedLocations = [...docSnap.data().locations];
      }

      if (editingLocation) {
        // 수정
        const index = updatedLocations.findIndex(
          (l) => l.id === editingLocation.id
        );
        if (index !== -1) {
          updatedLocations[index] = { ...data, id: editingLocation.id };
        }
      } else {
        // 추가
        const newId = Date.now().toString();
        updatedLocations.push({ ...data, id: newId });
      }

      // 저장할 데이터를 변수에 담기
      const dataToSave = {
        locations: updatedLocations,
        updatedAt: serverTimestamp(),
      };

      // 저장 전 데이터 로깅
      console.log("=== 저장 전 데이터 ===");
      console.log("전체 데이터:", dataToSave);

      // 문서가 존재하든 없든 setDoc을 사용하여 전체 문서를 덮어씁니다
      await setDoc(docRef, {
        ...dataToSave,
        createdAt: docSnap.exists()
          ? docSnap.data().createdAt
          : serverTimestamp(),
      });

      // 저장 후 데이터 로깅
      console.log("=== 저장 후 데이터 ===");
      console.log("전체 데이터:", dataToSave);

      showSuccess(
        "저장 완료",
        editingLocation ? "위치가 수정되었습니다." : "위치가 추가되었습니다."
      );

      setShowForm(false);
      setEditingLocation(null);
      setFormData({
        name: "",
        address: "",
        description: "",
        icon: "MapPin",
        iconColor: "bg-gray-100",
        iconTextColor: "text-gray-500",
      });
      loadLocations();
    } catch (error) {
      showError("오류", "위치 저장에 실패했습니다.");
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      address: location.address || "",
      detail: location.detail || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setLocationToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;

    try {
      const docRef = doc(db, `clients/${userUUID}/settings`, "locations");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const updatedLocations = docSnap
          .data()
          .locations.filter((loc) => loc.id !== locationToDelete);
        await setDoc(docRef, { locations: updatedLocations });
        showSuccess("삭제 완료", "위치가 삭제되었습니다.");
        loadLocations();
      }
    } catch (error) {
      showError("오류", "위치 삭제에 실패했습니다.");
    } finally {
      setShowDeleteConfirm(false);
      setLocationToDelete(null);
    }
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
                  setEditingLocation(null);
                }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </button>
            </div>
            <h3 className="text-base font-semibold">
              {editingLocation ? "위치 수정" : "위치 추가"}
            </h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <LocationForm
            initialValues={formData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingLocation(null);
            }}
            isEditing={!!editingLocation}
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
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold">위치 관리</h3>
          </div>
          <button
            onClick={() => {
              setEditingLocation(null);
              setFormData({
                name: "",
                description: "",
                address: "",
                detail: "",
              });
              setShowForm(true);
            }}
            className="inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            위치 추가
          </button>
        </div>
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
              <h4 className="text-base font-medium mb-2">
                등록된 위치가 없습니다
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                새로운 위치를 추가하여 관리해보세요
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="bg-card border border-border rounded-lg shadow-sm hover:shadow transition-shadow overflow-hidden"
                >
                  <div className="p-3 sm:p-4 border-b border-border">
                    <div className="flex items-center mb-2">
                      <div className="p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3 bg-gray-100 text-gray-500">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h3 className="text-base font-medium text-foreground">
                        {location.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 h-8 sm:h-10">
                      {location.description || "설명 없음"}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4">
                    {location.address && (
                      <div className="flex items-center text-xs sm:text-sm mb-3 sm:mb-4">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                        <span className="text-muted-foreground">
                          {location.address}
                          {location.detail && ` (${location.detail})`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(location.id)}
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
          setLocationToDelete(null);
        }}
        title="위치 삭제"
        message={
          <>
            정말로 이 위치를 삭제하시겠습니까?
            <br />
            삭제된 위치는 복구할 수 없습니다.
          </>
        }
        type="confirm"
        actions={[
          {
            label: "취소",
            onClick: () => {
              setShowDeleteConfirm(false);
              setLocationToDelete(null);
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

export default SettingsLocations;
