import { cn } from "@/core/utils/helpers";
import { ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldErrorProps,
  FieldLabel,
  FieldProps,
} from "./field";
import { LabelProps } from "./label";

/**
 * @note
 * Use this component as a **wrapper** for *basic, individual* form inputs (e.g., text fields, selects)
 * to maintain consistent spacing, accessibility, and error handling across the app.
 *
 * If you want to use field set with legend and description or customizing your fields structure —
 * refer to the full example implementation [here](@/modules/docs/components.client.tsx).
 *
 * Or check the official shadcn documentation on
 * [building forms](https://ui.shadcn.com/docs/forms/react-hook-form) for additional guidance.
 */

export function FieldWrapper({
  label,
  htmlFor,
  errors,
  description,

  className,
  children,

  otherProps,
}: {
  label?: ReactNode;
  htmlFor?: string;
  errors: Pick<FieldErrorProps, "errors">["errors"];
  description?: ReactNode;

  className?: string;
  children: ReactNode;

  // Other optional props
  otherProps?: {
    field?: Omit<FieldProps, "className" | "data-invalid">;
    label?: Omit<LabelProps, "htmlFor">;
    fieldDesc?: React.ComponentProps<"p">;
    fieldError?: Omit<FieldErrorProps, "errors">;
  };
}) {
  return (
    <Field
      className={cn(
        "has-required:*:data-[slot=field-label]:after:content-['*']",
        className,
      )}
      data-invalid={!!errors}
      {...otherProps?.field}
    >
      {label && (
        <FieldLabel
          htmlFor={htmlFor}
          className={cn("after:text-destructive", otherProps?.label?.className)}
        >
          {label}
        </FieldLabel>
      )}

      {children}

      {description && (
        <FieldDescription {...otherProps?.fieldDesc}>
          {description}
        </FieldDescription>
      )}

      <FieldError errors={errors} {...otherProps?.fieldError} />
    </Field>
  );
}
