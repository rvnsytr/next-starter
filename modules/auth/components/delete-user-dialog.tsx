"use client";

import { User } from "@/core/auth";
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
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/shared/messages";
import { sharedSchemas } from "@/shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon, TriangleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { deleteUsers } from "../actions";
import { mutateListUsers } from "../hooks/use-list-users";

const FORM_ID = "delete-user-form";
const formActionId = "delete-user-action-form";

export function DeleteUserDialog({
  data,
  open,
  setOpen,
  setIsLoading,
  setData,
}: {
  data: Pick<User, "id" | "name">;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  const [input, setInput] = useState<string>("");

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: sharedSchemas.string({ label: "Name" }) })
    .refine((sc) => sc.input === data.name, {
      message: messages.thingNotMatch("Name"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const onSubmit = () => {
    setIsLoading(true);
    setOpen(false);

    toast.promise(deleteUsers({ userIds: [data.id] }), {
      loading: { title: messages.loading },
      success: () => {
        form.reset();
        setIsLoading(false);

        setData(null);
        mutateListUsers();

        return {
          title: messages.success,
          description: (
            <span>
              The account for <b>{data.name}</b> has been deleted.
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
          <DialogTitle className="text-destructive-foreground">
            <TriangleAlertIcon /> Delete account: {data.name}
          </DialogTitle>
          <DialogDescription>
            WARNING: This will permanently delete <b>{data.name}</b>'s account
            and all associated data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="input"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel className="text-muted-foreground font-normal">
                    <span>
                      To confirm, type &quot;<b>{data.name}</b>&quot; in the
                      field below.
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
          </Form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <Button
            type="submit"
            form={FORM_ID}
            variant="destructive"
            disabled={input !== data.name}
          >
            {messages.actions.delete}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

export function ActionDeleteUsersDialog({
  userIds,
  open,
  loading,
  setOpen,
  setIsLoading,
  onSuccess,
}: {
  userIds: string[];
  open: boolean;
  loading: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: () => void;
}) {
  const [input, setInput] = useState<string>("");
  const inputValue = `Delete ${String(userIds.length)} Users`;

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({
      input: sharedSchemas.string({ label: "Number of users to delete" }),
    })
    .refine((sc) => sc.input === inputValue, {
      message: messages.thingNotMatch("Number of users to delete"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const onSubmit = () => {
    setIsLoading(true);
    setOpen(false);

    toast.promise(deleteUsers({ userIds }), {
      loading: { title: messages.loading },
      success: (res) => {
        setIsLoading(false);
        onSuccess();
        return {
          title: messages.success,
          description: (
            <span>{res.length} user accounts have been deleted.</span>
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
          <DialogTitle className="text-destructive-foreground flex items-center gap-x-2">
            <TriangleAlertIcon /> Delete {userIds.length} Accounts
          </DialogTitle>
          <DialogDescription>
            WARNING: This will permanently delete{" "}
            <b>{userIds.length} selected accounts</b> and all associated data.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <Form id={formActionId} onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              name="input"
              control={form.control}
              render={({ field: { onChange, ...field }, fieldState }) => (
                <Field name={field.name} invalid={fieldState.invalid}>
                  <FieldLabel className="text-muted-foreground font-normal">
                    <span>
                      To confirm, type &quot;<b>{inputValue}</b>&quot; in the
                      field below.
                    </span>
                  </FieldLabel>
                  <Input
                    placeholder={inputValue}
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
          </Form>
        </DialogPanel>

        <DialogFooter>
          <DialogClose
            render={<Button variant="ghost">{messages.actions.cancel}</Button>}
          />
          <Button
            type="submit"
            form={formActionId}
            variant="destructive"
            disabled={input !== inputValue || loading}
          >
            <LoadingSpinner icon={{ base: <Trash2Icon /> }} loading={loading} />
            {messages.actions.delete}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
