const SettingsSystem = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md border border-border theme-transition">
      <div className="p-4 border-b border-border theme-transition">
        <h3 className="text-lg font-medium text-foreground theme-transition">
          시스템 정보
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              버전
            </p>
            <p className="text-sm text-foreground theme-transition">
              Setflow v1.0.0
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              마지막 업데이트
            </p>
            <p className="text-sm text-foreground theme-transition">
              2023년 12월 15일
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              데이터베이스 상태
            </p>
            <p className="text-sm text-green-500">정상</p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              마지막 백업
            </p>
            <p className="text-sm text-foreground theme-transition">
              2023년 12월 10일 03:00
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-md bg-blue-500/10 border border-blue-500/20 theme-transition">
          <p className="text-sm text-foreground theme-transition">
            <span className="font-medium">참고:</span> 시스템 업데이트는 매월
            15일에 자동으로 진행됩니다. 업데이트 전에 데이터 백업을 권장합니다.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              서버 상태
            </p>
            <div className="flex items-center mt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm text-foreground theme-transition">온라인</p>
            </div>
          </div>
          <div className="p-3 rounded-md bg-muted/50 theme-transition">
            <p className="text-sm font-medium text-muted-foreground theme-transition">
              메모리 사용량
            </p>
            <div className="w-full bg-muted rounded-full h-2.5 mt-2 theme-transition">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 theme-transition">
              45%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSystem;
