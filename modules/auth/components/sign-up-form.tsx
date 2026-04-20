"use client";

import { authClient } from "@/core/auth-client";
import { PasswordInput } from "@/core/components/password-input";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { appConfig } from "@/shared/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserRoundIcon, UserRoundPlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { passwordSchema, userSchema } from "../schema";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true })
    .extend({
      newPassword: passwordSchema.shape.newPassword,
      confirmPassword: passwordSchema.shape.confirmPassword,
      agreement: z.boolean().refine((v) => v, {
        error:
          "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
      }),
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: messages.thingNotMatch("Kata sandi"),
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      agreement: false,
    },
  });

  const formHandler = ({ newPassword: password, ...rest }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      (async () => {
        const res = await authClient.signUp.email({ password, ...rest });
        console.log(res);
        if (res.error) throw res.error;
        return res;
      })(),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          form.reset();
          return {
            title: "Berhasil mendaftarkan Akun.",
            description: "Silakan masuk untuk melanjutkan.",
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
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Nama</FieldLabel>

            <InputGroup>
              <InputGroupInput
                type="text"
                placeholder="Masukan nama anda"
                required
                {...field}
              />

              <InputGroupAddon>
                <UserRoundIcon />
              </InputGroupAddon>
            </InputGroup>

            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Alamat email</FieldLabel>

            <InputGroup>
              <InputGroupInput
                type="email"
                placeholder="Masukan email anda"
                required
                {...field}
              />

              <InputGroupAddon>
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>

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
            <FieldLabel>Kata sandi</FieldLabel>

            <PasswordInput
              placeholder="Masukan kata sandi anda"
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
            <FieldLabel>Konfirmasi Kata sandi</FieldLabel>

            <PasswordInput
              placeholder="Konfirmasi kata sandi anda"
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
        name="agreement"
        control={form.control}
        render={({ field: { value, onChange, ...field }, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>
              <Checkbox checked={value} onCheckedChange={onChange} {...field} />
              Setujui syarat dan ketentuan
            </FieldLabel>

            <FieldDescription>
              Saya menyetujui{" "}
              <span className="text-foreground">
                ketentuan layanan dan kebijakan privasi
              </span>{" "}
              {appConfig.name}.
            </FieldDescription>

            <FieldError match={!!fieldState.error}>
              {fieldState.error?.message}
            </FieldError>
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner
          loading={isLoading}
          icon={{ base: <UserRoundPlusIcon /> }}
        />
        Daftar Sekarang
      </Button>
    </Form>
  );
}
