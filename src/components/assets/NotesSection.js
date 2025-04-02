"use client";

const NotesSection = ({ notes, handleChange }) => {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="space-y-3">
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-foreground"
        >
          추가 정보
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          value={notes}
          onChange={handleChange}
          placeholder="자산에 대한 추가 정보나 특이사항을 입력하세요."
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
        <p className="text-xs text-muted-foreground">
          유지보수 이력, 특별 취급 사항, 사용 제한 등 자산에 대한 중요한 정보를
          기록하세요.
        </p>
      </div>
    </div>
  );
};

export default NotesSection;
