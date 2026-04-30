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
import { messages } from "@/core/messages";
import { sharedSchemas } from "@/core/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInSeconds, endOfDay, isBefore } from "date-fns";
import { TriangleAlertIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { banUser } from "../actions";
import { useSession } from "../hooks/use-session";
import { mutateUserDataTable } from "./user-data-table";

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
  const { user } = useSession();

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z.object({
    banReason: sharedSchemas.string({ label: "Alasan diblokir" }).optional(),
    banExpiresDate: sharedSchemas
      .date({ label: "Tanggal blokir berakhir" })
      .optional(),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { banReason: "" },
  });

  const formHandler = (formData: FormSchema) => {
    const { banReason: rawBanReason, banExpiresDate } = formData;

    setIsLoading(true);
    setOpen(false);

    const banReason =
      rawBanReason && rawBanReason.length > 0 ? rawBanReason : undefined;
    const isValidDate = isBefore(new Date(), banExpiresDate ?? new Date());

    toast.promise(
      banUser(user.id, {
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
          mutateUserDataTable();
          return {
            title: messages.success,
            description: (
              <span>
                Akun <b>{data.name}</b> berhasil diblokir.
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
          <DialogTitle className="text-destructive">
            <TriangleAlertIcon /> Blokir akun atas nama {data.name}
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan memblokir and menonaktifkan akun{" "}
            <b>{data.name}</b>. Harap berhati-hati sebelum melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={form.handleSubmit(formHandler)}>
          <DialogPanel>
            <Controller
              name="banReason"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel>Alasan diblokir</FieldLabel>
                  <Textarea
                    placeholder="Masukan alasan pemblokiran akun ini"
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
                  <FieldLabel>Tanggal blokir berakhir</FieldLabel>
                  <DatePicker
                    id={field.name}
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={{ before: new Date() }}
                  />
                  <FieldDescription>
                    * Opsional, Kosongkan jika blokir berlaku tanpa batas waktu.
                  </FieldDescription>
                  <FieldError error={fieldState.error} />
                </Field>
              )}
            />
          </DialogPanel>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="ghost">{messages.actions.cancel}</Button>
              }
            />
            <Button type="submit" variant="destructive" autoFocus>
              {messages.actions.confirm}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}

// TODO: function ActionBanUserDialog() {}
