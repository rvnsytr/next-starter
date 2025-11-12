"use client";

import { appMeta, fileMeta } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { actions, messages } from "@/lib/content";
import { filterFn } from "@/lib/filters";
import { allRoles, Role, rolesMeta } from "@/lib/permission";
import { zodSchemas, zodUser } from "@/lib/zod";
import {
  deleteProfilePicture,
  deleteUsers,
  getUserList,
  revokeUserSessions,
} from "@/server/action";
import { getFilePublicUrl, uploadFiles } from "@/server/s3";
import { formatDate } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { createColumnHelper } from "@tanstack/react-table";
import { Session } from "better-auth";
import { UserWithRole } from "better-auth/plugins";
import {
  ArrowUpRight,
  Ban,
  CalendarCheck2,
  CalendarSync,
  CircleDot,
  Gamepad2,
  Info,
  Layers2,
  LockKeyhole,
  LockKeyholeOpen,
  LogIn,
  LogOut,
  Mail,
  Monitor,
  MonitorOff,
  MonitorSmartphone,
  Save,
  Settings2,
  Smartphone,
  Tablet,
  Trash2,
  TriangleAlert,
  TvMinimal,
  UserRound,
  UserRoundPlus,
  UserSquare2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { UAParser } from "ua-parser-js";
import { z } from "zod";
import {
  ColumnCellCheckbox,
  ColumnHeader,
  ColumnHeaderCheckbox,
} from "../data-table/column";
import { DataTable, OtherDataTableProps } from "../data-table/data-table";
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
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { ResetButton } from "../ui/buttons";
import { CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { DetailListProps } from "../ui/detail-list";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "../ui/field";
import { FieldWrapper } from "../ui/field-wrapper";
import { GithubIcon } from "../ui/icons";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { SidebarMenuButton } from "../ui/sidebar";
import { LoadingSpinner } from "../ui/spinner";
import { UserAvatar, UserRoleBadge, UserVerifiedBadge } from "./user";

const signInRoute = "/sign-in";
const dashboardRoute = "/dashboard";

const sharedText = {
  signIn: "Berhasil masuk - Selamat datang!",
  signOn: (social: string) => `Lanjutkan dengan ${social}`,

  passwordNotMatch: messages.thingNotMatch("Kata sandi"),
  revokeSession: "Cabut Sesi",
};

/*
 * --- USER ---
 */

const createUserColumn = createColumnHelper<UserWithRole>();
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
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableHiding: false,
  }),
  createUserColumn.accessor(({ image }) => image, {
    id: "image",
    header: ({ column }) => (
      <ColumnHeader column={column} className="justify-center">
        Foto Profil
      </ColumnHeader>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <UserAvatar {...row.original} className="size-20" />
      </div>
    ),
    meta: { displayName: "Foto Profil", type: "text", icon: UserSquare2 },
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    enablePinning: true,
  }),
  createUserColumn.accessor(({ name }) => name, {
    id: "name",
    header: ({ column }) => <ColumnHeader column={column}>Nama</ColumnHeader>,
    cell: ({ row }) => (
      <UserDetailSheet
        data={row.original}
        isCurrentUser={row.original.id === currentUserId}
      />
    ),
    filterFn: filterFn("text"),
    meta: { displayName: "Nama", type: "text", icon: UserRound },
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
          {!row.original.emailVerified && <UserVerifiedBadge withoutText />}
        </div>
      );
    },
    filterFn: filterFn("text"),
    meta: { displayName: "Alamat Email", type: "text", icon: Mail },
  }),
  createUserColumn.accessor(({ role }) => role, {
    id: "role",
    header: ({ column }) => <ColumnHeader column={column}>Role</ColumnHeader>,
    cell: ({ cell }) => <UserRoleBadge value={cell.getValue() as Role} />,
    filterFn: filterFn("option"),
    meta: {
      displayName: "Role",
      type: "option",
      icon: CircleDot,
      transformOptionFn: (value) => {
        const { displayName, icon } = rolesMeta[value as Role];
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
      icon: CalendarSync,
    },
  }),
  createUserColumn.accessor(({ createdAt }) => createdAt, {
    id: "createdAt",
    header: ({ column }) => (
      <ColumnHeader column={column}>Waktu Dibuat</ColumnHeader>
    ),
    cell: ({ cell }) => formatDate(cell.getValue(), "PPPp"),
    filterFn: filterFn("date"),
    meta: { displayName: "Waktu Dibuat", type: "date", icon: CalendarCheck2 },
  }),
];

