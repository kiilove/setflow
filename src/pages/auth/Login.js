"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (loginError) {
      setLoginError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // 가상의 계정 정보 생성
      const userAccount = {
        id: 1,
        email: formData.email,
        name: formData.email.split("@")[0], // 이메일에서 사용자 이름 추출
        role: "admin",
        token: "sample_jwt_token_" + Math.random().toString(36).substring(2),
        lastLogin: new Date().toISOString(),
      };

      // 로컬 스토리지에 인증 정보 저장
      localStorage.setItem("authUser", JSON.stringify(userAccount));

      // 로그인 성공 시뮬레이션
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard"); // 로그인 성공 시 대시보드로 이동
      }, 1000);
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      setLoading(false);
      setLoginError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="mt-2 text-muted-foreground">
            계정에 로그인하여 시작하세요
          </p>
        </div>

        {loginError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{loginError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <Mail className="mr-1 text-primary h-4 w-4" />
                  이메일
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.email ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="name@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                <span className="flex items-center">
                  <Lock className="mr-1 text-primary h-4 w-4" />
                  비밀번호
                </span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-foreground"
                >
                  로그인 상태 유지
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-primary hover:text-primary/80">
                  비밀번호 찾기
                </a>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                "primary"
              )}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  로그인 중...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            테스트 계정: admin@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
