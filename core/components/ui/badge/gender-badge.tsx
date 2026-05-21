import { Gender, genderConfig } from "@/shared/config";
import { CustomColorBadge } from "./custom-color-badge";

export function GenderBadge({ value }: { value: Gender }) {
  const { displayName, icon: Icon, color } = genderConfig[value];
  return (
    <CustomColorBadge data-slot="gender-badge" color={color}>
      <Icon /> {displayName}
    </CustomColorBadge>
  );
}
