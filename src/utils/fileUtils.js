/**
 * 파일 관련 유틸리티 함수
 */
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/config";

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

// 파일 크기 포맷팅
export const formatFileSize = (bytes) => {
  if (bytes === 0 || !bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

// 파일 확장자 추출
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

// 파일 타입에 따른 아이콘 클래스 반환
export const getFileIconClass = (fileType) => {
  if (!fileType) return "file";

  if (fileType.includes("pdf")) return "file-pdf";
  if (fileType.includes("word") || fileType.includes("doc")) return "file-word";
  if (
    fileType.includes("sheet") ||
    fileType.includes("excel") ||
    fileType.includes("xls")
  )
    return "file-excel";
  if (fileType.includes("image")) return "file-image";
  if (
    fileType.includes("html") ||
    fileType.includes("javascript") ||
    fileType.includes("css") ||
    fileType.includes("json")
  )
    return "file-code";
  if (
    fileType.includes("zip") ||
    fileType.includes("rar") ||
    fileType.includes("tar") ||
    fileType.includes("gz")
  )
    return "file-archive";
  if (fileType.includes("csv")) return "file-csv";
  if (
    fileType.includes("presentation") ||
    fileType.includes("powerpoint") ||
    fileType.includes("ppt")
  )
    return "file-powerpoint";
  if (fileType.includes("video")) return "file-video";
  if (fileType.includes("audio")) return "file-audio";

  return "file";
};

// 파일 크기 및 타입 검증
export const validateFiles = (files, maxFileSize = 2, maxTotalSize = 10) => {
  // 개별 파일 크기 검증
  const maxFileSizeBytes = maxFileSize * 1024 * 1024;
  const oversizedFiles = files.filter((file) => file.size > maxFileSizeBytes);

  if (oversizedFiles.length > 0) {
    return {
      valid: false,
      message: `다음 파일이 ${maxFileSize}MB 제한을 초과합니다: ${oversizedFiles
        .map((f) => f.name)
        .join(", ")}`,
    };
  }

  // 총 파일 크기 검증
  const maxTotalSizeBytes = maxTotalSize * 1024 * 1024;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > maxTotalSizeBytes) {
    return {
      valid: false,
      message: `총 파일 크기가 ${maxTotalSize}MB 제한을 초과합니다.`,
    };
  }

  return { valid: true };
};

// 이미지 압축
export const compressImage = async (file, options = {}) => {
  try {
    // 동적으로 browser-image-compression 라이브러리 로드
    const imageCompression = await import("browser-image-compression").then(
      (module) => module.default
    );

    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      ...options,
    };

    return await imageCompression(file, defaultOptions);
  } catch (error) {
    console.error("이미지 압축 중 오류 발생:", error);
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
