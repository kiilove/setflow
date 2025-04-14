import InfoSection from "./InfoSection";
import { FaClipboardList } from "react-icons/fa";

const NotesInfo = ({ notes }) => {
  return (
    <InfoSection title="비고" icon={FaClipboardList}>
      {notes ? (
        <div className="bg-muted/30 p-4 rounded-md border border-border">
          <p className="text-foreground whitespace-pre-line">{notes}</p>
        </div>
      ) : (
        <div className="text-muted-foreground text-center py-4">
          비고 사항이 없습니다.
        </div>
      )}
    </InfoSection>
  );
};

export default NotesInfo;
