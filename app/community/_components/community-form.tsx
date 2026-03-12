import Input from "@/app/components/input";
import TextArea from "@/app/components/textarea";

type CommunityFormProps = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function CommunityForm({
  title,
  content,
  onTitleChange,
  onContentChange,
}: CommunityFormProps) {
  return (
    <form className="flex flex-col gap-5">
      <Input
        label="제목"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />
      <TextArea
        label="내용"
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </form>
  );
}
