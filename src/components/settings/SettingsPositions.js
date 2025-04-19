"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { useMessageContext } from "../../context/MessageContext";
import { useAuth } from "../../context/AuthContext";
import { useConfirm } from "../../context/ConfirmContext";
import { ConfirmProvider } from "../../context/ConfirmContext";
import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DEFAULT_POSITIONS = [
  {
    id: 1,
    name: "사원",
    level: 1,
    description: "일반 사원 - 기본적인 업무 수행",
  },
  {
    id: 2,
    name: "주임",
    level: 2,
    description: "주임 - 사원의 상위 직위, 팀 내 기본 업무 지휘",
  },
  {
    id: 3,
    name: "대리",
    level: 3,
    description: "대리 - 팀 내 중간 관리자, 업무 지휘 및 감독",
  },
  {
    id: 4,
    name: "과장",
    level: 4,
    description: "과장 - 팀 리더, 팀 운영 및 관리",
  },
  {
    id: 5,
    name: "차장",
    level: 5,
    description: "차장 - 부서 내 중간 관리자, 부서 운영 보조",
  },
  {
    id: 6,
    name: "부장",
    level: 6,
    description: "부장 - 부서장, 부서 운영 및 관리",
  },
  { id: 7, name: "이사", level: 7, description: "이사 - 사업부 운영 및 관리" },
  { id: 8, name: "상무", level: 8, description: "상무 - 회사 전반 운영 보조" },
  {
    id: 9,
    name: "전무",
    level: 9,
    description: "전무 - 회사 전반 운영 및 관리",
  },
  {
    id: 10,
    name: "부사장",
    level: 10,
    description: "부사장 - 회사 전반 운영 및 전략 수립",
  },
  { id: 11, name: "사장", level: 11, description: "사장 - 회사 최고 경영자" },
];

const DEFAULT_TITLES = [
  { id: 1, name: "팀원", description: "팀 내 일반 구성원" },
  { id: 2, name: "팀장", description: "팀 운영 및 관리 책임자" },
  { id: 3, name: "부서장", description: "부서 운영 및 관리 책임자" },
  { id: 4, name: "본부장", description: "본부 운영 및 관리 책임자" },
  { id: 5, name: "사업부장", description: "사업부 운영 및 관리 책임자" },
  { id: 6, name: "상임이사", description: "회사 전반 운영 및 관리 책임자" },
  { id: 7, name: "대표이사", description: "회사 최고 경영 책임자" },
];

