import { db } from "../firebase/config";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";

// 기본 직위 데이터
export const defaultPositions = [
  { name: "사원", isDefault: true },
  { name: "대리", isDefault: true },
  { name: "과장", isDefault: true },
  { name: "차장", isDefault: true },
  { name: "부장", isDefault: true },
  { name: "이사", isDefault: true },
  { name: "상무", isDefault: true },
  { name: "전무", isDefault: true },
  { name: "부사장", isDefault: true },
  { name: "사장", isDefault: true },
];

// 기본 직책 데이터
export const defaultTitles = [
  "팀원",
  "팀장",
  "부서장",
  "본부장",
  "사업부장",
  "대표이사",
];

// 기본 데이터 저장 함수
export const saveDefaultData = async (companyId) => {
  try {
    // 직위 데이터 저장
    const positionsRef = collection(db, `companies/${companyId}/positions`);
    for (const position of defaultPositions) {
      await addDoc(positionsRef, {
        ...position,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 직책 데이터 저장
    const titlesRef = collection(db, `companies/${companyId}/titles`);
    for (const title of defaultTitles) {
      await setDoc(doc(titlesRef), {
        name: title,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return true;
  } catch (error) {
    console.error("기본 데이터 저장 중 오류 발생:", error);
    throw error;
  }
};
