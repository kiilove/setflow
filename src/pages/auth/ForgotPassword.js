"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("유효한 이메일 형식이 아닙니다.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 실제 구현에서는 API 호출
      console.log("비밀번호 재설정 이메일 요청:", email);

      // 예시: 성공 시뮬레이션
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 1500);
    } catch (error) {
      console.error("비밀번호 재설정 요청 중 오류 발생:", error);
      setLoading(false);
      setError("요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center">
          <h1 className="text-2xl font-bold">비밀번호 찾기</h1>
          <p className="mt-2 text-muted-foreground">
            계정에 등록된 이메일로 비밀번호 재설정 링크를 보내드립니다
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="space-y-6">
            <div className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 p-4 rounded-md flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">이메일이 전송되었습니다!</p>
                <p className="mt-1 text-sm">
                  {email}로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인하고
                  링크를 클릭하여 비밀번호를 재설정하세요.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/auth/login"
                className={`inline-flex items-center px-4 py-2 rounded-md ${getButtonVariantClass(
                  "primary"
                )}`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full px-3 py-2 border rounded-md border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="name@company.com"
              />
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
                    <Send className="mr-2 h-4 w-4" />
                    재설정 링크 보내기
                  </>
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/auth/login"
                className="text-primary hover:text-primary/80 inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                로그인으로 돌아가기
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
