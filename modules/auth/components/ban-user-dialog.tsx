"use client";

import { User } from "@/core/auth";
import { DatePicker } from "@/core/components/date-picker";
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
} from "@/core/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { Textarea } from "@/core/components/ui/textarea";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/shared/messages";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds, endOfDay, isBefore } from "date-fns";
import { TriangleAlertIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { banUser } from "../actions";
import { mutateListUsers } from "../hooks/use-list-users";

type FormSchema = z.infer<typeof formSchema>;
const formSchema = z.object({
  banReason: sharedSchemas.string({ label: "Ban reason" }).optional(),
  banExpiresDate: sharedSchemas.date({ label: "Ban expiry date" }).optional(),
});

const FORM_ID = "ban-user-form";

export function BanUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
  setData,
}: {
  data: User;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { banReason: "" },
  });

  const onSubmit = (formData: FormSchema) => {
    const { banReason: rawBanReason, banExpiresDate } = formData;

    setIsLoading(true);
    setOpen(false);

    const banReason =
      rawBanReason && rawBanReason.length > 0 ? rawBanReason : undefined;
    const isValidDate = isBefore(new Date(), banExpiresDate ?? new Date());

    toast.promise(
      banUser({
        userId: data.id,
        banReason,
        banExpiresIn:
          isValidDate && banExpiresDate
            ? differenceInSeconds(endOfDay(banExpiresDate), new Date())
            : undefined,
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          form.reset();
          setIsLoading(false);

          setData({
            ...data,
            banned: true,
            banReason: banReason ?? "No reason",
            banExpires:
              isValidDate && banExpiresDate
                ? endOfDay(banExpiresDate)
                : undefined,
          });

          mutateListUsers();

          return {
            title: messages.success,
            description: (
              <span>
                The account for <b>{data.name}</b> has been banned.
              </span>
            ),
          };
        },
        error: (e) => {
          setIsLoading(false);
          setData(data);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle className="text-destructive-foreground">
            <TriangleAlertIcon /> Ban account: {data.name}
          </DialogTitle>
          <DialogDescription>
            WARNING: This will ban and deactivate <b>{data.name}</b>'s account.
            Proceed with caution.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="banReason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Ban reason</FieldLabel>
                  <Textarea
                    placeholder="Enter the reason for banning this account"
                    {...field}
                  />
                  <FieldError error={fieldState.error} />
                </Field>
              )}
            />

            <Controller
              name="banExpiresDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Ban expiry date</FieldLabel>
                  <DatePicker
                    id={field.name}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{ before: new Date() }}
                  />
                  <FieldDescription>
                    * Optional. Leave blank for a permanent ban.
                  </FieldDescription>
                  <FieldError error={fieldState.error} />
                </Field>
              )}
            />
          </Form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <Button type="submit" form={FORM_ID} variant="destructive" autoFocus>
            {messages.actions.confirm}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

// TODO: function ActionBanUserDialog() {}
