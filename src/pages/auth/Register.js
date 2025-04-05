"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  User,
  Mail,
  Lock,
  Building,
  UserPlus,
  AlertCircle,
  Check,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (registerError) {
      setRegisterError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "유효한 이메일 형식이 아닙니다.";
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!formData.department.trim()) {
      newErrors.department = "부서를 입력해주세요.";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "이용약관에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // 실제 구현에서는 API 호출
      console.log("회원가입 시도:", formData);

      // 예시: 회원가입 성공 시뮬레이션
      setTimeout(() => {
        setLoading(false);
        // 회원가입 성공 후 로그인 페이지로 이동
        navigate("/auth/login", {
          state: { message: "회원가입이 완료되었습니다. 로그인해주세요." },
        });
      }, 1500);
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      setLoading(false);
      setRegisterError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 비밀번호 강도 체크
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = [
      { text: "매우 약함", color: "bg-red-500" },
      { text: "약함", color: "bg-orange-500" },
      { text: "보통", color: "bg-yellow-500" },
      { text: "강함", color: "bg-green-500" },
      { text: "매우 강함", color: "bg-emerald-500" },
    ];

    return {
      strength,
      text: strengthMap[strength].text,
      color: strengthMap[strength].color,
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="mt-2 text-muted-foreground">
            새 계정을 만들어 시작하세요
          </p>
        </div>

        {registerError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{registerError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                <span className="flex items-center">
                  <User className="mr-1 text-primary h-4 w-4" />
                  이름
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="홍길동"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

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
                htmlFor="department"
                className="block text-sm font-medium mb-1"
              >
                <span className="flex items-center">
                  <Building className="mr-1 text-primary h-4 w-4" />
                  부서
                </span>
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.department ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="개발팀"
              />
              {errors.department && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.department}
                </p>
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

              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-muted-foreground">
                      비밀번호 강도: {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color}`}
                      style={{
                        width: `${(passwordStrength.strength + 1) * 20}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-1"
              >
                <span className="flex items-center">
                  <Lock className="mr-1 text-primary h-4 w-4" />
                  비밀번호 확인
                </span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.confirmPassword ? "border-destructive" : "border-input"
                } bg-background focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
              {formData.password &&
                formData.confirmPassword &&
                formData.password === formData.confirmPassword && (
                  <p className="mt-1 text-sm text-green-500 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> 비밀번호가 일치합니다
                  </p>
                )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="agreeTerms"
                className="ml-2 block text-sm text-foreground"
              >
                <span>
                  이용약관 및{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:text-primary/80"
                  >
                    개인정보 처리방침
                  </Link>
                  에 동의합니다
                </span>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-sm text-destructive">
                {errors.agreeTerms}
              </p>
            )}
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
                  처리 중...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  회원가입
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary/80 font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
