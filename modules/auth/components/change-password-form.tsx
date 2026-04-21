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
import { messages } from "@/core/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyholeOpenIcon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "../schema";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = passwordSchema
    .pick({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    })
    .extend({ revokeOtherSessions: z.boolean() })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: messages.thingNotMatch("Kata sandi"),
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      (async () => {
        const res = await authClient.changePassword(formData);
        if (res.error) throw res.error;
        return res;
      })(),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          form.reset();
          return {
            type: "success",
            title: "Kata sandi Anda berhasil diperbarui.",
          };
        },
        error: (e) => {
          setIsLoading(false);
          return { type: "error", title: e.message };
        },
      },
    );
  };

  return (
    <Form onSubmit={form.handleSubmit(formHandler)}>
      <CardContent>
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Kata sandi saat ini</FieldLabel>

              <PasswordInput
                startAddon={<LockKeyholeOpenIcon />}
                placeholder="Masukan kata sandi saat ini"
                required
                {...field}
              />

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Kata sandi baru</FieldLabel>

              <PasswordInput
                placeholder="Masukan kata sandi baru"
                required
                {...field}
              />

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>Konfirmasi kata sandi</FieldLabel>

              <PasswordInput
                placeholder="Konfirmasi kata sandi baru anda"
                required
                {...field}
              />

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
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
                Keluar dari perangkat lainnya
              </FieldLabel>

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />
      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} />
          {messages.actions.update}
        </Button>
        <ResetButton onClick={() => form.reset()} />
      </CardFooter>
    </Form>
  );
}
