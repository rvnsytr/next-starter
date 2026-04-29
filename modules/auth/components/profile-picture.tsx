"use client";

import { AuthSession } from "@/core/auth";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Button } from "@/core/components/ui/button";
import { Label } from "@/core/components/ui/label";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { useFileUpload } from "@/core/hooks/use-file-upload";
import { messages } from "@/core/messages";
import { fileTypeConfig } from "@/shared/file-type";
import { TriangleAlertIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { deleteProfilePicture, updateProfilePicture } from "../actions";

export function ProfilePicture({
  user,
}: {
  user: Pick<AuthSession["user"], "id" | "name" | "image">;
}) {
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isRemoved, setIsRemoved] = useState<boolean>(false);
  const {
    openFileDialog,
    getInputProps,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useFileUpload({
    ...fileTypeConfig.image,
    onFilesChange: async (files) => {
      if (!files.length) return;
      const file = files[0].file;

      if (file instanceof File && !isChange) {
        setIsChange(true);
        toast.promise(
          updateProfilePicture(user.id, file).then((res) => {
            if (!res.status) throw res;
            return res;
          }),
          {
            loading: { title: messages.loading },
            success: () => {
              setIsChange(false);
              return { title: "Foto profil berhasil diperbarui." };
            },
            error: (e) => {
              setIsChange(false);
              return { title: messages.error, description: e.message };
            },
          },
        );
      }
    },
  });

  const deleteHandler = () => {
    if (!user.image)
      return toast.add({
        type: "info",
        title: messages.noChanges("foto profil"),
      });

    setIsRemoved(true);
    toast.promise(
      deleteProfilePicture(user.id).then((res) => {
        if (!res.status) throw res;
        return res;
      }),
      {
        loading: { title: messages.loading },
        success: () => {
          setIsRemoved(false);
          return { title: "Foto profil berhasil dihapus." };
        },
        error: (e) => {
          setIsRemoved(false);
          return { title: messages.error, description: e.message };
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-4">
      <input {...getInputProps()} className="sr-only" />

      <Avatar
        tabIndex={0}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        radius="lg"
        className="size-20 cursor-pointer"
      >
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-y-2">
        <Label>Foto profil</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={isChange || isRemoved}
            onClick={openFileDialog}
          >
            <LoadingSpinner
              loading={isChange}
              icon={{ base: <UploadIcon /> }}
            />
            {messages.actions.upload}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant="destructive-outline"
                  disabled={!user.image || isChange || isRemoved}
                >
                  <LoadingSpinner loading={isRemoved} />
                  {messages.actions.delete}
                </Button>
              }
            />

            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <TriangleAlertIcon /> Hapus Foto Profil
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah kamu yakin ingin menghapus foto profil ini? Tindakan
                  ini dapat dibatalkan dengan mengunggah foto baru.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogClose
                  render={
                    <Button variant="ghost">{messages.actions.cancel}</Button>
                  }
                />
                <AlertDialogClose
                  render={
                    <Button variant="destructive" onClick={deleteHandler}>
                      {messages.actions.confirm}
                    </Button>
                  }
                />
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
