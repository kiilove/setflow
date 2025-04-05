"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { getButtonVariantClass } from "../../utils/themeUtils";
import {
  FileText,
  Shield,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Printer,
} from "lucide-react";
import {
  termsOfServiceSections,
  privacyPolicySections,
} from "../../data/termsData";
import styles from "./terms.module.css";
import PrintableTerms from "./PrintableTerms";

const Terms = () => {
  const [activeTab, setActiveTab] = useState("terms");
  const [expandedSections, setExpandedSections] = useState({
    terms: [0],
    privacy: [0],
  });

  const toggleSection = (tab, index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [tab]: prev[tab].includes(index)
        ? prev[tab].filter((i) => i !== index)
        : [...prev[tab], index],
    }));
  };

  const isExpanded = (tab, index) => {
    return expandedSections[tab].includes(index);
  };

  // 인쇄 기능
  const handlePrint = () => {
    // 인쇄 전에 모든 섹션을 확장
    const allTermsSections = Array.from(
      { length: termsOfServiceSections.length },
      (_, i) => i
    );
    const allPrivacySections = Array.from(
      { length: privacyPolicySections.length },
      (_, i) => i
    );

    setExpandedSections({
      terms: allTermsSections,
      privacy: allPrivacySections,
    });

    // 약간의 지연 후 인쇄 실행 (섹션이 확장될 시간을 줌)
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className={styles.termsContainer}>
      {/* 헤더 영역 - 고정 */}
      <div className={`p-6 border-b border-border ${styles.noPrint}`}>
        <div className="max-w-4xl mx-auto">
          <Link
            to="/auth/register"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            회원가입으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            이용약관 및 개인정보 처리방침
          </h1>
          <p className="text-muted-foreground mt-2">
            SetFlow 서비스 이용을 위한 약관 및 개인정보 처리방침입니다. 회원가입
            전에 반드시 읽어주세요.
          </p>
        </div>
      </div>

      {/* 탭 메뉴 - 고정 */}
      <div
        className={`bg-background border-b border-border sticky top-0 z-10 ${styles.noPrint}`}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex">
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === "terms"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("terms")}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                서비스 이용약관
              </div>
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeTab === "privacy"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                개인정보 처리방침
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div
        className={`flex-1 overflow-y-auto ${styles.termsContent}`}
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* 약관 내용 */}
          <div className="bg-card border border-border rounded-lg shadow-sm mb-8">
            {activeTab === "terms" && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">서비스 이용약관</h2>
                </div>

                <div className="text-sm text-muted-foreground mb-6">
                  최종 업데이트: 2023년 1월 1일
                </div>

                <div className="space-y-4">
                  {termsOfServiceSections.map((section, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-md overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center p-4 bg-muted/30 hover:bg-muted/50 text-left"
                        onClick={() => toggleSection("terms", index)}
                      >
                        <h3 className="font-medium">{section.title}</h3>
                        {isExpanded("terms", index) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>

                      {isExpanded("terms", index) && (
                        <div
                          className="p-4 text-muted-foreground text-sm"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">개인정보 처리방침</h2>
                </div>

                <div className="text-sm text-muted-foreground mb-6">
                  최종 업데이트: 2023년 1월 1일
                </div>

                <div className="space-y-4">
                  {privacyPolicySections.map((section, index) => (
                    <div
                      key={index}
                      className="border border-border rounded-md overflow-hidden"
                    >
                      <button
                        className="w-full flex justify-between items-center p-4 bg-muted/30 hover:bg-muted/50 text-left"
                        onClick={() => toggleSection("privacy", index)}
                      >
                        <h3 className="font-medium">{section.title}</h3>
                        {isExpanded("privacy", index) ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>

                      {isExpanded("privacy", index) && (
                        <div
                          className="p-4 text-muted-foreground text-sm"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 동의 버튼 */}
          <div className={`flex justify-center mb-4 ${styles.noPrint}`}>
            <Link
              to="/auth/register"
              className={`px-6 py-3 rounded-md ${getButtonVariantClass(
                "primary"
              )}`}
            >
              이용약관에 동의하고 회원가입 계속하기
            </Link>
          </div>

          {/* 인쇄 버튼 */}
          <div className={`text-center mb-12 ${styles.noPrint}`}>
            <button
              onClick={handlePrint}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <Printer className="mr-1 h-4 w-4" />
              이용약관 인쇄하기
            </button>
          </div>
        </div>
      </div>

      {/* 인쇄용 문서 - 화면에는 보이지 않고 인쇄할 때만 표시됨 */}
      <PrintableTerms />
    </div>
  );
};

export default Terms;
