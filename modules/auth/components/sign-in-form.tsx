"use client";

import { authClient } from "@/core/auth-client";
import { PasswordInput } from "@/core/components/password-input";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { passwordSchema, userSchema } from "../schema";
import { ResetPasswordDialog } from "./reset-password";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema.pick({ email: true }).extend({
    password: passwordSchema.shape.password,
    rememberMe: z.boolean(),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.signIn
        .email({ ...formData, callbackURL: "/dashboard" })
        .then((res) => {
          if (res.error) throw res.error;
          return res.data;
        }),
      {
        loading: { title: messages.loading },
        success: (res) => ({
          title: "Berhasil masuk!",
          description: res.user.name ? (
            <span>
              Selamat datang <b>{res.user.name}</b>!
            </span>
          ) : (
            "Selamat datang!"
          ),
        }),
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <Form onSubmit={form.handleSubmit(formHandler)}>
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
            <FieldError error={fieldState.error} />
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Kata sandi</FieldLabel>
            <PasswordInput
              placeholder="Masukan kata sandi anda"
              required
              {...field}
            />
            <FieldError error={fieldState.error} />
          </Field>
        )}
      />

      <div className="flex items-center justify-between gap-x-2">
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field: { value, onChange, ...field }, fieldState }) => (
            <Field name={field.name} invalid={fieldState.invalid}>
              <FieldLabel>
                <Checkbox
                  checked={value}
                  onCheckedChange={onChange}
                  {...field}
                />
                Ingat saya
              </FieldLabel>
              <FieldError error={fieldState.error} />
            </Field>
          )}
        />

        <ResetPasswordDialog />
      </div>

      <Button type="submit" className="relative" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <LogInIcon /> }} />
        Masuk ke Dashboard
        {/* {wasLastUsed && (
          <Badge className="bg-primary absolute -top-3 right-1 border border-transparent shadow">
            {sharedText.lastUsed}
          </Badge>
        )} */}
      </Button>
    </Form>
  );
}