const SettingsPositionsContent = () => {
  const { showSuccess, showError, showWarning } = useMessageContext();
  const { showConfirm } = useConfirm();
  const navigate = useNavigate();
  const [positionSettings, setPositionSettings] = useState({
    positions: DEFAULT_POSITIONS,
    titles: DEFAULT_TITLES,
    newPosition: {
      name: "",
      level: "",
      description: "",
    },
    newTitle: {
      name: "",
      description: "",
    },
  });
  const { user } = useAuth();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const docRef = doc(db, "settings", "positions");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPositionSettings((prev) => ({
          ...prev,
          positions: data.positions || DEFAULT_POSITIONS,
          titles: data.titles || DEFAULT_TITLES,
        }));
      } else {
        setPositionSettings((prev) => ({
          ...prev,
          positions: DEFAULT_POSITIONS,
          titles: DEFAULT_TITLES,
        }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      showError("설정을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPositionSettings((prev) => {
        const oldIndex = prev.positions.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = prev.positions.findIndex(
          (item) => item.id === over.id
        );

        const newPositions = arrayMove(prev.positions, oldIndex, newIndex);

        // 레벨 업데이트
        const updatedPositions = newPositions.map((position, index) => ({
          ...position,
          level: index + 1,
        }));

        return {
          ...prev,
          positions: updatedPositions,
        };
      });
    }
  };

  const handleNewPositionChange = (e) => {
    const { name, value } = e.target;
    setPositionSettings((prev) => ({
      ...prev,
      newPosition: {
        ...prev.newPosition,
        [name]: value,
      },
    }));
  };

  const handleNewTitleChange = (e) => {
    const { name, value } = e.target;
    setPositionSettings((prev) => ({
      ...prev,
      newTitle: {
        ...prev.newTitle,
        [name]: value,
      },
    }));
  };

  const handleAddPosition = () => {
    if (!positionSettings.newPosition.name) {
      showWarning("직위 추가", "직위명을 입력해주세요.");
      return;
    }

    const newPosition = {
      id: Date.now(),
      name: positionSettings.newPosition.name,
      level: positionSettings.positions.length + 1,
      description: positionSettings.newPosition.description,
    };

    setPositionSettings((prev) => ({
      ...prev,
      positions: [...prev.positions, newPosition],
      newPosition: {
        name: "",
        level: "",
        description: "",
      },
    }));

    showSuccess("직위 추가", "새 직위가 추가되었습니다.");
  };

  const handleAddTitle = () => {
    if (!positionSettings.newTitle.name) {
      showWarning("직책 추가", "직책명을 입력해주세요.");
      return;
    }

    const newTitle = {
      id: Date.now(),
      ...positionSettings.newTitle,
    };

    setPositionSettings((prev) => ({
      ...prev,
      titles: [...prev.titles, newTitle],
      newTitle: {
        name: "",
        description: "",
      },
    }));

    showSuccess("직책 추가", "새 직책이 추가되었습니다.");
  };

  const handleResetPositions = () => {
    showConfirm(
      "직위 초기화",
      "모든 직위를 기본값으로 초기화하시겠습니까?",
      () => {
        setPositionSettings((prev) => ({
          ...prev,
          positions: DEFAULT_POSITIONS,
        }));
        showSuccess("직위 초기화", "직위가 기본값으로 초기화되었습니다.");
      }
    );
  };

  const handleResetTitles = () => {
    showConfirm(
      "직책 초기화",
      "모든 직책을 기본값으로 초기화하시겠습니까?",
      () => {
        setPositionSettings((prev) => ({
          ...prev,
          titles: DEFAULT_TITLES,
        }));
        showSuccess("직책 초기화", "직책이 기본값으로 초기화되었습니다.");
      }
    );
  };

  const handleDeletePosition = (id) => {
    showConfirm("직위 삭제", "이 직위를 삭제하시겠습니까?", () => {
      setPositionSettings((prev) => {
        const newPositions = prev.positions.filter(
          (position) => position.id !== id
        );
        // 레벨 재조정
        const updatedPositions = newPositions.map((position, index) => ({
          ...position,
          level: index + 1,
        }));
        return {
          ...prev,
          positions: updatedPositions,
        };
      });
      showSuccess("직위 삭제", "직위가 삭제되었습니다.");
    });
  };

  const handleDeleteTitle = (id) => {
    showConfirm("직책 삭제", "이 직책을 삭제하시겠습니까?", () => {
      setPositionSettings((prev) => ({
        ...prev,
        titles: prev.titles.filter((title) => title.id !== id),
      }));
      showSuccess("직책 삭제", "직책이 삭제되었습니다.");
    });
  };

  const handleSavePositions = async () => {
    try {
      const docRef = doc(db, "settings", "positions");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          positions: positionSettings.positions,
        });
      } else {
        await setDoc(docRef, {
          positions: positionSettings.positions,
        });
      }
      showSuccess("직위 저장", "직위가 저장되었습니다.");
    } catch (error) {
      console.error("Error saving positions:", error);
      showError("직위 저장", "직위 저장 중 오류가 발생했습니다.");
    }
  };

  const handleSaveTitles = async () => {
    try {
      const docRef = doc(db, "settings", "titles");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          titles: positionSettings.titles,
        });
      } else {
        await setDoc(docRef, {
          titles: positionSettings.titles,
        });
      }
      showSuccess("직책 저장", "직책이 저장되었습니다.");
    } catch (error) {
      console.error("Error saving titles:", error);
      showError("직책 저장", "직책 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
        <div className="p-4 border-b border-border theme-transition">
          <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-blue-500" />
            직위/직책 관리
          </h3>
        </div>
        <div className="p-4">
          <div className="space-y-8">
            {/* 직위 관리 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  직위 관리
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleResetPositions}
                    className="inline-flex items-center px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    직위 초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePositions}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    직위 저장
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                직위는 조직 내에서의 계층적 위치를 나타냅니다. 드래그앤드롭으로
                순서를 변경할 수 있으며, 순서에 따라 레벨이 자동으로 조정됩니다.
              </p>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={positionSettings.positions}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {positionSettings.positions.map((position) => (
                      <SortableItem key={position.id} id={position.id}>
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-muted-foreground">
                              Lv.{position.level}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {position.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {position.description}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePosition(position.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-4 space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  새 직위 추가
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="newPositionName"
                      className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                    >
                      직위명
                    </label>
                    <input
                      type="text"
                      id="newPositionName"
                      name="name"
                      value={positionSettings.newPosition.name}
                      onChange={handleNewPositionChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPositionDescription"
                      className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                    >
                      설명
                    </label>
                    <input
                      type="text"
                      id="newPositionDescription"
                      name="description"
                      value={positionSettings.newPosition.description}
                      onChange={handleNewPositionChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddPosition}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="mr-2 -ml-1 h-4 w-4" />
                    직위 추가
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* 직책 관리 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  직책 관리
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleResetTitles}
                    className="inline-flex items-center px-3 py-1 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    직책 초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTitles}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    직책 저장
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                직책은 맡은 일의 성격과 책임을 나타냅니다. (예: 팀장, 부서장,
                이사, 상무, 전무)
              </p>

              <div className="space-y-2">
                {positionSettings.titles.map((title) => (
                  <div
                    key={title.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-foreground">
                        {title.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {title.description}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteTitle(title.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                <h4 className="text-md font-medium text-foreground theme-transition">
                  새 직책 추가
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="newTitleName"
                      className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                    >
                      직책명
                    </label>
                    <input
                      type="text"
                      id="newTitleName"
                      name="name"
                      value={positionSettings.newTitle.name}
                      onChange={handleNewTitleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newTitleDescription"
                      className="block text-sm font-medium text-muted-foreground theme-transition mb-1"
                    >
                      설명
                    </label>
                    <input
                      type="text"
                      id="newTitleDescription"
                      name="description"
                      value={positionSettings.newTitle.description}
                      onChange={handleNewTitleChange}
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground theme-transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddTitle}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Plus className="mr-2 -ml-1 h-4 w-4" />
                    직책 추가
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPositions = () => {
  return (
    <ConfirmProvider>
      <SettingsPositionsContent />
    </ConfirmProvider>
  );
};

export default SettingsPositions;
