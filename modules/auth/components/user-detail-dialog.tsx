"use client";

import { User } from "@/core/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { DetailList, DetailListData } from "@/core/components/ui/detail-list";
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
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { Separator } from "@/core/components/ui/separator";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/core/components/ui/tabs";
import { messages } from "@/core/messages";
import { UserActivityTimeline } from "@/modules/activity/components/timeline";
import {
  BanIcon,
  CookieIcon,
  EllipsisIcon,
  HistoryIcon,
  InfinityIcon,
  Layers2Icon,
  LockKeyholeOpenIcon,
  MonitorOffIcon,
  Trash2Icon,
  UserRoundIcon,
} from "lucide-react";
import { useState } from "react";
import { getUserStatus } from "../config";
import { useSession } from "../hooks/use-session";
import { BanUserDialog } from "./ban-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { ImpersonateUserDialog } from "./impersonate-user-dialog";
import { RevokeUserSessionsDialog } from "./revoke-user-sessions-dialog";
import { RoleBadge } from "./role-badge";
import { UserDetailSessionList } from "./session-list";
import { UnbanUserDialog } from "./unban-user-dialog";
import { UserStatusBadge } from "./user-status-badge";
import { UserVerifiedBadge } from "./user-verified-badge";

type SetData = React.Dispatch<React.SetStateAction<User | null>>;

export function UserDetailDialog({
  data,
  setData,
}: {
  data: User | null;
  setData: SetData;
}) {
  return (
    <Dialog open={!!data} onOpenChange={(open) => !open && setData(null)}>
      <DialogPopup className="sm:max-w-2xl" showCloseButton={false}>
        {data && <Content data={data} setData={setData} />}
      </DialogPopup>
    </Dialog>
  );
}

function Content({ data, setData }: { data: User; setData: SetData }) {
  const { user } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isRevokeSessionsDialogOpen, setIsRevokeSessionsDialogOpen] =
    useState<boolean>(false);
  const [isImpersonateDialogOpen, setIsImpersonateDialogOpen] =
    useState<boolean>(false);
  const [isBanUserDialogOpen, setIsBanUserDialogOpen] =
    useState<boolean>(false);
  const [isUnbanUserDialogOpen, setIsUnbanUserDialogOpen] =
    useState<boolean>(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] =
    useState<boolean>(false);

  const isCurrentUser = user.id === data.id;

  const profile: DetailListData = [
    {
      label: "Terakhir diperbarui",
      content: messages.dateRelative(data.updatedAt),
    },
    { label: "Waktu dibuat", content: messages.dateRelative(data.createdAt) },
  ];

  const banInfo: DetailListData = [
    { label: "Alasan diblokir", content: data.banReason ?? undefined },
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
    <>
      <DialogHeader className="flex-row justify-between gap-x-4">
        <div className="flex items-center gap-x-2">
          <Avatar size="xl" radius="lg">
            <AvatarImage src={data.image ?? undefined} />
            <AvatarFallback>{data.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="grid">
            <DialogTitle>
              {data.name}
              {data.emailVerified && <UserVerifiedBadge withText={false} />}
            </DialogTitle>
            <DialogDescription>{data.email}</DialogDescription>
          </div>
        </div>

        {!isCurrentUser && (
          <Menu>
            <MenuTrigger
              render={
                <Button size="icon-sm" variant="outline" disabled={isLoading}>
                  <LoadingSpinner
                    icon={{ base: <EllipsisIcon /> }}
                    loading={isLoading}
                  />
                </Button>
              }
            />

            <MenuPopup align="end">
              {data.role !== "admin" && (
                <MenuItem onClick={() => setIsImpersonateDialogOpen(true)}>
                  <Layers2Icon /> Akses Akun
                </MenuItem>
              )}

              <MenuItem onClick={() => setIsRevokeSessionsDialogOpen(true)}>
                <MonitorOffIcon /> Akhiri Sesi
              </MenuItem>

              <MenuSeparator />

              {data.banned ? (
                <MenuItem onClick={() => setIsUnbanUserDialogOpen(true)}>
                  <LockKeyholeOpenIcon /> Buka Blokir
                </MenuItem>
              ) : (
                <MenuItem
                  variant="destructive"
                  onClick={() => setIsBanUserDialogOpen(true)}
                >
                  <BanIcon /> Blokir
                </MenuItem>
              )}

              <MenuItem
                variant="destructive"
                onClick={() => setIsDeleteUserDialogOpen(true)}
              >
                <Trash2Icon /> Hapus
              </MenuItem>
            </MenuPopup>
          </Menu>
        )}
      </DialogHeader>

      <DialogPanel className="flex flex-col gap-y-3">
        <div className="flex items-center gap-2">
          {isCurrentUser && <Badge variant="outline">Pengguna saat ini</Badge>}
          <RoleBadge value={data.role} />
          <UserStatusBadge value={getUserStatus(data)} />
        </div>

        <Separator />

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTab value="profile" className="h-6">
              <UserRoundIcon /> Informasi Profil
            </TabsTab>

            <TabsTab value="activity">
              <HistoryIcon /> Aktivitas
            </TabsTab>

            <TabsTab value="sessions" className="h-6">
              <CookieIcon /> Sesi Terdaftar
            </TabsTab>
          </TabsList>

          <TabsPanel value="profile" className="grid gap-x-2 gap-y-4">
            <DetailList data={profile} />
            {data.banned && (
              <>
                <Separator />
                <DetailList data={banInfo} />
              </>
            )}
          </TabsPanel>

          <TabsPanel value="activity">
            <UserActivityTimeline userId={data.id} />
          </TabsPanel>

          <TabsPanel value="sessions">
            <UserDetailSessionList data={data} />
          </TabsPanel>
        </Tabs>
      </DialogPanel>

      <DialogFooter>
        <DialogClose
          render={<Button variant="outline">{messages.actions.back}</Button>}
        />
      </DialogFooter>

      <RevokeUserSessionsDialog
        data={data}
        open={isRevokeSessionsDialogOpen}
        setOpen={setIsRevokeSessionsDialogOpen}
        setIsLoading={setIsLoading}
      />

      <ImpersonateUserDialog
        data={data}
        open={isImpersonateDialogOpen}
        setOpen={setIsImpersonateDialogOpen}
        setIsLoading={setIsLoading}
      />

      <BanUserDialog
        data={data}
        open={isBanUserDialogOpen}
        setOpen={setIsBanUserDialogOpen}
        setIsLoading={setIsLoading}
        setData={setData}
      />

      <UnbanUserDialog
        data={data}
        open={isUnbanUserDialogOpen}
        setOpen={setIsUnbanUserDialogOpen}
        setIsLoading={setIsLoading}
        setData={setData}
      />

      <DeleteUserDialog
        data={data}
        open={isDeleteUserDialogOpen}
        setOpen={setIsDeleteUserDialogOpen}
        setIsLoading={setIsLoading}
        setData={setData}
      />
    </>
  );
}
