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
import { Badge } from "@/core/components/ui/badge";
import { Button, buttonVariants } from "@/core/components/ui/button";
import { ResetButton } from "@/core/components/ui/buttons";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import {
  ColumnCellCheckbox,
  ColumnCellNumber,
  ColumnHeader,
  ColumnHeaderCheckbox,
} from "@/core/components/ui/column";
import { DataTable } from "@/core/components/ui/data-table";
import { DatePicker } from "@/core/components/ui/date-picker";
import { DetailList, DetailListData } from "@/core/components/ui/detail-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { ErrorFallback, LoadingFallback } from "@/core/components/ui/fallback";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/core/components/ui/field";
import { FieldWrapper } from "@/core/components/ui/field-wrapper";
import { GithubIcon } from "@/core/components/ui/icons";
import { Input } from "@/core/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { PasswordInput } from "@/core/components/ui/password-input";
import { Ping } from "@/core/components/ui/ping";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Separator } from "@/core/components/ui/separator";
import { SheetDescription, SheetTitle } from "@/core/components/ui/sheet";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/core/components/ui/sidebar";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Textarea } from "@/core/components/ui/textarea";
import { appMeta, fileMeta, messages } from "@/core/constants";
import { sharedSchemas, userSchema } from "@/core/schema.zod";
import { getFilePublicUrl, removeFiles } from "@/core/storage";
import { cn, filterFn, formatDate } from "@/core/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { endOfDay } from "date-fns";
import {
  ArrowUpRightIcon,
  BanIcon,
  CalendarCheck2Icon,
  CalendarSyncIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  CircleDotIcon,
  CookieIcon,
  EllipsisIcon,
  Gamepad2Icon,
  InfoIcon,
  Layers2Icon,
  LockKeyholeOpenIcon,
  LogInIcon,
  LogOutIcon,
  MailIcon,
  MonitorIcon,
  MonitorOffIcon,
  MonitorSmartphoneIcon,
  SaveIcon,
  Settings2Icon,
  ShieldBanIcon,
  ShieldUserIcon,
  SmartphoneIcon,
  TabletIcon,
  Trash2Icon,
  TriangleAlertIcon,
  TvMinimalIcon,
  UserRoundIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UAParser, UAParserProps } from "ua-parser-js";
import { z } from "zod";
import { listUsers, removeUsers, revokeUserSessions } from "./actions";
import {
  UserAvatar,
  UserRoleBadge,
  UserStatusBadge,
  UserVerifiedBadge,
} from "./components";
import {
  allRoles,
  AuthSession,
  defaultRole,
  Role,
  rolesMeta,
  UserStatus,
  userStatusMeta,
} from "./constants";
import {
  mutateListSessions,
  mutateListUsers,
  mutateListUserSessions,
  mutateSession,
  useListSessions,
  useListUserSessions,
} from "./hooks";
import { useAuth } from "./provider.auth";

const sharedText = {
  signIn: (name?: string) =>
    `Berhasil masuk - Selamat datang${name ? ` ${name}` : ""}!`,
  signOn: (social: string) => `Lanjutkan dengan ${social}`,
  // lastUsed: "Terakhir digunakan",

  passwordNotMatch: messages.thingNotMatch("Kata sandi Anda"),
};

