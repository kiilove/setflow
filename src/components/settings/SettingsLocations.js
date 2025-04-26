"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import useModalMessage from "../../hooks/useModalMessage";
import { MapPin, Plus, Pencil, Trash2, X } from "lucide-react";

const SettingsLocations = () => {
  const { getCollection, addDocument, updateDocument, deleteDocument } =
    useFirestore();
  const { showModal } = useModalMessage();

  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const data = await getCollection("locations");
      setLocations(data);
    } catch (error) {
      showModal("error", "위치 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!newLocation.trim()) {
      setError("위치명을 입력해주세요.");
      return false;
    }
    if (
      locations.some((l) => l.name.toLowerCase() === newLocation.toLowerCase())
    ) {
      setError("이미 존재하는 위치명입니다.");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddLocation = async () => {
    if (!validateForm()) return;

    try {
      await addDocument("locations", { name: newLocation });
      setNewLocation("");
      setSuccess("위치가 추가되었습니다.");
      loadLocations();
    } catch (error) {
      showModal("error", "위치 추가에 실패했습니다.");
    }
  };

  const handleEditLocation = async (id, newName) => {
    if (!newName.trim()) {
      setError("위치명을 입력해주세요.");
      return;
    }
    if (
      locations.some(
        (l) => l.id !== id && l.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      setError("이미 존재하는 위치명입니다.");
      return;
    }

    try {
      await updateDocument("locations", id, { name: newName });
      setEditing(null);
      setSuccess("위치가 수정되었습니다.");
      loadLocations();
    } catch (error) {
      showModal("error", "위치 수정에 실패했습니다.");
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await deleteDocument("locations", id);
      setSuccess("위치가 삭제되었습니다.");
      loadLocations();
    } catch (error) {
      showModal("error", "위치 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-green-50 text-green-800 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border">
        <div className="p-4 border-b border-border theme-transition flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">위치 관리</h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            {locations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h4 className="text-lg font-medium mb-2">
                  등록된 위치가 없습니다
                </h4>
                <p className="text-muted-foreground mb-4">
                  새로운 위치를 추가하여 관리해보세요
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 relative max-w-md">
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="새 위치명 입력"
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition pr-10"
                    />
                    <button
                      onClick={handleAddLocation}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                >
                  {editing === location.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        defaultValue={location.name}
                        className="flex-1 px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                        ref={(input) => input && input.focus()}
                        onBlur={(e) =>
                          handleEditLocation(location.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleEditLocation(location.id, e.target.value);
                          } else if (e.key === "Escape") {
                            setEditing(null);
                          }
                        }}
                      />
                      <button
                        onClick={() => setEditing(null)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{location.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditing(location.id)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(location.id)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLocations;
