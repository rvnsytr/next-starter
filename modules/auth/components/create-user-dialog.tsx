"use client";

import { PasswordInput } from "@/core/components/password-input";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Kbd } from "@/core/components/ui/kbd";
import { Label } from "@/core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { mutateControlledData } from "@/core/hooks/use-data-controller";
import { useIsMobile } from "@/core/hooks/use-media-query";
import { messages } from "@/core/messages";
import { allRoles, defaultRole } from "@/shared/permission";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { MailIcon, UserRoundIcon, UserRoundPlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "../actions";
import { roleConfig } from "../config";
import { passwordSchema, userSchema } from "../schema";

const CREATE_USER_DIALOG_HOTKEY: Hotkey = "Alt+N";

export function CreateUserDialog() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useHotkey(CREATE_USER_DIALOG_HOTKEY, () => setIsOpen(true), {
    enabled: !isOpen,
  });

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true, role: true })
    .extend({
      newPassword: passwordSchema.shape.newPassword,
      confirmPassword: passwordSchema.shape.confirmPassword,
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
      role: defaultRole,
    },
  });

  const formHandler = ({ newPassword, role: newRole, ...rest }: FormSchema) => {
    setIsLoading(true);
    toast.promise(
      createUser({ password: newPassword, role: newRole, ...rest }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsLoading(false);
          form.reset();
          mutateControlledData("/auth/admin/list-users");
          return { title: `Akun atas nama ${rest.name} berhasil dibuat.` };
        },
        error: (e) => {
          setIsLoading(false);
          return { title: e.message };
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size={isMobile ? "icon" : "default"} variant="outline">
            <UserRoundPlusIcon />
            <span className="hidden lg:inline-flex">Tambah Pengguna</span>
            <Kbd className="hidden lg:inline-flex">
              {formatForDisplay(CREATE_USER_DIALOG_HOTKEY)}
            </Kbd>
          </Button>
        }
      />

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            <UserRoundPlusIcon /> Tambah Pengguna
          </DialogTitle>
          <DialogDescription>
            Pastikan semua informasi sudah benar sebelum mengkonfirmasi.
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={form.handleSubmit(formHandler)}>
          <DialogPanel>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Nama</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Masukan nama anda"
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
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Kata sandi baru</FieldLabel>
                  <PasswordInput
                    placeholder="Masukan kata sandi baru"
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

            <Controller
              name="role"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Role</FieldLabel>
                  <RadioGroup
                    onValueChange={onChange}
                    className="flex-row"
                    required
                    {...field}
                  >
                    {allRoles.map((role) => {
                      const { icon: Icon, ...config } = roleConfig[role];
                      return (
                        <Label key={role} className="w-full flex-col" asCard>
                          <RadioGroupItem value={role} hidden />
                          <div className="flex items-center gap-2">
                            <Icon /> {config.label}
                          </div>
                          <small className="text-muted-foreground font-normal">
                            {config.description}
                          </small>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                  <FieldError error={fieldState.error} />
                </Field>
              )}
            />
          </DialogPanel>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline">{messages.actions.cancel}</Button>
              }
            />
            <Button type="submit" disabled={isLoading}>
              <LoadingSpinner loading={isLoading} />
              {messages.actions.add}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