export function UserDataTable({
  data: fallbackData,
  currentUserId,
  searchPlaceholder = "Cari Pengguna...",
  ...props
}: OtherDataTableProps<UserWithRole> & {
  data: UserWithRole[];
  currentUserId: string;
}) {
  const fetcher = async () => (await getUserList()).users;
  const { data } = useSWR("users", fetcher, { fallbackData });
  const columns = getUserColumn(currentUserId);
  return (
    <DataTable
      data={data}
      columns={columns}
      searchPlaceholder={searchPlaceholder}
      enableRowSelection={({ original }) => original.id !== currentUserId}
      rowSelectionFn={(data, table) => {
        const filteredData = data.map(({ original }) => original);
        const clearRowSelection = () => table.resetRowSelection();
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2 /> {actions.action}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="[&_button]:justify-start">
              <DropdownMenuLabel className="text-center">
                Akun dipilih: {filteredData.length}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <AdminActionRevokeUserSessionsDialog
                  ids={filteredData.map(({ id }) => id)}
                  onSuccess={clearRowSelection}
                />
              </DropdownMenuItem>

              {/* // TODO */}
              <DropdownMenuItem asChild>
                <Button size="sm" variant="ghost_destructive" disabled>
                  <Ban /> Ban
                </Button>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <AdminActionRemoveUsersDialog
                  data={filteredData}
                  onSuccess={clearRowSelection}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
      {...props}
    />
  );
}

export function UserDetailSheet({
  data,
  isCurrentUser,
}: {
  data: UserWithRole;
  isCurrentUser: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const details: DetailListProps["data"] = [
    { label: "Alamat email", content: data.email },
    { label: "Terakhir diperbarui", content: messages.dateAgo(data.updatedAt) },
    { label: "Waktu dibuat", content: messages.dateAgo(data.createdAt) },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="group hover:cursor-pointer" asChild>
        <div className="flex w-fit gap-x-1">
          <span className="link-group">{data.name}</span>
          <ArrowUpRight className="group-hover:text-primary size-3.5" />
        </div>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="flex-row items-center">
          <UserAvatar {...data} className="size-10" />
          <div className="grid">
            <SheetTitle className="text-base">{data.name}</SheetTitle>
            <SheetDescription># {data.id.slice(0, 17)}</SheetDescription>
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-y-3 overflow-y-auto px-4">
          <Separator />

          <div className="flex items-center gap-2">
            <UserRoleBadge value={data.role as Role} />
            {data.emailVerified && <UserVerifiedBadge />}
          </div>

          <DetailListProps data={details} />

          {!isCurrentUser && (
            <>
              <Separator />

              <AdminChangeUserRoleForm data={data} setIsOpen={setIsOpen} />

              <Separator />

              {/* // TODO */}
              <Button variant="outline_primary" disabled>
                <Layers2 /> Tiru Sesi
              </Button>

              <AdminRevokeUserSessionsDialog {...data} />

              {/* // TODO */}
              <Button variant="outline_destructive" disabled>
                <Ban /> Ban
              </Button>
            </>
          )}
        </div>

        {!isCurrentUser && (
          <SheetFooter>
            <AdminRemoveUserDialog data={data} setIsOpen={setIsOpen} />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenuButton
      tooltip="Keluar"
      variant="outline_destructive"
      className="text-destructive hover:text-destructive"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Berhasil keluar - Sampai jumpa!");
              router.push(signInRoute);
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        });
      }}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <LogOut /> }} /> Keluar
    </SidebarMenuButton>
  );
}

