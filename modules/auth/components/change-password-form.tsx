"use client";

import { authClient } from "@/core/auth-client";
import { PasswordInput } from "@/core/components/password-input";
import { Button, ResetButton } from "@/core/components/ui/button";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/shared/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyholeOpenIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "../schema";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = passwordSchema
  .pick({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  })
  .extend({ revokeOtherSessions: z.boolean() })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: messages.thingNotMatch("Passwords"),
    path: ["confirmPassword"],
  });

const FORM_ID = "change-password-form";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
  });

  const onSubmit = (formData: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      (async () => {
        const res = await authClient.changePassword(formData);
        if (res.error) throw res.error;
        return res.data;
      })(),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          form.reset();
          return { title: "Your password has been updated." };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <>
      <CardContent>
        <Form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>Current password</FieldLabel>
                <PasswordInput
                  startAddon={<LockKeyholeOpenIcon />}
                  placeholder="Enter your current password"
                  required
                  {...field}
                />
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>New password</FieldLabel>
                <PasswordInput
                  placeholder="Enter your new password"
                  withValidationList
                  required
                  {...field}
                />
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>Confirm password</FieldLabel>
                <PasswordInput
                  placeholder="Confirm your new password"
                  required
                  {...field}
                />
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />

          <Controller
            name="revokeOtherSessions"
            control={form.control}
            render={({ field: { value, onChange, ...field }, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    {...field}
                  />
                  Sign out of other devices
                </FieldLabel>
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />
        </Form>
      </CardContent>

      <CardFooter>
        <Button type="submit" form={FORM_ID} disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} />
          {messages.actions.update}
        </Button>
        <ResetButton onClick={() => form.reset()} />
      </CardFooter>
    </>
  );
}
