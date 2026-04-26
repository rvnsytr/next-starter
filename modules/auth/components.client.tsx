"use client";

import { authClient } from "@/core/auth.client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { ResetButton } from "@/core/components/ui/buttons";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { FieldWrapper } from "@/core/components/ui/field-wrapper";
import { Input } from "@/core/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { PasswordInput } from "@/core/components/ui/password-input";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { messages } from "@/core/constants/messages";
import { sharedSchemas } from "@/core/schema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MailIcon,
  MonitorOffIcon,
  SendIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { removeUsers, revokeUserSessions } from "./actions";
import { AuthSession } from "./config";
import { mutateListUsers } from "./hooks/use-session";
import { passwordSchema, userSchema } from "./schema.zod";

function ResetPasswordDialog() {
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
      async () => {
        const res = await authClient.requestPasswordReset({ email });
        if (res.error) throw res.error;
        return res;
      },
      {
        loading: messages.loading,
        success: () => {
          setIsLoading(false);
          form.reset();
          return "Tautan untuk mengatur ulang kata sandi telah dikirim ke email Anda.";
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger className="link shrink-0">
        <Label>Lupa kata sandi ?</Label>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <LockKeyholeOpenIcon /> Atur ulang kata sandi
          </DialogTitle>
          <DialogDescription>
            Masukan alamat email yang terdaftar pada akun Anda, dan kami akan
            mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Alamat email"
                htmlFor={field.name}
                errors={fieldState.error}
              >
                <InputGroup>
                  <InputGroupInput
                    type="email"
                    id={field.name}
                    aria-invalid={!!fieldState.error}
                    placeholder="Masukan email anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
              </FieldWrapper>
            )}
          />

          <DialogFooter showCloseButton>
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
        </form>
      </DialogContent>
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
      async () => {
        const res = await authClient.resetPassword({ token, newPassword });
        if (res.error) throw res.error;
        return res;
      },
      {
        loading: messages.loading,
        success: () => {
          router.push("/sign-in");
          return "Kata sandi berhasil diatur ulang. Silakan masuk kembali.";
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <CardContent className="flex flex-col gap-y-4">
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Kata sandi baru"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <PasswordInput
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan kata sandi anda"
                required
                withList
                {...field}
              />
            </FieldWrapper>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Konfirmasi kata sandi"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <PasswordInput
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Konfirmasi kata sandi anda"
                required
                {...field}
              />
            </FieldWrapper>
          )}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch justify-between gap-2 border-t md:flex-row">
        <Button variant="outline" asChild>
          <Link href="/sign-in">
            <ArrowLeftIcon /> {messages.actions.back}
          </Link>
        </Button>

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
    </form>
  );
}

// #region SESSIONS

function ActionRevokeUserSessionsDialog({
  userIds,
  onSuccess,
}: {
  userIds: string[];
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(revokeUserSessions(userIds), {
      loading: messages.loading,
      success: (res) => {
        onSuccess();
        const successLength = res.filter(({ success }) => success).length;
        return `${successLength} dari ${userIds.length} sesi pengguna berhasil diakhiri.`;
      },
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isLoading}>
          <LoadingSpinner
            loading={isLoading}
            icon={{ base: <MonitorOffIcon /> }}
          />
          Akhiri Sesi
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOffIcon /> Akhiri Sesi untuk {userIds.length} Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ini akan menghentikan semua sesi aktif dari{" "}
            <span>{userIds.length} pengguna</span> yang dipilih. Yakin ingin
            melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler} autoFocus>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// #endregion

// #region BAN & REMOVAL

function ActionRemoveUsersDialog({
  data,
  onSuccess,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "image">[];
  onSuccess: () => void;
}) {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputValue = `Hapus ${String(data.length)} Pengguna`;

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: sharedSchemas.string("Total pengguna yang dihapus") })
    .refine((sc) => sc.input === inputValue, {
      message: messages.thingNotMatch("Total pengguna yang dihapus"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const formHandler = () => {
    setIsLoading(true);
    toast.promise(removeUsers(data), {
      loading: messages.loading,
      success: (res) => {
        setIsLoading(false);
        setIsOpen(false);

        onSuccess();
        mutateListUsers();

        const successLength = res.filter(({ success }) => success).length;
        return `${successLength} dari ${data.length} akun pengguna berhasil dihapus.`;
      },
      error: (e) => {
        setIsLoading(false);
        return e.message;
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Trash2Icon /> }} />
          {messages.actions.delete}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlertIcon /> Hapus {data.length} Akun
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan menghapus{" "}
            <span>{data.length} akun</span> yang dipilih beserta seluruh datanya
            secara permanen. Harap berhati-hati karena aksi ini tidak dapat
            dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="input"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FieldWrapper
                label={messages.removeLabel(inputValue)}
                errors={fieldState.error}
                htmlFor={field.name}
              >
                <Input
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder={inputValue}
                  onChange={(e) => {
                    setInput(e.target.value);
                    onChange(e);
                  }}
                  required
                  {...field}
                />
              </FieldWrapper>
            )}
          />

          <DialogFooter showCloseButton>
            <Button
              type="submit"
              variant="destructive"
              disabled={input !== inputValue || isLoading}
            >
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <Trash2Icon /> }}
              />
              {messages.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// #endregion