export function SignOnGithubButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Button
      variant="outline"
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        authClient.signIn.social(
          {
            provider: "github",
            callbackURL: dashboardRoute,
            errorCallbackURL: signInRoute,
          },
          {
            onSuccess: () => {
              toast.success(sharedText.signIn);
            },
            onError: ({ error }) => {
              setIsLoading(false);
              toast.error(error.message);
            },
          },
        );
      }}
    >
      <LoadingSpinner loading={isLoading} icon={{ base: <GithubIcon /> }} />
      {sharedText.signOn("Github")}
    </Button>
  );
}

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser.pick({
    email: true,
    password: true,
    rememberMe: true,
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const formHandler = (formData: FormSchema) => {
    setIsLoading(true);
    authClient.signIn.email(
      { ...formData, callbackURL: dashboardRoute },
      {
        onSuccess: () => {
          toast.success(sharedText.signIn);
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
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
                <Mail />
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
            <InputGroup>
              <InputGroupInput
                type="password"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan kata sandi anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
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

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <LogIn /> }} />
        Masuk ke Dashboard
      </Button>
    </form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser
    .pick({
      name: true,
      email: true,
      newPassword: true,
      confirmPassword: true,
      agreement: true,
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
      agreement: false,
    },
  });

  const formHandler = ({ newPassword: password, ...rest }: FormSchema) => {
    setIsLoading(true);
    authClient.signUp.email(
      { password, ...rest },
      {
        onSuccess: () => {
          setIsLoading(false);
          form.reset();
          toast.success(
            "Akun berhasil dibuat. Silakan masuk untuk melanjutkan.",
          );
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
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
                <UserRound />
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
                <Mail />
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
            <InputGroup>
              <InputGroupInput
                type="password"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Masukan kata sandi anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
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
            <InputGroup>
              <InputGroupInput
                type="password"
                id={field.name}
                aria-invalid={!!fieldState.error}
                placeholder="Konfirmasi kata sandi anda"
                required
                {...field}
              />
              <InputGroupAddon>
                <LockKeyhole />
              </InputGroupAddon>
            </InputGroup>
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
                <span className="text-foreground link-underline">
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
          icon={{ base: <UserRoundPlus /> }}
        />{" "}
        Daftar Sekarang
      </Button>
    </form>
  );
}

export function ProfilePicture({
  id,
  name,
  image,
}: Pick<UserWithRole, "id" | "name" | "image">) {
  const router = useRouter();
  const inputAvatarRef = useRef<HTMLInputElement>(null);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);

  const contentType = "image";
  const formSchema = zodSchemas.file(contentType);

  const changeHandler = async (fileList: FileList) => {
    setIsChange(true);
    const files = Array.from(fileList).map((f) => f);

    const parseRes = formSchema.safeParse(files);
    if (!parseRes.success) return toast.error(parseRes.error.message);

    const file = files[0];
    const key = `${id}_${file.name}`;
    const url = await getFilePublicUrl(key);

    if (image && url !== image) await deleteProfilePicture(image);
    await uploadFiles({ files: [{ key, file }], ACL: "public-read" });

    authClient.updateUser(
      { image: url },
      {
        onSuccess: () => {
          setIsChange(false);
          router.refresh();
          toast.success("Foto profil Anda berhasil diperbarui.");
        },
        onError: ({ error }) => {
          setIsChange(false);
          toast.error(error.message);
        },
      },
    );
  };

  const deleteHandler = async () => {
    setIsRemoved(true);
    if (image) await deleteProfilePicture(image);

    await authClient.updateUser(
      { image: null },
      {
        onSuccess: () => {
          toast.success("Foto profil Anda berhasil dihapus.");
          setIsRemoved(false);
          router.refresh();
        },
        onError: ({ error }) => {
          toast.error(error.message);
          setIsRemoved(false);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <UserAvatar name={name} image={image} className="size-24" />

      <input
        type="file"
        ref={inputAvatarRef}
        accept={fileMeta[contentType].mimeTypes.join(", ")}
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
            <LoadingSpinner loading={isChange} /> {actions.upload} foto profil
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline_destructive"
                disabled={!image || isChange || isRemoved}
              >
                <LoadingSpinner loading={isRemoved} /> {actions.remove}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus Foto Profil</AlertDialogTitle>
                <AlertDialogDescription>
                  Aksi ini akan menghapus foto profil Anda saat ini. Yakin ingin
                  melanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
                <AlertDialogAction
                  className={buttonVariants({ variant: "destructive" })}
                  onClick={() => deleteHandler()}
                >
                  {actions.confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export function PersonalInformation({ ...props }: UserWithRole) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { name, email } = props;

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser.pick({ name: true, email: true });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { name, email },
  });

  const formHandler = ({ name: newName }: FormSchema) => {
    if (newName === name) return toast.info(messages.noChanges("profil Anda"));

    setIsLoading(true);
    authClient.updateUser(
      { name: newName },
      {
        onSuccess: () => {
          setIsLoading(false);
          router.refresh();
          toast.success("Profil Anda berhasil diperbarui.");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
      <CardContent className="flex flex-col gap-y-4">
        <ProfilePicture {...props} />

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
                  <Mail />
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
                  <UserRound />
                </InputGroupAddon>
              </InputGroup>
            </FieldWrapper>
          )}
        />
      </CardContent>

      <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Save /> }} />
          {actions.update}
        </Button>

        <ResetButton onClick={() => form.reset()} />
      </CardFooter>
    </form>
  );
}

export function ChangePasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser
    .pick({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
      revokeOtherSessions: true,
    })
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
    setIsLoading(true);
    authClient.changePassword(formData, {
      onSuccess: () => {
        setIsLoading(false);
        form.reset();
        router.refresh();
        toast.success("Kata sandi Anda berhasil diperbarui.");
      },
      onError: ({ error }) => {
        setIsLoading(false);
        toast.error(error.message);
      },
    });
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
              <InputGroup>
                <InputGroupInput
                  type="password"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder="Masukan kata sandi saat ini"
                  required
                  {...field}
                />
                <InputGroupAddon>
                  <LockKeyhole />
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
              label="Kata sandi baru"
              htmlFor={field.name}
              errors={fieldState.error}
            >
              <InputGroup>
                <InputGroupInput
                  type="password"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder="Masukan kata sandi anda"
                  required
                  {...field}
                />
                <InputGroupAddon>
                  <LockKeyholeOpen />
                </InputGroupAddon>
              </InputGroup>
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
              <InputGroup>
                <InputGroupInput
                  type="password"
                  id={field.name}
                  aria-invalid={!!fieldState.error}
                  placeholder="Konfirmasi kata sandi anda"
                  required
                  {...field}
                />
                <InputGroupAddon>
                  <LockKeyhole />
                </InputGroupAddon>
              </InputGroup>
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

      <CardFooter className="flex-col items-stretch border-t md:flex-row md:items-center">
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Save /> }} />
          {actions.update}
        </Button>

        <ResetButton onClick={() => form.reset()} />
      </CardFooter>
    </form>
  );
}

export function RevokeSessionButton({
  currentSessionId,
  id,
  updatedAt,
  userAgent,
  token,
}: Session & { currentSessionId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isCurrentSession = currentSessionId === id;
  const { browser, os, device } = new UAParser(userAgent!).getResult();

  const DeviceIcons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Tablet,
    console: Gamepad2,
    smarttv: TvMinimal,
    wearable: MonitorSmartphone,
    xr: MonitorSmartphone,
    embedded: MonitorSmartphone,
    other: MonitorSmartphone,
  }[device.type || "other"];

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeSession(
      { token },
      {
        onSuccess: () => {
          setIsLoading(false);
          router.refresh();
          toast.success("Sesi berhasil dicabut.");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="bg-card flex items-center gap-x-4 rounded-lg border p-2 shadow-xs">
      <div className="flex grow items-center gap-x-2">
        <div className="bg-muted aspect-square size-fit rounded-md p-2">
          <DeviceIcons className="shrink-0" />
        </div>

        <div className="grid gap-y-1">
          <small className="font-medium">
            {`${browser.name || "Browser tidak diketahui"} di ${os.name || "sistem operasi yang tidak diketahui"}`}
          </small>

          {isCurrentSession ? (
            <small className="text-success">Sesi saat ini</small>
          ) : (
            <small className="text-muted-foreground">
              {messages.thingAgo("Terakhir terlihat", updatedAt)}
            </small>
          )}
        </div>
      </div>

      {!isCurrentSession && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon-sm"
              variant="outline_destructive"
              disabled={isLoading}
            >
              <LoadingSpinner loading={isLoading} icon={{ base: <LogOut /> }} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-x-2">
                <DeviceIcons /> {sharedText.revokeSession}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Sesi ini akan segera dihentikan dari perangkat yang dipilih.
                Yakin ingin melanjutkan?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={clickHandler}>
                {actions.confirm}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function RevokeOtherSessionsButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    authClient.revokeOtherSessions({
      fetchOptions: {
        onSuccess: () => {
          setIsLoading(false);
          router.refresh();
          toast.success("Semua sesi aktif lainnya berhasil dicabut.");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <MonitorOff /> }} />
          Cabut Semua Sesi Lain
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            <MonitorOff /> Cabut Semua Sesi Lain
          </AlertDialogTitle>
          <AlertDialogDescription>
            Semua sesi aktif lainnya akan dihentikan, kecuali sesi saat ini.
            Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={clickHandler}>
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteMyAccountButton({ image }: Pick<UserWithRole, "image">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    if (image) await deleteProfilePicture(image);

    authClient.deleteUser(
      { callbackURL: signInRoute },
      {
        onSuccess: () => {
          router.push(signInRoute);
          toast.success("Akun Anda berhasil dihapus.");
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline_destructive"
          className="w-full md:w-fit"
          disabled={isLoading}
        >
          <LoadingSpinner loading={isLoading} icon={{ base: <Trash2 /> }} />
          Hapus Akun
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus Akun Anda
          </AlertDialogTitle>
          <AlertDialogDescription>
            PERINGATAN : Tindakan ini akan secara permanen menghapus semua data
            akun Anda. Harap berhati-hati karena aksi ini tidak dapat
            dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * --- ADMIN ---
 */

export function AdminCreateUserDialog() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser
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
      role: "user",
    },
  });

  const formHandler = ({ newPassword, ...rest }: FormSchema) => {
    setIsLoading(true);
    authClient.admin.createUser(
      { password: newPassword, ...rest },
      {
        onSuccess: () => {
          setIsLoading(false);
          mutate("users");
          form.reset();
          toast.success(`Akun atas nama ${rest.name} berhasil dibuat.`);
        },
        onError: ({ error }) => {
          toast.error(error.message);
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <UserRoundPlus /> Tambah Pengguna
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
                    <UserRound />
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
                    <Mail />
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
                <InputGroup>
                  <InputGroupInput
                    type="password"
                    id={field.name}
                    aria-invalid={!!fieldState.error}
                    placeholder="Masukan kata sandi anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <LockKeyhole />
                  </InputGroupAddon>
                </InputGroup>
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
                <InputGroup>
                  <InputGroupInput
                    type="password"
                    id={field.name}
                    aria-invalid={!!fieldState.error}
                    placeholder="Konfirmasi kata sandi anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <LockKeyhole />
                  </InputGroupAddon>
                </InputGroup>
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
            <DialogClose>{actions.cancel}</DialogClose>
            <Button type="submit" disabled={isLoading}>
              <LoadingSpinner
                loading={isLoading}
                icon={{ base: <UserRoundPlus /> }}
              />
              {actions.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminChangeUserRoleForm({
  data,
  setIsOpen,
}: {
  data: UserWithRole;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = zodUser.pick({ role: true });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: data.role === "user" ? "admin" : "user" },
  });

  const formHandler = (formData: FormSchema) => {
    const { role } = formData;
    if (role === data.role)
      return toast.info(messages.noChanges(`role ${data.name}`));

    setIsLoading(true);
    authClient.admin.setRole(
      { userId: data.id, role },
      {
        onSuccess: () => {
          setIsLoading(false);
          setIsOpen(false);
          mutate("users");
          toast.success(
            `Role ${data.name} berhasil diperbarui menjadi ${role}.`,
          );
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(formHandler)} noValidate>
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
                const {
                  displayName,
                  desc,
                  color,
                  icon: Icon,
                } = rolesMeta[value];

                return (
                  <FieldLabel
                    key={value}
                    htmlFor={value}
                    color={color}
                    className="border-(--field-color)/40"
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={!!fieldState.error}
                    >
                      <FieldContent>
                        <FieldTitle className="text-(--field-color)">
                          <Icon /> {displayName}
                        </FieldTitle>
                        <FieldDescription className="text-(--field-color)/80">
                          {desc}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={value}
                        id={value}
                        classNames={{ circle: "fill-[var(--field-color)]" }}
                        aria-invalid={!!fieldState.error}
                        disabled={data.role === value}
                      />
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>
          </FieldWrapper>
        )}
      />

      <Button type="submit" disabled={isLoading}>
        <LoadingSpinner loading={isLoading} icon={{ base: <Save /> }} />
        {actions.update}
      </Button>
    </form>
  );
}

function AdminRevokeUserSessionsDialog({
  id,
  name,
}: Pick<UserWithRole, "id" | "name">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = () => {
    setIsLoading(true);
    authClient.admin.revokeUserSessions(
      { userId: id },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast.success(`Semua sesi aktif milik ${name} berhasil dicabut.`);
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline_warning" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <MonitorOff /> }} />
          {sharedText.revokeSession}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-warning flex items-center gap-x-2">
            <Info /> Cabut Semua Sesi Aktif untuk {name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan langsung menghentikan semua sesi aktif milik
            {name}. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({ variant: "warning" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminRemoveUserDialog({
  data,
  setIsOpen: setSheetOpen,
}: {
  data: Pick<UserWithRole, "id" | "name" | "image">;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: zodSchemas.string("Nama") })
    .refine((sc) => sc.input === data.name, {
      message: messages.thingNotMatch("Nama"),
      path: ["input"],
    });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { input: "" },
  });

  const formHandler = async () => {
    setIsLoading(true);
    if (data.image) await deleteProfilePicture(data.image);

    authClient.admin.removeUser(
      { userId: data.id },
      {
        onSuccess: () => {
          setIsLoading(false);
          setIsOpen(false);
          setSheetOpen(false);
          mutate("users");
          toast.success(`Akun atas nama ${data.name} berhasil dihapus.`);
        },
        onError: ({ error }) => {
          setIsLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Trash2 /> }} />
          {`${actions.remove} ${data.name}`}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus akun atas nama {data.name}
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan menghapus akun{" "}
            <span className="text-foreground">{data.name}</span> beserta seluruh
            datanya secara permanen. Harap berhati-hati karena aksi ini tidak
            dapat dibatalkan.
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
            <DialogClose>{actions.cancel}</DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={input !== data.name || isLoading}
            >
              <LoadingSpinner loading={isLoading} icon={{ base: <Trash2 /> }} />
              {actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AdminActionRevokeUserSessionsDialog({
  ids,
  onSuccess,
}: {
  ids: string[];
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setIsLoading(true);
    toast.promise(revokeUserSessions(ids), {
      loading: messages.loading,
      success: (res) => {
        onSuccess();
        const successLength = res.filter(({ success }) => success).length;
        return `${successLength} dari ${ids.length} sesi pengguna berhasil dicabut.`;
      },
      error: (e) => {
        setIsLoading(false);
        return e;
      },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <MonitorOff /> }} />
          {sharedText.revokeSession}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2">
            Cabut Sesi untuk {ids.length} Pengguna
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ini akan menghentikan semua sesi aktif dari{" "}
            <span className="text-foreground">{ids.length} pengguna</span>
            yang dipilih. Yakin ingin melanjutkan?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={clickHandler}
          >
            {actions.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AdminActionRemoveUsersDialog({
  data,
  onSuccess,
}: {
  data: Pick<UserWithRole, "id" | "name" | "image">[];
  onSuccess: () => void;
}) {
  const [input, setInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inputValue = `Hapus ${String(data.length)} pengguna`;

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = z
    .object({ input: zodSchemas.string("Total pengguna yang dihapus") })
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
    toast.promise(deleteUsers(data), {
      loading: messages.loading,
      success: (res) => {
        setIsLoading(false);
        setIsOpen(false);

        onSuccess();
        mutate("users");

        const successLength = res.filter(({ success }) => success).length;
        return `${successLength} dari ${data.length} akun pengguna berhasil dihapus.`;
      },
      error: (e) => {
        setIsLoading(false);
        return e;
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost_destructive" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <Trash2 /> }} />
          {actions.remove}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-x-2">
            <TriangleAlert /> Hapus {data.length} Akun
          </DialogTitle>
          <DialogDescription>
            PERINGATAN: Tindakan ini akan menghapus{" "}
            <span className="text-foreground">{data.length} akun</span> yang
            dipilih beserta seluruh datanya secara permanen. Harap berhati-hati
            karena aksi ini tidak dapat dibatalkan.
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
            <DialogClose>{actions.cancel}</DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={input !== inputValue || isLoading}
            >
              <LoadingSpinner loading={isLoading} icon={{ base: <Trash2 /> }} />
              {actions.confirm}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
