/**
 * Firebase Functions v2 - 사용자 데이터 암호화/복호화 모듈
 *
 * 버전: 2.0.0
 *
 * 주요 기능:
 * 1. 사용자 데이터 암호화 (이름, 이메일, 전화번호, 내선번호)
 * 2. 사용자 데이터 복호화
 * 3. Firestore 트리거를 통한 자동 암호화
 *
 * 암호화 대상 필드:
 * - name: 사용자 이름
 * - email: 이메일 주소
 * - phone: 전화번호
 * - extension: 내선번호
 *
 * 사용 방법:
 * 1. 환경변수 설정:
 *    - ENCRYPTION_KEY: 64자리 hex 문자열 (32바이트)
 *
 * 2. 트리거:
 *    - onUserCreate: 사용자 생성 시 자동 암호화
 *    - onUserUpdate: 사용자 수정 시 자동 암호화
 *
 * 3. API:
 *    - getUser: 복호화된 사용자 데이터 조회
 */

// Firebase Functions v2 encryption code
/* eslint-disable require-jsdoc */

const admin = require('firebase-admin');
const crypto = require('crypto');
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require('firebase-functions/v2/firestore');
const {onCall} = require('firebase-functions/v2/https');

admin.initializeApp();

// 환경변수에서 64자리 hex 키를 읽어 검증
function getKey() {
  const keyHex = process.env.ENCRYPTION_KEY || '';
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be a 32-byte (64-char hex) string');
  }
  return key;
}

// AES-256-GCM 암호화
function encryptData(plainText, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    data: ciphertext.toString('hex'),
    tag: authTag.toString('hex'),
  };
}

// AES-256-GCM 복호화
function decryptData(enc, key) {
  const iv = Buffer.from(enc.iv, 'hex');
  const ciphertext = Buffer.from(enc.data, 'hex');
  const authTag = Buffer.from(enc.tag, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString('utf8');
}

// 사용자 문서 내 민감 필드 암호화
function encryptUserData(data, key) {
  if (!data) return {};
  const out = {...data};
  if (typeof data.name === 'string') {
    out.name = encryptData(data.name, key);
  }
  if (typeof data.email === 'string') {
    out.email = encryptData(data.email, key);
  }
  if (typeof data.phone === 'string') {
    out.phone = encryptData(data.phone, key);
  }
  if (typeof data.extension === 'string') {
    out.extension = encryptData(data.extension, key);
  }
  return out;
}

// 사용자 문서 내 민감 필드 복호화
function decryptUserData(data, key) {
  if (!data) return {};
  const out = {...data};
  if (
    data.name &&
    typeof data.name.iv === 'string' &&
    typeof data.name.data === 'string' &&
    typeof data.name.tag === 'string'
  ) {
    out.name = decryptData(data.name, key);
  }
  if (
    data.email &&
    typeof data.email.iv === 'string' &&
    typeof data.email.data === 'string' &&
    typeof data.email.tag === 'string'
  ) {
    out.email = decryptData(data.email, key);
  }
  if (
    data.phone &&
    typeof data.phone.iv === 'string' &&
    typeof data.phone.data === 'string' &&
    typeof data.phone.tag === 'string'
  ) {
    out.phone = decryptData(data.phone, key);
  }
  if (
    data.extension &&
    typeof data.extension.iv === 'string' &&
    typeof data.extension.data === 'string' &&
    typeof data.extension.tag === 'string'
  ) {
    out.extension = decryptData(data.extension, key);
  }
  return out;
}

// Firestore 트리거: 사용자 생성 시 암호화
exports.onUserCreate = onDocumentCreated('users/{userId}', async (event) => {
  try {
    const key = getKey();
    const snap = event.data.after;
    const data = snap.data() || {};

    const alreadyEncrypted =
      (data.name && data.name.iv) ||
      (data.email && data.email.iv) ||
      (data.phone && data.phone.iv) ||
      (data.extension && data.extension.iv);

    if (!alreadyEncrypted) {
      const encrypted = encryptUserData(data, key);
      await snap.ref.update(encrypted);
    }
  } catch (error) {
    console.error('[암호화] 사용자 생성 시 암호화 실패:', error);
    throw error;
  }
});

// Firestore 트리거: 사용자 수정 시 암호화
exports.onUserUpdate = onDocumentUpdated('users/{userId}', async (event) => {
  try {
    const key = getKey();
    const snap = event.data.after;
    const data = snap.data() || {};

    const alreadyEncrypted =
      (data.name && data.name.iv) ||
      (data.email && data.email.iv) ||
      (data.phone && data.phone.iv) ||
      (data.extension && data.extension.iv);

    if (!alreadyEncrypted) {
      const encrypted = encryptUserData(data, key);
      await snap.ref.update(encrypted);
    }
  } catch (error) {
    console.error('[암호화] 사용자 수정 시 암호화 실패:', error);
    throw error;
  }
});

// HTTPS Callable: 클라이언트 요청 시 복호화된 데이터 반환
exports.getUser = onCall(async (req) => {
  try {
    const key = getKey();
    const {userId} = req.data;

    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    const doc = await admin.firestore().collection('users').doc(userId).get();

    if (!doc.exists) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return decryptUserData(doc.data() || {}, key);
  } catch (error) {
    console.error('[복호화] 사용자 데이터 조회 실패:', error);
    throw error;
  }
});
