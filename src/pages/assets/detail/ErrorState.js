import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import PageContainer from "../../../components/common/PageContainer";
import { getButtonVariantClass } from "../../../utils/themeUtils";

const ErrorState = ({ error }) => {
  return (
    <PageContainer title="오류 발생">
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-full mb-4">
          <FaExclamationTriangle size={48} />
        </div>
        <h2 className="text-xl font-bold mb-2">
          자산 정보를 불러올 수 없습니다
        </h2>
        <p className="text-muted-foreground mb-6 text-center">{error}</p>
        <Link
          to="/assets"
          className={`${getButtonVariantClass(
            "outline"
          )} inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium`}
        >
          <FaArrowLeft className="mr-2 -ml-1 h-4 w-4" />
          자산 목록으로 돌아가기
        </Link>
      </div>
    </PageContainer>
  );
};

export default ErrorState;
