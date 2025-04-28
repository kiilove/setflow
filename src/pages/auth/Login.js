"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Chrome,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const Login = () => {
  const navigate = useNavigate();
  const { showError } = useMessageContext();
  const { setUser, setUserUUID } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showError("입력 오류", "이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      console.log("[Login] 로그인 시도:", formData.email);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log("[Login] Firebase Auth 로그인 성공:", userCredential);

      // 이메일 인증 여부 확인
      if (!userCredential.user.emailVerified) {
        showError("이메일 인증 필요", "이메일 인증을 완료해주세요.");
        setLoading(false);
        return;
      }

      // Firestore에서 UUID 매핑 조회
      console.log("[Login] UID→UUID 매핑 조회 시도:", userCredential.user.uid);
      const uuidDoc = await getDoc(doc(db, "uid_map", userCredential.user.uid));
      if (uuidDoc.exists()) {
        const userUUID = uuidDoc.data().uuid;
        setUserUUID(userUUID);
        console.log("[Login] UUID context 저장:", userUUID);
      } else {
        console.log(
          "[Login] UID→UUID 매핑 문서 없음:",
          userCredential.user.uid
        );
      }

      setUser(userCredential.user);
      console.log("[Login] context user 저장 완료");

      // 대시보드로 이동
      navigate("/dashboard");
      console.log("[Login] navigate('/dashboard') 완료");
    } catch (error) {
      console.error(
        "[Login] 로그인 오류:",
        error,
        error.code,
        error.message,
        error.stack
      );
      let errorMessage = "로그인에 실패했습니다.";
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "존재하지 않는 이메일입니다.";
          break;
        case "auth/wrong-password":
          errorMessage = "잘못된 비밀번호입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/too-many-requests":
          errorMessage =
            "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
          break;
      }
      showError("로그인 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      // 구글 로그인 팝업 설정
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      console.log("구글 로그인 성공:", result);

      // 사용자 정보 확인
      if (result.user) {
        console.log("사용자 정보:", result.user);
        // 홈페이지로 리다이렉트
        window.location.href = "/";
      } else {
        console.error("사용자 정보가 없습니다.");
        showError("로그인 실패", "사용자 정보를 가져오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      let errorMessage = "구글 로그인에 실패했습니다.";

      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "로그인 팝업이 사용자에 의해 닫혔습니다.";
          break;
        case "auth/cancelled-popup-request":
          errorMessage = "로그인 팝업이 취소되었습니다.";
          break;
        case "auth/popup-blocked":
          errorMessage =
            "브라우저가 팝업을 차단했습니다. 팝업 차단을 해제해주세요.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "구글 로그인이 현재 비활성화되어 있습니다. 관리자에게 문의해주세요.";
          break;
      }

      showError("구글 로그인 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNaverLogin = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new OAuthProvider("naver.com");
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("네이버 로그인 오류:", error);
      showError("네이버 로그인 실패", "네이버 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new OAuthProvider("kakao.com");
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      showError("카카오 로그인 실패", "카카오 로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card text-card-foreground rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">로그인</h1>
            <p className="text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link
                to="/auth/register"
                className="text-primary hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

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
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                "로그인"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  또는 다음으로 로그인
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md border border-gray-300 bg-white text-black text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                구글로 로그인
              </button>
              <button
                onClick={handleNaverLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-[#03C75A] text-white text-sm font-medium hover:bg-[#02b350] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                네이버로 로그인
              </button>
              <button
                onClick={handleKakaoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-[#FEE500] text-black text-sm font-medium hover:bg-[#ffe14f] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                카카오로 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