// #region SIGN

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const wasLastUsed = authClient.isLastUsedLoginMethod("email");

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ email: true, password: true })
    .extend({ rememberMe: z.boolean() });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = (formData: FormSchema) => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.signIn.email({
          ...formData,
          callbackURL: "/dashboard",
        });

        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: (res) => sharedText.signIn(res.data?.user.name),
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
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

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Kata sandi"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <PasswordInput
              id={field.name}
              aria-invalid={!!fieldState.error}
              placeholder="Masukan kata sandi anda"
              required
              {...field}
            />
          </FieldWrapper>
        )}
      />

      <Controller
        name="rememberMe"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={!!fieldState.error}>
            <Checkbox
              id={field.name}
              name={field.name}
              aria-invalid={!!fieldState.error}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label htmlFor={field.name}>Ingat Saya</Label>
          </Field>
        )}
      />

      <Button type="submit" className="relative" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <LogInIcon /> }} />
        Masuk ke Dashboard
        {/* {wasLastUsed && (
          <Badge className="bg-primary absolute -top-3 right-1 border border-transparent shadow">
            {sharedText.lastUsed}
          </Badge>
        )} */}
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true, newPassword: true, confirmPassword: true })
    .extend({
      agreement: z.boolean().refine((v) => v, {
        error:
          "Mohon setujui ketentuan layanan dan kebijakan privasi untuk melanjutkan.",
      }),
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formHandler = ({ newPassword: password, ...rest }: FormSchema) => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.signUp.email({ password, ...rest });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          form.reset();
          return "Akun berhasil dibuat. Silakan masuk untuk melanjutkan.";
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
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Nama"
            htmlFor={field.name}
            errors={fieldState.error}
          >
            <InputGroup>
              <InputGroupInput
                type="text"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan nama anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <UserRoundIcon />
              </InputGroupAddon>
            </InputGroup>
          </FieldWrapper>
        )}
      />

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

      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldWrapper
            label="Kata sandi"
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

      <Controller
        name="agreement"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={!!fieldState.error}>
            <Checkbox
              id={field.name}
              name={field.name}
              aria-invalid={!!fieldState.error}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                Setujui syarat dan ketentuan
              </FieldLabel>
              <FieldDescription>
                Saya menyetujui{" "}
                <span className="text-foreground">
                  ketentuan layanan dan kebijakan privasi
                </span>{" "}
                {appMeta.name}.
              </FieldDescription>
              <FieldError errors={fieldState.error} />
            </FieldContent>
          </Field>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner
          loading={isLoading}
          icon={{ base: <UserRoundPlusIcon /> }}
        />{" "}
        Daftar Sekarang
      </Button>
    </form>
  );
}

export function SignOnGithubButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const wasLastUsed = authClient.isLastUsedLoginMethod("github");

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.signIn.social({
          provider: "github",
          callbackURL: "/dashboard",
          errorCallbackURL: "/sign-in",
        });

        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: (res) => {
          const { data } = res;
          if (!data) return sharedText.signIn();
          const name = "user" in data ? data.user?.name : undefined;
          return sharedText.signIn(name);
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      className="relative"
      onClick={clickHandler}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <GithubIcon /> }} />
      {sharedText.signOn("Github")}
      {/* {wasLastUsed && (
        <Badge
          variant="outline"
          className="bg-card absolute -top-3 right-1 shadow"
        >
          {sharedText.lastUsed}
        </Badge>
      )} */}
    </Button>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.signOut();
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          router.push("/sign-in");
          return "Berhasil keluar - Sampai jumpa!";
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="outline_destructive"
      disabled={isLoading}
      onClick={clickHandler}
    >
      {/* {variant} */}
      <LoadingSpinner
        loading={isLoading}
        icon={{ base: <LogOutIcon /> }}
      />{" "}
      Keluar
    </SidebarMenuButton>
  );
}

// #endregion

// #region PROFILE

export function ProfileBadges() {
  const { user } = useAuth();
  return (
    <>
      <UserRoleBadge value={user.role} />
      {user.emailVerified && <UserVerifiedBadge />}
    </>
  );
}

