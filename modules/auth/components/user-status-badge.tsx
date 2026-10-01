import { CustomColorBadge } from "@/core/components/ui/badge";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { UserStatus } from "../constants/user-status";
import { USER_STATUS_META } from "../constants/user-status-meta";

export function UserStatusBadge({
  value,
  className,
}: {
  value: UserStatus;
  className?: string;
}) {
  const { label, description, icon: Icon, color } = USER_STATUS_META[value];

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <CustomColorBadge color={color} className={className}>
            <Icon /> {label}
          </CustomColorBadge>
        }
      />

      <TooltipPopup
      // style={{ "--tooltip-color": color } as React.CSSProperties}
      // className="bg-(--tooltip-color)"
      // arrowClassName="bg-(--tooltip-color) fill-(--tooltip-color)"
      >
        {description}
      </TooltipPopup>
    </Tooltip>
  );
}
