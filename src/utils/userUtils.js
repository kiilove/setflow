import { functions } from "../config/firebase";
import { httpsCallable } from "firebase/functions";

// 사용자 데이터 복호화 (암호화는 Firestore 트리거에서 자동으로 처리됨)
export const decryptUserData = async (userId) => {
  try {
    console.log("[복호화] 복호화 시작, 사용자 ID:", userId);
    const decryptUser = httpsCallable(functions, "getUser");
    const result = await decryptUser({ userId });
    console.log("[복호화] 복호화 결과:", result.data);
    return result.data;
  } catch (error) {
    console.error("[복호화] 오류 발생:", error);
    throw error;
  }
};
