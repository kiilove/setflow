/**
 * 객체의 모든 빈값을 빈 문자열("")로 변환하는 함수
 * @param {Object} obj - 처리할 객체
 * @returns {Object} - 빈값이 처리된 객체
 */
export const sanitizeEmptyValues = (obj) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) {
      sanitized[key] = "";
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeEmptyValues(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * 객체의 특정 필드가 빈값인지 확인하는 함수
 * @param {Object} obj - 확인할 객체
 * @param {string} field - 확인할 필드명
 * @returns {boolean} - 필드가 빈값이면 true, 아니면 false
 */
export const isEmptyField = (obj, field) => {
  if (!obj || typeof obj !== "object") {
    return true;
  }

  const value = obj[field];
  return value === undefined || value === null || value === "";
};
