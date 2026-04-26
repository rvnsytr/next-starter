"use client";

import { AuthSession } from "@/core/auth";
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
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/input";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { sharedSchemas } from "@/core/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { deleteUser } from "../actions";
import { mutateUserDataTable } from "./user-data-table";

export function DeleteUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
  setData,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "image">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<AuthSession["user"] | null>>;
}) {
  const [input, setInput] = useState<string>("");

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: sharedSchemas.string({ label: "Nama" }) })
    .refine((sc) => sc.input === data.name, {
      message: messages.thingNotMatch("Nama"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const formHandler = () => {
    setIsLoading(true);
    setOpen(false);

    toast.promise(deleteUser(data.id), {
      loading: { title: messages.loading },
      success: () => {
        form.reset();
        setIsLoading(false);
        setData(null);
        mutateUserDataTable();
        return {
          title: messages.success,
          description: (
            <span>
              Akun <b>{data.name}</b> berhasil dihapus.
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle className="text-destructive">
            <TriangleAlertIcon /> Hapus akun atas nama {data.name}
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan menghapus akun <b>{data.name}</b>{" "}
            beserta seluruh datanya secara permanen. Harap berhati-hati karena
            aksi ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <Form onSubmit={form.handleSubmit(formHandler)}>
          <DialogPanel>
            <Controller
              name="input"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel className="text-muted-foreground font-normal">
                    <span>
                      Untuk mengonfirmasi, ketik &quot;<b>{data.name}</b>&quot;
                      pada kolom di bawah ini.
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder={data.name}
                    onChange={(e) => {
                      setInput(e.target.value);
                      onChange(e);
                    }}
                    required
                    {...field}
                  />
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
            <Button
              type="submit"
              variant="destructive"
              disabled={input !== data.name}
            >
              {messages.actions.delete}
            </Button>
          </DialogFooter>
        </Form>
      </DialogPopup>
    </Dialog>
  );
}
