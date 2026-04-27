"use client";

import { AuthSession } from "@/core/auth";
import { Button } from "@/core/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/core/components/ui/menu";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { allRoles, defaultRole, Role } from "@/shared/permission";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { updateUserRole } from "../actions";
import { roleConfig } from "../config";
import { useSession } from "../provider";
import { mutateUserDataTable } from "./user-data-table";

export function ColumnRoleMenu({
  data,
}: {
  data: Pick<AuthSession["user"], "id" | "name" | "role">;
}) {
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickHandler = (newRole: Role) => {
    const role = newRole ?? defaultRole;
    if (role === data.role)
      return toast.add({
        type: "info",
        title: messages.noChanges(`role ${data.name}`),
      });

    setIsLoading(true);
    toast.promise(updateUserRole(user.id, { userId: data.id, role }), {
      loading: { title: messages.loading },
      success: () => {
        const { label } = roleConfig[role];
        setIsLoading(false);
        mutateUserDataTable();
        return {
          title: messages.success,
          description: (
            <span>
              Role <b>{data.name}</b> berhasil diperbarui menjadi <b>{label}</b>
              .
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
    <Menu>
      <MenuTrigger
        render={
          <Button
            size="icon-xs"
            variant="ghost"
            disabled={user.id === data.id || isLoading}
          >
            <LoadingSpinner
              loading={isLoading}
              icon={{ base: <ChevronDownIcon /> }}
            />
          </Button>
        }
      />

      <MenuPopup align="start">
        {allRoles.map((item) => {
          const { label, color, icon: Icon } = roleConfig[item];
          return (
            <MenuItem
              key={item}
              style={{ "--item-color": color } as React.CSSProperties}
              className="text-(--item-color) data-highlighted:text-(--item-color)"
              onClick={() => clickHandler(item)}
              disabled={isLoading}
            >
              <Icon /> {label}
            </MenuItem>
          );
        })}
      </MenuPopup>
    </Menu>
  );
}
