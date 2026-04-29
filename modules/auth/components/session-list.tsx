"use client";

import { AuthSession } from "@/core/auth";
import { authClient } from "@/core/auth-client";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog";
import { Button } from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { DetailList, DetailListData } from "@/core/components/ui/detail-list";
import { ErrorFallback, LoadingFallback } from "@/core/components/ui/fallback";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/core/components/ui/item";
import { Separator } from "@/core/components/ui/separator";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { cn } from "@/core/utils";
import {
  ChevronsUpDownIcon,
  Gamepad2Icon,
  MonitorDotIcon,
  MonitorIcon,
  MonitorOffIcon,
  ShieldBanIcon,
  SmartphoneIcon,
  TabletIcon,
  TvMinimalIcon,
} from "lucide-react";
import { useState } from "react";
import { UAParser, UAParserProps } from "ua-parser-js";
import {
  mutateListSessions,
  useListSessions,
} from "../hooks/use-list-sessions";
import { useListUserSessions } from "../hooks/use-list-user-sessions";
import { useSession } from "../hooks/use-session";
import { ImpersonateUserBadge } from "./impersonate-user-badge";

export function SessionList() {
  const { data, error, isLoading } = useListSessions();
  if (error) return <ErrorFallback error={error} />;
  if (!data && isLoading) return <LoadingFallback />;
  return <SessionListCollapsible data={data ?? []} />;
}

export function UserDetailSessionList({
  data: user,
}: {
  data: Pick<AuthSession["user"], "id" | "name">;
}) {
  const { data, error, isLoading } = useListUserSessions(user.id);
  if (error) return <ErrorFallback error={error} />;
  if (!data && isLoading) return <LoadingFallback />;
  return <SessionListCollapsible name={user.name} data={data ?? []} />;
}

export function SessionListCollapsible({
  name,
  data,
}: {
  name?: string;
  data: AuthSession["session"][];
}) {
  const { session } = useSession();
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
    wearable: MonitorDotIcon,
    xr: MonitorDotIcon,
    embedded: MonitorDotIcon,
    other: MonitorDotIcon,
  };

  const sections: { label: string; key: UAParserProps }[] = [
    { label: "Browser", key: "browser" },
    { label: "CPU", key: "cpu" },
    { label: "Device", key: "device" },
    { label: "Engine", key: "engine" },
    { label: "Operating System", key: "os" },
  ];

  const clickHandler = ({ id, token }: AuthSession["session"]) => {
    setRevokingSession(id);

    toast.promise(
      authClient.revokeSession({ token }).then((res) => {
        if (res.error) throw res.error;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setRevokingSession(null);
          mutateListSessions();
          return { title: "Sesi berhasil diakhiri." };
        },
        error: (e) => {
          setRevokingSession(null);
          return { title: messages.error, description: e.message };
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
            { label: "Alamat IP", content: s.ipAddress ?? undefined },
            { label: "User Agent", content: userAgent?.ua },
          ];

          const detailList: DetailListData = sections.map(({ label, key }) => ({
            label,
            content: userAgent?.[key]
              ? Object.entries(userAgent[key]).map(([label, content]) => ({
                  label,
                  content,
                }))
              : undefined,
          }));

          return (
            <Collapsible key={s.id}>
              <Item variant="outline">
                <ItemMedia variant="icon">
                  <DeviceIcon />
                </ItemMedia>

                <ItemContent>
                  <ItemTitle>{`${osName} - ${browserName}`}</ItemTitle>
                  <ItemDescription
                    className={cn(
                      "line-clamp-1",
                      isCurrentSession
                        ? "text-success-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {isCurrentSession
                      ? "Sesi saat ini"
                      : messages.thingAgo("Terakhir terlihat", s.updatedAt)}
                  </ItemDescription>
                </ItemContent>

                <ItemActions>
                  <ImpersonateUserBadge impersonating={!!s.impersonatedBy} />

                  <ButtonGroup>
                    {!isCurrentSession && s.token && (
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              size="icon-sm"
                              variant="outline"
                              disabled={isLoading}
                              className="grow lg:grow-0"
                            >
                              <LoadingSpinner
                                loading={isLoading}
                                icon={{ base: <MonitorOffIcon /> }}
                              />
                            </Button>
                          }
                        />

                        <AlertDialogPopup>
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
                            <AlertDialogClose
                              render={
                                <Button variant="ghost">
                                  {messages.actions.cancel}
                                </Button>
                              }
                            />
                            <AlertDialogClose
                              render={
                                <Button
                                  variant="destructive"
                                  onClick={() => clickHandler(s)}
                                  autoFocus
                                >
                                  {messages.actions.confirm}
                                </Button>
                              }
                            />
                          </AlertDialogFooter>
                        </AlertDialogPopup>
                      </AlertDialog>
                    )}

                    <CollapsibleTrigger
                      render={
                        <Button size="icon-sm" variant="outline">
                          <ChevronsUpDownIcon />
                        </Button>
                      }
                    />
                  </ButtonGroup>
                </ItemActions>
              </Item>

              <CollapsiblePanel
                className="mt-2 grid gap-y-2"
                render={<Item variant="outline" />}
              >
                <div className="grid gap-2 px-2">
                  <DetailList data={infoList} />
                </div>

                <Separator />

                <div className="grid gap-2 px-2 lg:grid-cols-2">
                  <DetailList data={detailList} />
                </div>
              </CollapsiblePanel>
            </Collapsible>
          );
        })}
    </div>
  );
}
