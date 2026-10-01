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
import { useIsMobile } from "@/core/hooks/use-media-query";
import { messages } from "@/shared/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatForDisplay, Hotkey, useHotkey } from "@tanstack/react-hotkeys";
import { MailIcon, UserRoundIcon, UserRoundPlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createUser } from "../actions";
import { ROLE_META } from "../constants/role-meta";
import { DEFAULT_ROLE, ROLES } from "../constants/roles";
import { mutateListUsers } from "../hooks/use-list-users";
import { passwordSchema, usersSchema } from "../schema";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = usersSchema
  .pick({ name: true, email: true, role: true })
  .extend({
    newPassword: passwordSchema.shape.newPassword,
    confirmPassword: passwordSchema.shape.confirmPassword,
  })
  .refine((sc) => sc.newPassword === sc.confirmPassword, {
    message: messages.thingNotMatch("Passwords"),
    path: ["confirmPassword"],
  });

const CREATE_USER_DIALOG_HOTKEY: Hotkey = "N";
const FORM_ID = "create-user-form";

export function CreateUserDialog() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useHotkey(CREATE_USER_DIALOG_HOTKEY, () => setIsOpen(true));

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
      role: DEFAULT_ROLE,
    },
  });

  const onSubmit = ({ newPassword, ...rest }: FormSchema) => {
    setIsLoading(true);
    toast.promise(createUser({ password: newPassword, ...rest }), {
      loading: { title: messages.loading },
      success: () => {
        setIsLoading(false);
        form.reset();

        mutateListUsers();

        return {
          title: messages.success,
          description: (
            <span>
              The account for <b>{rest.name}</b> has been created.
            </span>
          ),
        };
      },
      error: (e) => {
        setIsLoading(false);
        return { title: messages.error, description: e.message };
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size={isMobile ? "icon" : "default"} variant="outline">
            <UserRoundPlusIcon />
            <span className="hidden lg:inline-flex">Add user</span>
            <Kbd className="hidden lg:inline-flex">
              {formatForDisplay(CREATE_USER_DIALOG_HOTKEY)}
            </Kbd>
          </Button>
        }
      />

      <DialogPopup>
        <DialogHeader>
          <DialogTitle>
            <UserRoundPlusIcon /> Add user
          </DialogTitle>
          <DialogDescription>
            Make sure all information is correct before confirming.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Enter the user's name"
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
                      placeholder="Enter the user's email"
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
                  <FieldLabel>New password</FieldLabel>
                  <PasswordInput
                    placeholder="Enter a new password"
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
                    placeholder="Confirm the new password"
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
                    {ROLES.map((role) => {
                      const { icon: Icon, ...config } = ROLE_META[role];
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
          </Form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline">{messages.actions.cancel}</Button>
            }
          />
          <Button type="submit" form={FORM_ID} disabled={isLoading}>
            <LoadingSpinner loading={isLoading} />
            {messages.actions.add}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