export function ProfilePicture({
  data,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "image">;
}) {
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  const formSchema = sharedSchemas.files("image");

  const changeHandler = (fileList: FileList) => {
    toast.promise(
      async () => {
        setIsChange(true);
        const files = Array.from(fileList).map((f) => f);

        const parseRes = formSchema.safeParse(files);
        if (!parseRes.success) return toast.error(parseRes.error.message);

        const file = files[0];
        const key = `${data.id}_${file.name}`;
        const url = await getFilePublicUrl(key);

        // await uploadFiles({ files: [{ key, file }], ACL: "public-read" });
        const res = await authClient.updateUser({ image: url });

        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsChange(false);
          mutateSession();
          return "Foto profil Anda berhasil diperbarui.";
        },
        error: (e) => {
          setIsChange(false);
          return e.message;
        },
      },
    );
  };

  const deleteHandler = () => {
    toast.promise(
      async () => {
        setIsRemoved(true);
        const res = await authClient.updateUser({ image: null });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsRemoved(false);
          mutateSession();
          return "Foto profil Anda berhasil dihapus.";
        },
        error: (e) => {
          setIsRemoved(false);
          return e.message;
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <UserAvatar data={data} className="size-24" />

      <input
        type="file"
        ref={inputAvatarRef}
        accept={fileMeta.image.mimeTypes.join(", ")}
        className="hidden"
        onChange={(e) => {
          const fileList = e.currentTarget.files;
          if (fileList) changeHandler(fileList);
        }}
      />

      <div className="space-y-2">
        <Label>Foto profil</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isChange || isRemoved}
            onClick={() => inputAvatarRef.current?.click()}
          >
            <LoadingSpinner loading={isChange} /> {messages.actions.upload} foto
            profil
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline_destructive"
                disabled={!data.image || isChange || isRemoved}
              >
                <LoadingSpinner loading={isRemoved} /> {messages.actions.remove}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Foto Profil</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah kamu yakin ingin menghapus foto profil ini? Tindakan
                  ini dapat dibatalkan dengan mengunggah foto baru.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => deleteHandler()}
                >
                  {messages.actions.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useAuth();

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema.pick({ name: true, email: true });
  const defaultValues = user;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formHandler = ({ name: newName }: FormSchema) => {
    if (newName === user.name)
      return toast.info(messages.noChanges("profil Anda"));

    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.updateUser({ name: newName });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateSession();
          return "Profil Anda berhasil diperbarui.";
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
        <ProfilePicture data={user} />

        <div className="grid gap-x-2 gap-y-4 lg:grid-cols-2">
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
                    readOnly
                    {...field}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
              </FieldWrapper>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Nama"
                htmlFor={field.name}
                errors={fieldState.error}
              >
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    id={field.name}
                    aria-invalid={!!fieldState.error}
                    placeholder="Masukan nama anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <UserRoundIcon />
                  </InputGroupAddon>
                </InputGroup>
              </FieldWrapper>
            )}
          />
        </div>
      </CardContent>

      <CardFooter className="flex-col items-stretch border-t md:flex-row">
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} />
          {messages.actions.update}
        </Button>

        <ResetButton onClick={() => form.reset(defaultValues)} />
      </CardFooter>
    </form>
  );
}

// #endregion

// #region USER

