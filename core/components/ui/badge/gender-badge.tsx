import { Gender, genders } from "@/shared/constants";
import { CustomColorBadge } from "./custom-color-badge";

export function GenderBadge({ value }: { value: Gender }) {
  const { label, icon: Icon, color } = genders.meta[value];
  return (
    <CustomColorBadge data-slot="gender-badge" color={color}>
      <Icon /> {label}
    </CustomColorBadge>
  );
}
