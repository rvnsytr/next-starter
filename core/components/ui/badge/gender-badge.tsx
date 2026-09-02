import { Gender, GENDER_META } from "@/shared/constants";
import { CustomColorBadge } from "./custom-color-badge";

export function GenderBadge({ value }: { value: Gender }) {
  const { label, icon: Icon, color } = GENDER_META[value];
  return (
    <CustomColorBadge data-slot="gender-badge" color={color}>
      <Icon /> {label}
    </CustomColorBadge>
  );
}
