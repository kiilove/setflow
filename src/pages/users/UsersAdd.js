import PageContainer from "../../components/common/PageContainer";
import { getButtonVariantClass } from "../../utils/themeUtils";

const UsersAdd = () => {
  return (
    <PageContainer title="사용자 추가">
      <p className="text-muted-foreground mb-4">
        새로운 사용자를 추가하는 페이지입니다.
      </p>
      <div className="rounded-lg border border-border bg-card p-6 shadow-md">
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-muted-foreground"
            >
              사용자 이름
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-muted-foreground"
            >
              역할
            </label>
            <select
              id="role"
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option>사용자</option>
              <option>관리자</option>
              <option>편집자</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className={`inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium ${getButtonVariantClass(
                "primary"
              )}`}
            >
              사용자 추가
            </button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default UsersAdd;