const createUserColumn = createColumnHelper<AuthSession["user"]>();
const getUserColumn = (currentUserId: string) => [
  createUserColumn.display({
    id: "select",
    header: ({ table }) => <ColumnHeaderCheckbox table={table} />,
    cell: ({ row }) => <ColumnCellCheckbox row={row} />,
    enableHiding: false,
    enableSorting: false,
  }),
  createUserColumn.display({
    id: "no",
    header: "No",
    cell: ({ table, row }) => <ColumnCellNumber table={table} row={row} />,
    enableHiding: false,
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: "name",
    header: ({ column }) => <ColumnHeader column={column}>Nama</ColumnHeader>,
    cell: ({ row }) => (
      <UserDetailDialog
        data={row.original}
        isCurrentUser={row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Nama", type: "text", icon: UserRoundIcon },
  }),
  createUserColumn.accessor(({ email }) => email, {
    id: "email",
    header: ({ column }) => (
      <ColumnHeader column={column}>Alamat Email</ColumnHeader>
    ),
    cell: ({ row, cell }) => {
      return (
        <div className="flex items-center gap-x-2">
          <span>{cell.getValue()}</span>
          {row.original.emailVerified && <UserVerifiedBadge withoutText />}
        </div>
      );
    },
    filterFn: filterFn("text"),
    meta: { displayName: "Alamat Email", type: "text", icon: MailIcon },
  }),
  createUserColumn.accessor(
    ({ banned }) => (banned ? "banned" : "active") satisfies UserStatus,
    {
      id: "status",
      header: ({ column }) => (
        <ColumnHeader column={column}>Status</ColumnHeader>
      ),
      cell: ({ cell }) => <UserStatusBadge value={cell.getValue()} />,
      filterFn: filterFn("option"),
      meta: {
        displayName: "Status",
        type: "option",
        icon: CircleDotIcon,
        transformOptionFn: (value) => {
          const { displayName, icon } = userStatusMeta[value];
          return { value, label: displayName, icon };
        },
      },
    },
  ),
  createUserColumn.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => <ColumnHeader column={column}>Role</ColumnHeader>,
    cell: ({ row }) => (
      <UserRoleDropdown
        data={row.original}
        isCurrentUser={row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: ShieldUserIcon,
      transformOptionFn: (value) => {
        const { displayName, icon } = rolesMeta[value];
        return { value, label: displayName, icon };
      },
    },
  }),
  createUserColumn.accessor(({ updatedAt }) => updatedAt, {
    id: "updatedAt",
    header: ({ column }) => (
      <ColumnHeader column={column}>Terakhir Diperbarui</ColumnHeader>
    ),
    cell: ({ cell }) => formatDate(cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      displayName: "Terakhir Diperbarui",
      type: "date",
      icon: CalendarSyncIcon,
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: "createdAt",
    header: ({ column }) => (
      <ColumnHeader column={column}>Waktu Dibuat</ColumnHeader>
    ),
    cell: ({ cell }) => formatDate(cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      displayName: "Waktu Dibuat",
      type: "date",
      icon: CalendarCheck2Icon,
    },
  }),
];

export function UserDataTable() {
  const { user } = useAuth();
  return (
    <DataTable
      mode="server"
      swr={{
        key: "/auth/list-users",
        fetcher: async (state) => await listUsers(user.role, state),
      }}
      columns={getUserColumn(user.id)}
      searchPlaceholder="Cari Pengguna..."
      getRowId={(row) => row.id}
      enableRowSelection={(row) => row.original.id !== user.id}
      renderRowSelection={({ rows, table }) => {
        const filteredData = rows.map((row) => row.original);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings2Icon /> {messages.actions.action}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="grid gap-y-1 p-1 [&_button]:justify-start">
              <div className="flex justify-center py-1">
                <small>
                  Akun dipilih:{" "}
                  <span className="font-medium">{filteredData.length}</span>
                </small>
              </div>

              <Separator />

              <ActionRevokeUserSessionsDialog
                userIds={filteredData.map(({ id }) => id)}
                onSuccess={() => table.resetRowSelection()}
              />

              {/* // TODO */}
              <Button size="sm" variant="ghost_destructive" disabled>
                <BanIcon /> Blokir
              </Button>

              <ActionRemoveUsersDialog
                data={filteredData}
                onSuccess={() => table.resetRowSelection()}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}

export function UserDetailDialog({
  data,
  isCurrentUser,
}: {
  data: AuthSession["user"];
  isCurrentUser: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const profile: DetailListData = [
    { label: "Terakhir diperbarui", content: messages.dateAgo(data.updatedAt) },
    { label: "Waktu dibuat", content: messages.dateAgo(data.createdAt) },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex items-center gap-x-3">
        <UserAvatar data={data} className="rounded-full" />
        <DialogTrigger className="group flex w-fit gap-x-1 hover:cursor-pointer">
          <span className="link-group">{data.name}</span>
          <ArrowUpRightIcon className="group-hover:text-primary size-3.5" />
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-2xl" hideCloseButton>
        <DialogHeader className="flex-row justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <UserAvatar data={data} className="size-12" />
            <div className="grid">
              <SheetTitle className="text-base">{data.name}</SheetTitle>
              <SheetDescription>{data.email}</SheetDescription>
            </div>
          </div>

          {!isCurrentUser && (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon-sm" variant="outline">
                  <EllipsisIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="grid gap-y-1 p-1 [&_button]:justify-start"
                align="end"
              >
                <ImpersonateUserDialog
                  data={data}
                  setIsDialogOpen={setIsDialogOpen}
                />

                <RevokeUserSessionsDialog data={data} />

                <Separator />

                {data.banned ? (
                  <UnbanUserDialog
                    data={data}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                ) : (
                  <BanUserDialog
                    data={data}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                )}

                <RemoveUserDialog
                  data={data}
                  setIsDialogOpen={setIsDialogOpen}
                />
              </PopoverContent>
            </Popover>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-y-3 overflow-y-auto">
          <div className="flex items-center gap-2">
            {isCurrentUser && (
              <Badge variant="outline">Pengguna saat ini</Badge>
            )}

            <UserRoleBadge value={data.role} />
            {data.emailVerified && <UserVerifiedBadge />}
          </div>

          <Separator />

          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">
                <UserRoundIcon /> Informasi Profil
              </TabsTrigger>

              <TabsTrigger value="sessions">
                <CookieIcon /> Sesi Terdaftar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="grid gap-x-2 gap-y-4">
              <DetailList data={profile} />
            </TabsContent>

            <TabsContent value="sessions">
              <UserSessionList data={data} />
            </TabsContent>
          </Tabs>

          <Separator />

          <DialogFooter>
            <DialogClose>{messages.actions.back}</DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    })
    .extend({ revokeOtherSessions: z.boolean() })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: false,
    },
  });

  const formHandler = (formData: FormSchema) => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.changePassword(formData);
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          form.reset();
          return "Kata sandi Anda berhasil diperbarui.";
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
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldWrapper
              label="Kata sandi saat ini"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <PasswordInput
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan kata sandi saat ini"
                icon={<LockKeyholeOpenIcon />}
                required
                {...field}
              />
            </FieldWrapper>
          )}
        />

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

        <Controller
          name="revokeOtherSessions"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={!!fieldState.error}>
              <Checkbox
                id={field.name}
                name={field.name}
                aria-invalid={!!fieldState.error}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <FieldLabel htmlFor={field.name}>
                Keluar dari perangkat lainnya
              </FieldLabel>
            </Field>
          )}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch md:flex-row">
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} />
          {messages.actions.update}
        </Button>

        <ResetButton onClick={() => form.reset()} />
      </CardFooter>
    </form>
  );
}

