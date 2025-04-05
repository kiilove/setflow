import {
  termsOfServiceSections,
  privacyPolicySections,
} from "../../data/termsData";
import styles from "./terms.module.css";

const PrintableTerms = () => {
  return (
    <div
      className={`${styles.printOnly} ${styles.printDocument}`}
      style={{ display: "none" }}
    >
      <div className={styles.header}>
        <h1>SetFlow 이용약관 및 개인정보 처리방침</h1>
        <p>최종 업데이트: 2023년 1월 1일</p>
      </div>

      <h2>서비스 이용약관</h2>
      {termsOfServiceSections.map((section, index) => (
        <div key={`terms-${index}`} className={styles.section}>
          <h3>{section.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}

      <div className={styles.pageBreak}></div>

      <h2>개인정보 처리방침</h2>
      {privacyPolicySections.map((section, index) => (
        <div key={`privacy-${index}`} className={styles.section}>
          <h3>{section.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: section.content }} />
        </div>
      ))}

      <div className={styles.footer}>
        <p>© {new Date().getFullYear()} SetFlow. All rights reserved.</p>
        <p>
          본 문서는 SetFlow 서비스 이용을 위한 공식 약관 및 개인정보
          처리방침입니다.
        </p>
      </div>
    </div>
  );
};

export default PrintableTerms;
