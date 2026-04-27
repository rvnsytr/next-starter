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
import { messages } from "@/core/messages";
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
import { passwordSchema, userSchema } from "../schema";

export function ResetPasswordDialog() {
  const [isLoading, setIsLoading] = useState(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema.pick({ email: true });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const formHandler = async ({ email }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.requestPasswordReset({ email }).then((res) => {
        if (res.error) throw res.error;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          form.reset();
          setIsLoading(false);
          return {
            title: messages.success,
            desc: "Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda.",
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
        <Label>Lupa kata sandi ?</Label>
      </DialogTrigger>

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            <LockKeyholeOpenIcon /> Atur ulang kata sandi
          </DialogTitle>
          <DialogDescription>
            Masukan alamat email yang terdaftar pada akun Anda, dan kami akan
            mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={form.handleSubmit(formHandler)}>
          <DialogPanel>
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
          </DialogPanel>

          <DialogFooter>
            <ResetButton onClick={() => form.reset()} />
            <Button
              type="submit"
              disabled={isLoading}
              onClick={form.handleSubmit(formHandler)}
            >
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <SendIcon /> }}
              />
              Atur ulang kata sandi
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = passwordSchema
    .pick({ newPassword: true, confirmPassword: true })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: messages.thingNotMatch("Kata sandi"),
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const formHandler = ({ newPassword }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      authClient.resetPassword({ token, newPassword }).then((res) => {
        if (res.error) throw res.error;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          form.reset();
          setIsLoading(false);
          router.push("/sign-in");
          return {
            title: messages.success,
            desc: "Kata sandi berhasil diatur ulang. Silakan masuk kembali.",
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
    <Form onSubmit={form.handleSubmit(formHandler)}>
      <CardContent>
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
              <FieldError error={fieldState.error} />
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
              <FieldError error={fieldState.error} />
            </Field>
          )}
        />
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
          <Button type="submit" disabled={isLoading}>
            <LoadingSpinner
              loading={isLoading}
              icon={{ base: <LockKeyholeIcon /> }}
            />
            {messages.actions.update}
          </Button>
        </div>
      </CardFooter>
    </Form>
  );
}
