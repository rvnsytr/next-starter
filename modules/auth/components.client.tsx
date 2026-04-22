"use client";

import { authClient } from "@/core/auth.client";
import { DataTable } from "@/core/components/data-table";
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
import { Button, ButtonProps } from "@/core/components/ui/button";
import { ResetButton } from "@/core/components/ui/buttons";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import {
  ColumnCellCheckbox,
  ColumnCellNumber,
  ColumnHeader,
  ColumnHeaderCheckbox,
} from "@/core/components/ui/column";
import { DatePicker } from "@/core/components/ui/date-picker";
import { DetailList, DetailListData } from "@/core/components/ui/detail-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/core/components/ui/field";
import { FieldWrapper } from "@/core/components/ui/field-wrapper";
import { Input } from "@/core/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import { PasswordInput } from "@/core/components/ui/password-input";
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
import { messages } from "@/core/constants/messages";
import { filterFn } from "@/core/data-filter";
import { getPresignUrl, removeFiles } from "@/core/s3";
import { sharedSchemas } from "@/core/schema.zod";
import { capitalize, cn, formatLocalizedDate } from "@/core/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { differenceInSeconds, endOfDay } from "date-fns";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  BanIcon,
  CalendarCheck2Icon,
  CalendarSyncIcon,
  ChevronDownIcon,
  CircleDotIcon,
  CookieIcon,
  EllipsisIcon,
  InfinityIcon,
  InfoIcon,
  Layers2Icon,
  LockKeyholeIcon,
  LockKeyholeOpenIcon,
  MailIcon,
  MonitorOffIcon,
  SendIcon,
  Settings2Icon,
  ShieldUserIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { listUsers, removeUsers, revokeUserSessions } from "./actions";
import {
  UserAvatar,
  UserStatusBadge,
  UserUserRoleBadge,
  UserVerifiedBadge,
} from "./components/user-avatar";
import {
  allRoles,
  allUserStatus,
  AuthSession,
  defaultRole,
  Role,
  roleConfig,
  UserStatus,
  userStatusConfig,
} from "./config";
import {
  mutateListUsers,
  mutateListUserSessions,
  mutateSession,
} from "./hooks/use-session";
import { useAuth } from "./provider.auth";
import { passwordSchema, userSchema } from "./schema.zod";

const sharedText = {
  signIn: (name?: string) =>
    `Berhasil masuk - Selamat datang${name ? ` ${name}` : ""}!`,
  signOn: (social: string) => `Lanjutkan dengan ${social}`,
  // lastUsed: "Terakhir digunakan",

  passwordNotMatch: messages.thingNotMatch("Kata sandi Anda"),
};

function getUserStatus(
  data: Pick<AuthSession["user"], "email" | "emailVerified" | "banned">,
): UserStatus {
  if (data.banned) return "banned";
  if (data.emailVerified) return "verified";
  if (data.email) return "active";
  return "nonactive";
}

// #region USER

