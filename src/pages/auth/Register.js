"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../firebase/config";

const Register = () => {
  const navigate = useNavigate();
  const { showError } = useMessageContext();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // ----------------------------------------------------
  // Firestore 쓰기 단계별 디버깅 헬퍼
  // ----------------------------------------------------
  const createUserRecords = async (user, name, email, uuid) => {
    const ts = serverTimestamp();

    // 1) profile
    const profileData = { name, email, createdAt: ts };
    console.log("🔍 [디버깅] profile에 넘기는 데이터:", profileData);
    if (typeof name === "undefined" || typeof email === "undefined") {
      console.error("❌ name 또는 email이 undefined입니다!", { name, email });
      throw new Error("프로필 저장용 데이터가 올바르지 않습니다.");
    }
    try {
      console.log(
        "🔍 [Firestore] profile 쓰기 시도 → clients/%s/profile/default",
        uuid
      );
      await setDoc(doc(db, `clients/${uuid}/profile/default`), profileData);
      console.log("    ✅ [Firestore] profile 저장 완료");
    } catch (error) {
      console.error("Firestore 에러 상세:", {
        code: error.code,
        message: error.message,
        details: error.details,
      });
      throw error;
    }

    // 2) preferences
    const preferencesData = { theme: "light", language: "ko", createdAt: ts };
    console.log("🔍 [디버깅] preferences에 넘기는 데이터:", preferencesData);
    try {
      console.log(
        "🔍 [Firestore] preferences 쓰기 시도 → clients/%s/preferences/default",
        uuid
      );
      await setDoc(
        doc(db, `clients/${uuid}/preferences/default`),
        preferencesData
      );
      console.log("    ✅ [Firestore] preferences 저장 완료");
    } catch (e) {
      console.error("    ❌ [Firestore] preferences 저장 실패:", e);
      throw e;
    }

    // 3) license
    const licenseData = {
      subscriptionType: "free",
      licenseStatus: "active",
      expireAt: null,
      createdAt: ts,
    };
    console.log("🔍 [디버깅] license에 넘기는 데이터:", licenseData);
    try {
      console.log(
        "🔍 [Firestore] license 쓰기 시도 → clients/%s/license/default",
        uuid
      );
      await setDoc(doc(db, `clients/${uuid}/license/default`), licenseData);
      console.log("    ✅ [Firestore] license 저장 완료");
    } catch (e) {
      console.error("    ❌ [Firestore] license 저장 실패:", e);
      throw e;
    }

    // 4) uid_map
    const uidMapData = { uuid };
    console.log("🔍 [디버깅] uid_map에 넘기는 데이터:", uidMapData);
    try {
      console.log("🔍 [Firestore] uid_map 쓰기 시도 → uid_map/%s", user.uid);
      await setDoc(doc(db, "uid_map", user.uid), uidMapData);
      console.log("    ✅ [Firestore] uid_map 저장 완료");
    } catch (e) {
      console.error("    ❌ [Firestore] uid_map 저장 실패:", e);
      throw e;
    }

    console.log("🔍 [Firestore] 모든 쓰기 단계 완료");
  };

  // ----------------------------------------------------
  // 입력 검증
  // ----------------------------------------------------
  const validateForm = () => {
    console.log("🔍 [검증] 입력값 검증 시작");
    if (!formData.name || !formData.email || !formData.password) {
      showError("입력 오류", "모든 필드를 입력해주세요.");
      console.warn("    ⚠️ 검증 실패: 빈 필드 발견");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      showError("입력 오류", "비밀번호가 일치하지 않습니다.");
      console.warn("    ⚠️ 검증 실패: 비밀번호 불일치");
      return false;
    }
    console.log("    ✅ [검증] 입력값 통과");
    return true;
  };

  const getErrorMessage = (code) => {
    console.log("🔍 [에러코드 처리] code =", code);
    switch (code) {
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다.";
      case "auth/invalid-email":
        return "유효하지 않은 이메일 형식입니다.";
      case "auth/weak-password":
        return "비밀번호가 너무 약합니다.";
      default:
        return code;
    }
  };

  // ----------------------------------------------------
  // 이메일/비밀번호 회원가입 핸들러
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 [폼 제출] 이메일 회원가입 요청 →", formData.email);

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    console.log("⏳ [회원가입] 프로세스 시작");

    try {
      console.log("  • [Auth] createUserWithEmailAndPassword 시도");
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("    ✅ [Auth] 회원가입 성공 → UID:", user.uid);

      console.log("  • [Auth] updateProfile 시도 →", formData.name);
      await updateProfile(user, { displayName: formData.name });
      console.log("    ✅ [Auth] 프로필 업데이트 완료");

      const uuid = uuidv4();
      console.log("  • [UUID] 생성 완료 →", uuid);

      // Firestore에 사용자 기록 생성
      await createUserRecords(user, formData.name, formData.email, uuid);

      console.log("  • [Auth] 이메일 인증 메일 발송 시도");
      await sendEmailVerification(user);
      console.log("    ✅ [Auth] 이메일 인증 메일 전송 완료");

      console.log("🎉 [회원가입 완료] 메인 페이지로 이동");
      navigate("/");
    } catch (err) {
      console.error("❌ [회원가입 에러] 발생:", err);
      const msg = err.code ? getErrorMessage(err.code) : err.message;
      setError(msg);
    } finally {
      setLoading(false);
      console.log("⏱ [회원가입] 프로세스 종료");
    }
  };

  // ----------------------------------------------------
  // 소셜 로그인 핸들러 (Google / Naver / Kakao)
  // ----------------------------------------------------
  const handleSocialRegister = (providerName, provider) => async () => {
    console.log(`📝 [폼 제출] ${providerName} 회원가입 시작`);
    setLoading(true);
    setError("");

    try {
      console.log(`  • [Auth] ${providerName} 팝업 열기`);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(`    ✅ [Auth] ${providerName} 로그인 성공 → UID:`, user.uid);

      const uuid = uuidv4();
      console.log("  • [UUID] 생성 완료 →", uuid);

      // Firestore에 사용자 기록 생성
      await createUserRecords(
        user,
        user.displayName || "",
        user.email || "",
        uuid
      );

      console.log(`🎉 [${providerName} 회원가입 완료] 메인 페이지로 이동`);
      navigate("/");
    } catch (err) {
      console.error(`❌ [${providerName} 에러] 발생:`, err);
      setError("회원가입 처리 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
      console.log(`⏱ [${providerName}] 프로세스 종료`);
    }
  };

  // ----------------------------------------------------
  // OAuthProvider 설정
  // ----------------------------------------------------
  const googleProvider = new GoogleAuthProvider();
  const naverProvider = new OAuthProvider("naver.com");
  naverProvider.setCustomParameters({ prompt: "select_account" });
  const kakaoProvider = new OAuthProvider("kakao.com");
  kakaoProvider.setCustomParameters({ prompt: "select_account" });

  // ----------------------------------------------------
  // JSX
  // ----------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">회원가입</h1>
            <p className="text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                로그인
              </Link>
            </p>
          </div>

          {error && (
            <p className="mb-4 text-red-500 text-sm text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 이름 */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                이름
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                이메일
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            {/* 가입 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md ${getButtonVariantClass(
                "primary"
              )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          {/* 소셜 회원가입 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  또는 다음으로 회원가입
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={handleSocialRegister("Google", googleProvider)}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/assets/images/google.svg"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Google
              </button>
              <button
                onClick={handleSocialRegister("Naver", naverProvider)}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/assets/images/naver.svg"
                  alt="Naver"
                  className="h-5 w-5 mr-2"
                />
                Naver
              </button>
              <button
                onClick={handleSocialRegister("Kakao", kakaoProvider)}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/assets/images/kakao.svg"
                  alt="Kakao"
                  className="h-5 w-5 mr-2"
                />
                Kakao
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
