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
import { appConfig } from "@/shared/configs";
import { messages } from "@/shared/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, UserRoundIcon, UserRoundPlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { passwordSchema, usersSchema } from "../schema";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = usersSchema
  .pick({ name: true, email: true })
  .extend({
    newPassword: passwordSchema.shape.newPassword,
    confirmPassword: passwordSchema.shape.confirmPassword,
    agreement: z.boolean().refine((v) => v, {
      error:
        "Please accept the Terms of Service and Privacy Policy to continue.",
    }),
  })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: messages.thingNotMatch("Passwords"),
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const onSubmit = ({ newPassword: password, ...rest }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.signUp.email({ password, ...rest }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          form.reset();
          return {
            title: "Account created successfully.",
            description: "Please sign in to continue.",
          };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <Form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>
            <InputGroup>
              <InputGroupInput
                placeholder="Enter your name"
                required
                {...field}
              />
              <InputGroupAddon>
                <UserRoundIcon />
              </InputGroupAddon>
            </InputGroup>
            <FieldError error={fieldState.error} />
          </Field>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Email address</FieldLabel>
            <InputGroup>
              <InputGroupInput
                type="email"
                placeholder="Enter your email"
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
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field name={field.name} invalid={fieldState.invalid}>
            <FieldLabel>Password</FieldLabel>

            <PasswordInput
              placeholder="Enter your password"
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
              placeholder="Confirm your password"
              required
              {...field}
            />
            <FieldError error={fieldState.error} />
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
              Accept the terms and conditions
            </FieldLabel>
            <FieldDescription>
              I agree to{" "}
              <span className="text-foreground">
                the Terms of Service and Privacy Policy
              </span>{" "}
              {appConfig.name}.
            </FieldDescription>
            <FieldError error={fieldState.error} />
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner
          loading={isLoading}
          icon={{ base: <UserRoundPlusIcon /> }}
        />
        Sign up now
      </Button>
    </Form>
  );
}
