import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Firebase Storage 관련 유틸리티 함수
 */

// 파일 업로드 기본 함수 (내부용)
export const uploadToStorage = async (file, path) => {
  if (!file) return null;

  const timestamp = Date.now();
  const filename = file.name.replace(/[^a-zA-Z0-9.]/g, "_"); // 특수문자 제거
  const storageRef = ref(storage, `${path}/${timestamp}_${filename}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    throw error;
  }
};

// Storage에서 파일 삭제
export const deleteFileFromStorage = async (url) => {
  if (!url) return;

  try {
    // URL에서 참조 경로 추출
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("파일 삭제 중 오류 발생:", error);
    throw error;
  }
};

// 자산 관련 모든 파일 삭제
export const deleteAssetFiles = async (asset) => {
  if (!asset) return;

  const deletePromises = [];

  // 메인 이미지 삭제
  if (asset.image) {
    deletePromises.push(
      deleteFileFromStorage(asset.image).catch((err) =>
        console.error(`메인 이미지 삭제 실패: ${err.message}`)
      )
    );
  }

  // 첨부 파일 삭제
  if (asset.attachments && Array.isArray(asset.attachments)) {
    asset.attachments.forEach((file) => {
      if (file.url) {
        deletePromises.push(
          deleteFileFromStorage(file.url).catch((err) =>
            console.error(`첨부 파일 삭제 실패 (${file.name}): ${err.message}`)
          )
        );
      }
    });
  }

  // 모든 삭제 작업 완료 대기
  if (deletePromises.length > 0) {
    try {
      await Promise.allSettled(deletePromises);
    } catch (error) {
      console.error("자산 파일 삭제 중 오류 발생:", error);
    }
  }

  return true;
};

// 여러 자산의 모든 파일 삭제
export const deleteMultipleAssetFiles = async (assets) => {
  if (!assets || !Array.isArray(assets) || assets.length === 0) return;

  const deletePromises = assets.map((asset) => deleteAssetFiles(asset));

  try {
    await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error("여러 자산 파일 삭제 중 오류 발생:", error);
  }

  return true;
};
