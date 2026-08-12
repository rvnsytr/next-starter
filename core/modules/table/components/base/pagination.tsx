import { Button, ButtonProps } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";

export type PaginationProps = React.ComponentProps<typeof ButtonGroup> & {
  buttonsProps?: Pick<ButtonProps, "size" | "variant" | "disabled" | "onClick">;
};

type PaginationContext = {
  firstPageControl: {
    onClick: () => void;
    disabled: boolean;
  };
  previousPageControl: {
    onClick: () => void;
    disabled: boolean;
  };
  nextPageControl: {
    onClick: () => void;
    disabled: boolean;
  };
  lastPageControl: {
    onClick: () => void;
    disabled: boolean;
  };
};

export function Pagination({
  context,
  buttonsProps,
  ...props
}: PaginationProps & { context: PaginationContext }) {
  const {
    size = "icon",
    variant = "outline",
    disabled = false,
    onClick,
  } = buttonsProps ?? {};

  return (
    <ButtonGroup {...props}>
      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          context.firstPageControl.onClick();
          onClick?.(e);
        }}
        disabled={disabled || context.firstPageControl.disabled}
      >
        <ChevronsLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          context.previousPageControl.onClick();
          onClick?.(e);
        }}
        disabled={disabled || context.previousPageControl.disabled}
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          context.nextPageControl.onClick();
          onClick?.(e);
        }}
        disabled={disabled || context.nextPageControl.disabled}
      >
        <ChevronRightIcon />
      </Button>

      <Button
        size={size}
        variant={variant}
        onClick={(e) => {
          context.lastPageControl.onClick();
          onClick?.(e);
        }}
        disabled={disabled || context.lastPageControl.disabled}
      >
        <ChevronsRightIcon />
      </Button>
    </ButtonGroup>
  );
}