const createUserColumn = createColumnHelper<AuthSession["user"]>();
const getUserColumns = (
  currentUserId: string,
  count?: Record<string, number>,
) => [
  createUserColumn.display({
    id: "select",
    header: (c) => <ColumnHeaderCheckbox table={c.table} />,
    cell: (c) => <ColumnCellCheckbox row={c.row} />,
    enableHiding: false,
    enableSorting: false,
  }),
  createUserColumn.display({
    id: "no",
    header: "No",
    cell: (c) => <ColumnCellNumber table={c.table} row={c.row} />,
    enableHiding: false,
  }),
  createUserColumn.accessor((ac) => ac.name, {
    id: "name",
    header: ({ column }) => <ColumnHeader column={column}>Nama</ColumnHeader>,
    cell: (c) => (
      <UserDetailDialog
        data={c.row.original}
        isCurrentUser={c.row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Nama", type: "text", icon: UserRoundIcon },
  }),
  createUserColumn.accessor((ac) => ac.email, {
    id: "email",
    header: (c) => <ColumnHeader column={c.column}>Alamat Email</ColumnHeader>,
    cell: (c) => (
      <div className="flex items-center gap-x-2">
        <span>{c.cell.getValue()}</span>
        {c.row.original.emailVerified && <UserVerifiedBadge noText />}
      </div>
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Alamat Email", type: "text", icon: MailIcon },
  }),
  createUserColumn.accessor((ac) => getUserStatus(ac), {
    id: "status",
    header: (c) => <ColumnHeader column={c.column}>Status</ColumnHeader>,
    cell: (c) => <UserStatusBadge value={c.cell.getValue()} />,
    filterFn: filterFn("option"),
    meta: {
      displayName: "Status",
      type: "option",
      icon: CircleDotIcon,
      options: allUserStatus.map((value) => {
        const { displayName, icon } = userStatusConfig[value];
        return { value, label: displayName, icon, count: count?.[value] };
      }),
    },
  }),
  createUserColumn.accessor((ac) => ac.role, {
    id: "role",
    header: (c) => <ColumnHeader column={c.column}>Role</ColumnHeader>,
    cell: (c) => (
      <UserRoleDropdown
        data={c.row.original}
        isCurrentUser={c.row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: ShieldUserIcon,
      options: allRoles.map((value) => {
        const { displayName, icon } = roleConfig[value];
        return { value, label: displayName, icon, count: count?.[value] };
      }),
    },
  }),
  createUserColumn.accessor((ac) => ac.updatedAt, {
    id: "updatedAt",
    header: (c) => (
      <ColumnHeader column={c.column}>Terakhir Diperbarui</ColumnHeader>
    ),
    cell: (c) => formatLocalizedDate(c.cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: {
      displayName: "Terakhir Diperbarui",
      type: "date",
      icon: CalendarSyncIcon,
    },
  }),
  createUserColumn.accessor((c) => c.createdAt, {
    id: "createdAt",
    header: (c) => <ColumnHeader column={c.column}>Waktu Dibuat</ColumnHeader>,
    cell: (c) => formatLocalizedDate(c.cell.getValue(), "PPPp"),
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
      mode="manual"
      searchPlaceholder="Cari Pengguna..."
      swr={{
        key: "/auth/list-users",
        fetcher: async (state) => {
          const res = await listUsers(user.role, state);
          if (!res.success) return res;

          const data = await Promise.all(
            res.data.map(async (v) => {
              if (!v.image) return v;
              return {
                ...v,
                image:
                  v.id === user.id ? user.image : await getPresignUrl(v.image),
              };
            }),
          );

          return { ...res, data };
        },
      }}
      getColumns={(res) => getUserColumns(user.id, res?.count)}
      getRowId={(row) => row.id}
      enableRowSelection={(row) => row.original.id !== user.id}
      renderRowSelection={({ rows, table }) => {
        const data = rows.map((row) => row.original);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Settings2Icon /> {messages.actions.action}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="grid gap-y-1 p-1 [&_button]:justify-start">
              <div className="flex justify-center py-1 text-sm">
                Akun dipilih: <span className="font-medium">{data.length}</span>
              </div>

              <Separator />

              <ActionRevokeUserSessionsDialog
                userIds={data.map(({ id }) => id)}
                onSuccess={() => table.resetRowSelection()}
              />

              {/* // TODO */}
              <Button size="sm" variant="ghost_destructive" disabled>
                <BanIcon /> Blokir
              </Button>

              <ActionRemoveUsersDialog
                data={data}
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
    {
      label: "Terakhir diperbarui",
      content: messages.dateRelative(data.updatedAt),
    },
    { label: "Waktu dibuat", content: messages.dateRelative(data.createdAt) },
  ];

  const banInfo: DetailListData = [
    { label: "Alasan diblokir", content: data.banReason },
    {
      label: "Tanggal blokir berakhir",
      content: data.banExpires ? (
        messages.dateRelative(data.banExpires, "future")
      ) : (
        <InfinityIcon />
      ),
    },
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

      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader className="flex-row justify-between gap-x-4">
          <div className="flex items-center gap-x-3">
            <UserAvatar data={data} className="size-12" />
            <div className="grid">
              <SheetTitle className="flex gap-x-2">
                <span className="text-base">{data.name}</span>
                {data.emailVerified && <UserVerifiedBadge noText />}
              </SheetTitle>
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
            <UserUserRoleBadge value={data.role} />
            <UserStatusBadge value={getUserStatus(data)} />
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
              {data.banned && (
                <>
                  <Separator />
                  <DetailList data={banInfo} />
                </>
              )}
            </TabsContent>

            <TabsContent value="sessions">
              <UserDetailSessionList data={data} />
            </TabsContent>
          </Tabs>

          <Separator />

          <DialogFooter showCloseButton closeButtonText="back" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CreateUserDialog({
  size,
  variant,
  className,
}: Pick<ButtonProps, "size" | "variant" | "className">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema
    .pick({ name: true, email: true, role: true })
    .extend({
      newPassword: passwordSchema.shape.newPassword,
      confirmPassword: passwordSchema.shape.confirmPassword,
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
    setIsLoading(true);
    toast.promise(
      async () => {
        const res = await authClient.admin.createUser({
          password: newPassword,
          role: newRole ?? defaultRole,
          ...rest,
        });

        if (res.error) throw res.error;
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
        <Button size={size} variant={variant} className={className}>
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
                label="Role"
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
                    const { icon: Icon, ...meta } = roleConfig[value];
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
                              {meta.description}
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

          <DialogFooter showCloseButton>
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

    setIsLoading(true);
    toast.promise(
      async () => {
        const res = await authClient.admin.setRole({ userId: data.id, role });
        if (res.error) throw res.error;
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          setIsOpen(false);

          mutateListUsers();
          return `Role ${data.name} berhasil diperbarui menjadi ${capitalize(role)}.`;
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
        <UserUserRoleBadge value={data.role} />
      </div>

      <DropdownMenuItem align="start">
        {allRoles.map((item) => {
          const { displayName, color, icon: Icon } = roleConfig[item];
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
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

// #endregion

// #region PASSWORD

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

// #endregion

// #region SESSIONS

function RevokeUserSessionsDialog({
  data,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    toast.promise(
      async () => {
        const userId = data.id;
        const res = await authClient.admin.revokeUserSessions({ userId });
        if (res.error) throw res.error;
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

          <AlertDialogAction onClick={clickHandler} autoFocus>
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
          <AlertDialogAction onClick={clickHandler} autoFocus>
            {messages.actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// #endregion

// #region IMPERSONATION

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
    setIsLoading(true);
    toast.promise(
      async () => {
        const userId = data.id;
        const res = await authClient.admin.impersonateUser({ userId });
        if (res.error) throw res.error;
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
              <span>{roleConfig.admin.displayName}</span> yang memungkinkan Anda
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

          <AlertDialogAction onClick={clickHandler} autoFocus>
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
    setIsLoading(true);
    toast.promise(
      async () => {
        const res = await authClient.admin.stopImpersonating();
        if (res.error) throw res.error;
        return res;
      },
      {
        success: () => {
          setIsLoading(false);
          mutateSession();
          router.push("/dashboard");
          return `Anda telah kembali ke sesi ${roleConfig.admin.displayName} Anda.`;
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
    banReason: sharedSchemas.string("Alasan diblokir").optional(),
    banExpiresDate: sharedSchemas.date("Tanggal blokir berakhir").optional(),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { banReason: "" },
  });

  const formHandler = (formData: FormSchema) => {
    const { banReason, banExpiresDate } = formData;

    setIsLoading(true);
    toast.promise(
      async () => {
        const res = await authClient.admin.banUser({
          userId: data.id,
          banReason,
          banExpiresIn: banExpiresDate
            ? differenceInSeconds(endOfDay(banExpiresDate), new Date())
            : undefined,
        });

        if (res.error) throw res.error;
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
                label="Alasan diblokir"
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
                  disabled={{ before: new Date() }}
                />
              </FieldWrapper>
            )}
          />

          <DialogFooter showCloseButton>
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
    setIsLoading(true);
    toast.promise(
      async () => {
        const userId = data.id;
        const res = await authClient.admin.unbanUser({ userId });
        if (res.error) throw res.error;
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
          <AlertDialogAction onClick={clickHandler} autoFocus>
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
    setIsLoading(true);
    toast.promise(
      async () => {
        if (data.image) removeFiles([data.image]);
        const res = await authClient.admin.removeUser({ userId: data.id });
        if (res.error) throw res.error;
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

          <DialogFooter showCloseButton>
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
