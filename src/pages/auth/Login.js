"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const { showError } = useMessageContext();
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
      showError("입력 오류", "이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (error) {
      console.error("로그인 오류:", error);
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
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      showError("구글 로그인 실패", "구글 로그인에 실패했습니다.");
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

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img src="/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                Google
              </button>
              <button
                onClick={handleNaverLogin}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img src="/naver.svg" alt="Naver" className="h-5 w-5 mr-2" />
                Naver
              </button>
              <button
                onClick={handleKakaoLogin}
                disabled={loading}
                className={`flex items-center justify-center py-2 px-4 rounded-md ${getButtonVariantClass(
                  "outline"
                )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img src="/kakao.svg" alt="Kakao" className="h-5 w-5 mr-2" />
                Kakao
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
