/**
 * 날짜 형식을 변환하는 유틸리티 함수
 * @param {string|Date} date - 변환할 날짜 (문자열 또는 Date 객체)
 * @param {string} format - 출력 형식 (기본값: 'YYYY-MM-DD')
 * @returns {string} 형식화된 날짜 문자열
 */
export const formatDate = (date, format = "YYYY-MM-DD") => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  // 유효하지 않은 날짜인 경우
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};

/**
 * 날짜를 상대적 시간으로 표시하는 함수
 * @param {string|Date} date - 변환할 날짜 (문자열 또는 Date 객체)
 * @returns {string} 상대적 시간 문자열
 */
export const timeAgo = (date) => {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  // 유효하지 않은 날짜인 경우
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) {
    return "방금 전";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}분 전`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}시간 전`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}주 전`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months}개월 전`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years}년 전`;
  }
};

/**
 * 두 날짜 사이의 일수 계산
 * @param {string|Date} startDate - 시작 날짜
 * @param {string|Date} endDate - 종료 날짜
 * @returns {number} 일수 차이
 */
export const daysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  // 유효하지 않은 날짜인 경우
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  // 시간, 분, 초를 제거하고 일수만 계산
  const startUtc = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

  return Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24));
};

/**
 * 날짜가 유효한지 확인
 * @param {string|Date} date - 확인할 날짜
 * @returns {boolean} 유효 여부
 */
export const isValidDate = (date) => {
  if (!date) return false;

  const d = typeof date === "string" ? new Date(date) : date;
  return !isNaN(d.getTime());
};
