"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMessageContext } from "../../context/MessageContext";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
} from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useMessageContext();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showError("입력 오류", "모든 필드를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showError("입력 오류", "비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      showSuccess("회원가입 성공", "회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원가입 오류:", error);
      let errorMessage = "회원가입에 실패했습니다.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "이미 사용 중인 이메일입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "유효하지 않은 이메일 형식입니다.";
          break;
        case "auth/weak-password":
          errorMessage = "비밀번호가 너무 약합니다.";
          break;
      }
      showError("회원가입 실패", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showSuccess("회원가입 성공", "구글 계정으로 회원가입이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("구글 회원가입 오류:", error);
      showError("구글 회원가입 실패", "구글 계정으로 회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleNaverRegister = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new OAuthProvider("naver.com");
      provider.setCustomParameters({
        prompt: "select_account",
      });
      await signInWithPopup(auth, provider);
      showSuccess(
        "회원가입 성공",
        "네이버 계정으로 회원가입이 완료되었습니다."
      );
      navigate("/");
    } catch (error) {
      console.error("네이버 회원가입 오류:", error);
      showError(
        "네이버 회원가입 실패",
        "네이버 계정으로 회원가입에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoRegister = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const provider = new OAuthProvider("kakao.com");
      provider.setCustomParameters({
        prompt: "select_account",
      });
      await signInWithPopup(auth, provider);
      showSuccess(
        "회원가입 성공",
        "카카오 계정으로 회원가입이 완료되었습니다."
      );
      navigate("/");
    } catch (error) {
      console.error("카카오 회원가입 오류:", error);
      showError(
        "카카오 회원가입 실패",
        "카카오 계정으로 회원가입에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleEmailRegister} className="space-y-4">
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
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

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
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="비밀번호를 다시 입력하세요"
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
                "회원가입"
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
                  또는 다음으로 회원가입
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={handleGoogleRegister}
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
                onClick={handleNaverRegister}
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
                onClick={handleKakaoRegister}
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
