import { cn } from "@/utils";
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
 * refer to the full example implementation [here](../modules/example.tsx).
 *
 * Or check the official shadcn documentation on
 * [building forms](https://ui.shadcn.com/docs/forms/react-hook-form) for additional guidance.
 */

export function FieldWrapper({
  label,
  htmlFor,
  fieldError,
  description,
  children,
  props,
}: {
  label?: ReactNode;
  htmlFor?: string;
  fieldError: Pick<FieldErrorProps, "errors">["errors"];
  description?: ReactNode;
  children: ReactNode;

  // Other optional props
  props?: {
    field?: Omit<FieldProps, "data-invalid">;
    label?: Omit<LabelProps, "htmlFor">;
    fieldDesc?: React.ComponentProps<"p">;
    fieldError?: Omit<FieldErrorProps, "errors">;
  };
}) {
  return (
    <Field
      className={cn(
        "has-required:*:data-[slot=field-label]:after:content-['*']",
        props?.field?.className,
      )}
      data-invalid={!!fieldError}
      {...props?.field}
    >
      {label && (
        <FieldLabel
          htmlFor={htmlFor}
          className={cn("after:text-destructive", props?.label?.className)}
        >
          {label}
        </FieldLabel>
      )}

      {children}

      {description && (
        <FieldDescription {...props?.fieldDesc}>{description}</FieldDescription>
      )}

      <FieldError errors={fieldError} {...props?.fieldError} />
    </Field>
  );
}