export function CreateUserDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({
      name: true,
      email: true,
      newPassword: true,
      confirmPassword: true,
      role: true,
    })
    .refine((sc) => sc.newPassword === sc.confirmPassword, {
      message: sharedText.passwordNotMatch,
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
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.admin.createUser({
          password: newPassword,
          role: newRole ?? defaultRole,
          ...rest,
        });

        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateListUsers();
          form.reset();
          return `Akun atas nama ${rest.name} berhasil dibuat.`;
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
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserRoundPlusIcon /> Tambah Pengguna
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
          <DialogDescription>
            Pastikan semua informasi sudah benar sebelum mengkonfirmasi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Nama"
                htmlFor={field.name}
                errors={fieldState.error}
              >
                <InputGroup>
                  <InputGroupInput
                    type="text"
                    id={field.name}
                    aria-invalid={!!fieldState.error}
                    placeholder="Masukan nama anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <UserRoundIcon />
                  </InputGroupAddon>
                </InputGroup>
              </FieldWrapper>
            )}
          />

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

          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Kata sandi"
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

          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Ubah role"
                htmlFor={field.name}
                errors={fieldState.error}
              >
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex-col"
                  required
                >
                  {allRoles.map((value) => {
                    const { icon: Icon, ...meta } = rolesMeta[value];
                    return (
                      <FieldLabel
                        key={value}
                        htmlFor={value}
                        color={meta.color}
                        className="border-(--field-color)/40"
                      >
                        <Field
                          orientation="horizontal"
                          data-invalid={!!fieldState.error}
                        >
                          <FieldContent>
                            <FieldTitle className="text-(--field-color)">
                              <Icon /> {meta.displayName}
                            </FieldTitle>
                            <FieldDescription className="text-(--field-color)/80">
                              {meta.desc}
                            </FieldDescription>
                          </FieldContent>
                          <RadioGroupItem
                            value={value}
                            id={value}
                            classNames={{ circle: "fill-[var(--field-color)]" }}
                            aria-invalid={!!fieldState.error}
                          />
                        </Field>
                      </FieldLabel>
                    );
                  })}
                </RadioGroup>
              </FieldWrapper>
            )}
          />

          <Separator />

          <DialogFooter>
            <DialogClose>{messages.actions.cancel}</DialogClose>
            <Button type="submit" disabled={isLoading}>
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <UserRoundPlusIcon /> }}
              />
              {messages.actions.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UserRoleDropdown({
  data,
  isCurrentUser,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "role">;
  isCurrentUser: boolean;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = (newRole: Role) => {
    const role = newRole ?? defaultRole;
    if (role === data.role)
      return toast.info(messages.noChanges(`role ${data.name}`));

    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.admin.setRole({ userId: data.id, role });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsOpen(false);

          mutateListUsers();
          return `Role ${data.name} berhasil diperbarui menjadi ${role}.`;
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center gap-x-2">
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-xs"
            variant="ghost"
            disabled={isCurrentUser || isLoading}
          >
            <LoadingSpinner
              loading={isLoading}
              icon={{ base: <ChevronDownIcon /> }}
            />
          </Button>
        </DropdownMenuTrigger>
        <UserRoleBadge value={data.role} />
      </div>

      <DropdownMenuContent align="start">
        {allRoles.map((item) => {
          const { displayName, color, icon: Icon } = rolesMeta[item];
          return (
            <DropdownMenuItem
              key={item}
              style={{ "--item-color": color } as React.CSSProperties}
              className={cn(
                "justify-start text-(--item-color) focus:bg-(--item-color)/10 focus:text-(--item-color)",
                item === data.role &&
                  "bg-(--item-color)/10 text-(--item-color)",
              )}
              onClick={() => clickHandler(item)}
              disabled={isLoading}
            >
              {Icon && <Icon />} {displayName}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// #endregion

// #region SESSIONS

export function SessionList() {
  const { data, error, isLoading } = useListSessions();
  if (error) return <ErrorFallback error={error} />;
  if (!data && isLoading) return <LoadingFallback />;
  return <SessionListCollapsible data={data ?? []} />;
}

function UserSessionList({
  data: userData,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
}) {
  const { data, error, isLoading } = useListUserSessions(userData.id);
  if (error) return <ErrorFallback error={error} />;
  if (!data && isLoading) return <LoadingFallback />;
  return <SessionListCollapsible name={userData.name} data={data ?? []} />;
}

function SessionListCollapsible({
  name,
  data,
}: {
  name?: string;
  data: AuthSession["session"][];
}) {
  const { session } = useAuth();
  const [revokingSession, setRevokingSession] = useState<string | null>();

  if (!data.length)
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <ShieldBanIcon className="size-4" />
        <small className="font-medium">Tidak ada Sesi yang terdaftar.</small>
      </div>
    );

  const deviceIcons = {
    desktop: MonitorIcon,
    mobile: SmartphoneIcon,
    tablet: TabletIcon,
    console: Gamepad2Icon,
    smarttv: TvMinimalIcon,
    wearable: MonitorSmartphoneIcon,
    xr: MonitorSmartphoneIcon,
    embedded: MonitorSmartphoneIcon,
    other: MonitorSmartphoneIcon,
  };

  const sections: { label: string; key: UAParserProps }[] = [
    { label: "Browser", key: "browser" },
    { label: "CPU", key: "cpu" },
    { label: "Device", key: "device" },
    { label: "Engine", key: "engine" },
    { label: "Operating System", key: "os" },
  ];

  const clickHandler = (s: AuthSession["session"]) => {
    setRevokingSession(s.id);
    authClient.revokeSession(
      { token: s.token },
      {
        onSuccess: () => {
          setRevokingSession(null);
          mutateListSessions();
          mutateListUserSessions(s.userId);
          toast.success("Sesi berhasil diakhiri.");
        },
        onError: ({ error }) => {
          setRevokingSession(null);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="grid gap-y-2">
      {data
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .map((s) => {
          const isCurrentSession = session.id === s.id;
          const isLoading = revokingSession === s.id;

          const userAgent = s.userAgent
            ? new UAParser(s.userAgent).getResult()
            : null;

          const browserName =
            userAgent?.browser.name ?? "Browser tidak dikenal";
          const osName = userAgent?.os.name ?? "OS tidak dikenal";
          const DeviceIcon = deviceIcons[userAgent?.device.type ?? "other"];

          const infoList: DetailListData = [
            { label: "Alamat IP", content: s.ipAddress },
            { label: "User Agent", content: userAgent?.ua },
          ];

          const detailList: DetailListData = sections.map(({ label, key }) => ({
            label,
            content: userAgent?.[key]
              ? Object.entries(userAgent[key]).map(
                  ([subLabel, subContent]) => ({ subLabel, subContent }),
                )
              : undefined,
          }));

          return (
            <Collapsible key={s.id} className="rounded-lg border p-2 shadow-xs">
              <div className="flex items-center justify-between gap-x-4">
                <div className="flex items-center gap-x-3">
                  <div className="size-fit rounded-full border p-3">
                    <DeviceIcon className="size-5 shrink-0" />
                  </div>

                  <div className="grid gap-y-1 font-medium">
                    <div className="flex items-center gap-x-2">
                      <small>{`${osName} - ${browserName}`}</small>
                      <ImpersonateUserBadge
                        impersonating={!!s.impersonatedBy}
                      />
                    </div>

                    {isCurrentSession ? (
                      <small className="text-success">Sesi saat ini</small>
                    ) : (
                      <small className="text-muted-foreground">
                        {messages.thingAgo("Terakhir terlihat", s.updatedAt)}
                      </small>
                    )}
                  </div>
                </div>

                <div className="flex gap-x-2">
                  {!isCurrentSession && s.token && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={isLoading}
                        >
                          <LoadingSpinner
                            loading={isLoading}
                            icon={{ base: <MonitorOffIcon /> }}
                          />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-x-2">
                            <MonitorOffIcon /> Akhiri Sesi {name}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Sesi pada perangkat <span>{name}</span> akan
                            diakhiri dan pengguna harus login kembali. Yakin
                            ingin melanjutkan?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {messages.actions.cancel}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => clickHandler(s)}>
                            {messages.actions.confirm}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  <CollapsibleTrigger asChild>
                    <Button size="icon-sm" variant="ghost">
                      <ChevronsUpDownIcon />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent className="grid gap-y-2 py-2">
                <Separator />

                <div className="grid gap-2 px-2">
                  <DetailList data={infoList} />
                </div>

                <Separator />

                <div className="grid gap-2 px-2 lg:grid-cols-2">
                  <DetailList data={detailList} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
    </div>
  );
}

export function RevokeOtherSessionsButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.revokeOtherSessions();
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateListSessions();
          return "Semua sesi aktif lainnya berhasil diakhiri.";
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <LoadingSpinner
            loading={isLoading}
            icon={{ base: <MonitorOffIcon /> }}
          />
          Akhiri Semua Sesi di Perangkat Lain
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOffIcon /> Akhiri Semua Sesi di Perangkat Lain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif di perangkat lain akan diakhiri, kecuali sesi ini.
            Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RevokeUserSessionsDialog({
  data,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const userId = data.id;
        const res = await authClient.admin.revokeUserSessions({ userId });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateListUserSessions(data.id);
          return `Semua sesi aktif milik ${data.name} berhasil diakhiri.`;
        },
        error: ({ error }) => {
          setIsLoading(false);
          return error.message;
        },
      },
    );
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
            <MonitorOffIcon /> Akhiri Semua Sesi {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif milik <span>{data.name}</span> akan diakhiri,
            termasuk sesi saat ini. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>

          <AlertDialogAction onClick={clickHandler}>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
          <AlertDialogAction onClick={clickHandler}>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// #endregion

// #region IMPERSONATION

export function ImpersonateUserBadge({
  impersonating,
}: {
  impersonating?: boolean;
}) {
  const { session } = useAuth();

  const isImpersonating = impersonating ?? !!session.impersonatedBy;
  if (!isImpersonating) return;

  return (
    <div className="relative">
      <Badge variant="outline" className="relative">
        <Layers2Icon />
        <span className="hidden md:flex">Mode Impersonasi</span>
      </Badge>
      <Ping />
    </div>
  );
}

function ImpersonateUserDialog({
  data,
  setIsDialogOpen,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const userId = data.id;
        const res = await authClient.admin.impersonateUser({ userId });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsDialogOpen(false);
          mutateSession();
          router.push("/dashboard");
          return `Anda sekarang masuk sebagai ${data.name}.`;
        },
        error: ({ error }) => {
          setIsLoading(false);
          return error.message;
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isLoading}>
          <LoadingSpinner
            loading={isLoading}
            icon={{ base: <Layers2Icon /> }}
          />
          Akses Akun
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <Layers2Icon /> Impersonasi {data.name}
          </AlertDialogTitle>
          <div className="space-y-2">
            <AlertDialogDescription>
              <span>Mode Impersonasi</span> adalah fitur khusus{" "}
              <span>{rolesMeta.admin.displayName}</span> yang memungkinkan Anda
              masuk ke akun pengguna lain tanpa harus mengetahui kata sandi
              mereka.
            </AlertDialogDescription>

            <AlertDialogDescription>
              Saat dalam <span>Mode Impersonasi</span>, Anda akan memiliki akses
              penuh ke akun pengguna yang dipilih <span>( {data.name} )</span>.
              Yakin ingin melanjutkan?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>

          <AlertDialogAction onClick={clickHandler}>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StopImpersonateUserMenuItem() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session, user } = useAuth();
  if (!session.impersonatedBy) return;

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const res = await authClient.admin.stopImpersonating();
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateSession();
          router.push("/dashboard");
          return `Anda telah kembali ke sesi ${rolesMeta.admin.displayName} Anda.`;
        },
        error: ({ error }) => {
          setIsLoading(false);
          return error.message;
        },
      },
    );
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={`Keluar dari sesi ${user.name}`}
        variant="destructive"
        disabled={isLoading}
        onClick={clickHandler}
      >
        <LoadingSpinner loading={isLoading} icon={{ base: <Layers2Icon /> }} />
        Kembali ke akun saya
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// #endregion

// #region BAN & REMOVAL

function BanUserDialog({
  data,
  setIsDialogOpen,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "image">;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z.object({
    banReason: sharedSchemas.string("Alasan blokir").optional(),
    banExpiresDate: sharedSchemas.date("Tanggal blokir berakhir").optional(),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { banReason: "" },
  });

  const formHandler = (formData: FormSchema) => {
    const { banReason, banExpiresDate } = formData;

    toast.promise(
      async () => {
        setIsLoading(true);

        const res = await authClient.admin.banUser({
          userId: data.id,
          banReason,
          banExpiresIn: banExpiresDate
            ? endOfDay(banExpiresDate).getTime()
            : undefined,
        });

        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsOpen(false);
          setIsDialogOpen(false);
          mutateListUsers();
          return `Akun atas nama ${data.name} berhasil diblokir.`;
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <BanIcon /> }} />
          Blokir
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlertIcon /> Blokir akun atas nama {data.name}
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan memblokir and menonaktifkan akun{" "}
            <span>{data.name}</span>. Harap berhati-hati sebelum melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="banReason"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Alasan blokir"
                htmlFor={field.name}
                errors={fieldState.error}
                description="* Opsional"
              >
                <Textarea
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder="Masukan alasan pemblokiran akun ini"
                  {...field}
                />
              </FieldWrapper>
            )}
          />

          <Controller
            name="banExpiresDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldWrapper
                label="Tanggal blokir berakhir"
                htmlFor={field.name}
                errors={fieldState.error}
                description="* Opsional, Kosongkan jika blokir berlaku tanpa batas waktu."
              >
                <DatePicker
                  id={field.name}
                  invalid={!!fieldState.error}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </FieldWrapper>
            )}
          />

          <DialogFooter>
            <DialogClose>{messages.actions.cancel}</DialogClose>
            <ResetButton onClick={() => form.reset()} />
            <Button type="submit" variant="destructive" disabled={isLoading}>
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <BanIcon /> }}
              />
              {messages.actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function UnbanUserDialog({
  data,
  setIsDialogOpen,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        const userId = data.id;
        const res = await authClient.admin.unbanUser({ userId });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsDialogOpen(false);
          mutateListUsers();
          return `Akun atas nama ${data.name} berhasil dibuka.`;
        },
        error: ({ error }) => {
          setIsLoading(false);
          return error.message;
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost" disabled={isLoading}>
          <LoadingSpinner
            loading={isLoading}
            icon={{ base: <LockKeyholeOpenIcon /> }}
          />
          Buka Blokir
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <InfoIcon /> Buka Blokir {data.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN: Tindakan ini akan membuka blokir mengaktifkan kembali
            akun milik <span>{data.name}</span>. Harap berhati-hati sebelum
            melanjutkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{messages.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RemoveUserDialog({
  data,
  setIsDialogOpen,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "image">;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: sharedSchemas.string("Nama") })
    .refine((sc) => sc.input === data.name, {
      message: messages.thingNotMatch("Nama"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const formHandler = () => {
    toast.promise(
      async () => {
        setIsLoading(true);
        if (data.image) removeFiles([data.image], { isPublicUrl: true });
        const res = await authClient.admin.removeUser({ userId: data.id });
        if (res.error) throw new Error(res.error.message);
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsOpen(false);
          setIsDialogOpen(false);
          mutateListUsers();
          return `Akun atas nama ${data.name} berhasil dihapus.`;
        },
        error: (e) => {
          setIsLoading(false);
          return e.message;
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Trash2Icon /> }} />
          {messages.actions.remove}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlertIcon /> Hapus akun atas nama {data.name}
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan menghapus akun{" "}
            <span>{data.name}</span> beserta seluruh datanya secara permanen.
            Harap berhati-hati karena aksi ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(formHandler)} noValidate>
          <Controller
            name="input"
            control={form.control}
            render={({ field: { onChange, ...field }, fieldState }) => (
              <FieldWrapper
                label={messages.removeLabel(data.name)}
                errors={fieldState.error}
                htmlFor={field.name}
              >
                <Input
                  type="text"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder={data.name}
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

          <DialogFooter>
            <DialogClose>{messages.actions.cancel}</DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={input !== data.name || isLoading}
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

// TODO: function ActionBanUserDialog() {}
// TODO: function ActionUnbanUserDialog() {}

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
          {messages.actions.remove}
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
                  type="text"
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

          <DialogFooter>
            <DialogClose>{messages.actions.cancel}</DialogClose>
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
