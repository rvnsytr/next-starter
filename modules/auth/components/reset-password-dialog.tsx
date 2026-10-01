"use client";

import { authClient } from "@/core/auth-client";
import { PasswordInput } from "@/core/components/password-input";
import { Button, ResetButton } from "@/core/components/ui/button";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/shared/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MailIcon,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema, usersSchema } from "../schema";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = usersSchema.pick({ email: true });

const FORM_ID = "reset-password-form";
const formDialogId = "reset-password-dialog-form";

export function ResetPasswordDialog() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = ({ email }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.requestPasswordReset({ email }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          form.reset();
          setIsLoading(false);
          return {
            title: messages.success,
            description: "A password reset link has been sent to your email.",
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
    <Dialog>
      <DialogTrigger className="link shrink-0">
        <Label>Forgot password?</Label>
      </DialogTrigger>

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            <LockKeyholeOpenIcon /> Reset password
          </DialogTitle>
          <DialogDescription>
            Enter the email address registered to your account and we'll send
            you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form id={formDialogId} onSubmit={form.handleSubmit(onSubmit)}>
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
          </Form>
        </DialogPanel>

        <DialogFooter>
          <ResetButton onClick={() => form.reset()} />
          <Button
            type="submit"
            form={formDialogId}
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            <LoadingSpinner loading={isLoading} icon={{ base: <SendIcon /> }} />
            Reset password
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

type FormDialogSchema = z.infer<typeof formDialogSchema>;
const formDialogSchema = passwordSchema
  .pick({ newPassword: true, confirmPassword: true })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: messages.thingNotMatch("Passwords"),
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<FormDialogSchema>({
    resolver: zodResolver(formDialogSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = ({ newPassword }: FormDialogSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.resetPassword({ token, newPassword }).then((res) => {
        if (res.error) throw res.error;
        return res.data;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          form.reset();
          setIsLoading(false);
          router.push("/sign-in");
          return {
            title: messages.success,
            description: "Your password has been reset. Please sign in again.",
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
    <>
      <CardContent>
        <Form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>New password</FieldLabel>
                <PasswordInput
                  placeholder="Enter your new password"
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
        </Form>
      </CardContent>

      <CardFooter className="flex-col items-stretch justify-between md:flex-row">
        <Button
          variant="outline"
          render={
            <Link href="/sign-in">
              <ArrowLeftIcon /> {messages.actions.back}
            </Link>
          }
        />

        <div className="flex flex-col gap-2 md:flex-row">
          <ResetButton onClick={() => form.reset()} />
          <Button type="submit" form={FORM_ID} disabled={isLoading}>
            <LoadingSpinner
              loading={isLoading}
              icon={{ base: <LockKeyholeIcon /> }}
            />
            {messages.actions.update}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
