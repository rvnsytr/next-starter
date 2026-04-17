"use client";

import { authClient } from "@/core/auth-client";
import { Button } from "@/core/components/ui/button";
import { Checkbox } from "@/core/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Input } from "@/core/components/ui/input";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogInIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { passwordSchema, userSchema } from "../schema";

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
      (async () => {
        const res = await authClient.signIn.email({
          ...formData,
          callbackURL: "/dashboard",
        });

        if (res.error) throw res.error;
        return res;
      })(),
      {
        loading: messages.loading,
        success: (res) => ({
          type: "success",
          title: "Berhasil masuk!",
          description: `Selamat datang${res.data.user.name ? ` ${res.data.user.name}` : ""}!`,
        }),
        error: () => {
          return {
            title: "Something went wrong",
            description: "Please try again.",
          };
        },

        // error: (e) => {
        //   setIsLoading(false);
        //   return e.message;
        // },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Alamat email</FieldLabel>
            <Input
              type="email"
              placeholder="Masukan email anda"
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
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Kata sandi</FieldLabel>
            <Input
              type="email"
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

              <FieldError match={!!fieldState.error}>
                {fieldState.error?.message}
              </FieldError>
            </Field>
          )}
        />

        {/* <ResetPasswordDialog /> */}
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
    </form>
  );
}
