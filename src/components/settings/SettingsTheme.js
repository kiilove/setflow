"use client";

import { FaPalette } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const SettingsTheme = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
      <div className="p-4 border-b border-border theme-transition">
        <h3 className="text-lg font-medium text-foreground theme-transition flex items-center">
          <FaPalette className="mr-2 text-purple-500" />
          테마 설정
        </h3>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="themeLight"
              name="theme"
              checked={theme === "light"}
              onChange={() => theme !== "light" && toggleTheme()}
              className="h-4 w-4 text-primary border-border focus:ring-primary"
            />
            <label
              htmlFor="themeLight"
              className="ml-2 block text-sm text-foreground theme-transition"
            >
              라이트 모드
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="themeDark"
              name="theme"
              checked={theme === "dark"}
              onChange={() => theme !== "dark" && toggleTheme()}
              className="h-4 w-4 text-primary border-border focus:ring-primary"
            />
            <label
              htmlFor="themeDark"
              className="ml-2 block text-sm text-foreground theme-transition"
            >
              다크 모드
            </label>
          </div>
        </div>

        <div className="p-4 rounded-md bg-muted/50 theme-transition">
          <p className="text-sm text-foreground theme-transition">
            테마 설정은 즉시 적용되며 브라우저에 저장됩니다. 다음에 접속할 때도
            선택한 테마가 유지됩니다.
          </p>
        </div>

        {/* 테마 미리보기 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-md border ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h4
              className={`text-sm font-medium ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              라이트 모드 미리보기
            </h4>
            <p
              className={`text-xs mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              밝은 배경에 어두운 텍스트를 사용하는 테마입니다.
            </p>
          </div>
          <div
            className={`p-4 rounded-md border ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h4 className="text-sm font-medium text-white">
              다크 모드 미리보기
            </h4>
            <p className="text-xs mt-1 text-gray-400">
              어두운 배경에 밝은 텍스트를 사용하는 테마입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTheme;
