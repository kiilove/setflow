export const EmptyState = ({
  title = "데이터가 없습니다",
  message = "새 항목을 추가하려면 추가 버튼을 클릭하세요.",
  icon = "fas fa-inbox",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <div className="text-gray-400 text-5xl mb-4">
        <i className={icon}></i>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
