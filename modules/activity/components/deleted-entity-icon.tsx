import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { Trash2Icon } from "lucide-react";

export function DeletedEntityIcon() {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Trash2Icon className="text-destructive-foreground" />}
      />
      <TooltipPopup>Entity telah dihapus</TooltipPopup>
    </Tooltip>
  );
}
