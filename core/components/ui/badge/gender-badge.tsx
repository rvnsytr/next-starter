import { Gender, genderMeta } from "@/core/constants/registries";
import { CustomColorBadge } from "./custom-color-badge";

export function GenderBadge({ value }: { value: Gender }) {
  const { displayName, icon: Icon, color } = genderMeta[value];
  return (
    <CustomColorBadge data-slot="gender-badge" color={color}>
      <Icon /> {displayName}
    </CustomColorBadge>
  );
}
