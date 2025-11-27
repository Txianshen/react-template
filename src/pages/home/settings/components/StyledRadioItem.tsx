import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface StyledRadioItemProps {
  value: string;
  id: string;
  label: string;
  isSelected: boolean;
  className?: string;
}

export default function StyledRadioItem({
  value,
  id,
  label,
  isSelected,
  className,
}: StyledRadioItemProps) {
  return (
    <div
      className={`flex items-center space-x-2 border border-[#3f3f46] rounded-lg p-2 transition-colors ${
        isSelected ? "bg-[#059669]" : "bg-[#3f3f46]"
      } ${className || ""}`}
    >
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
