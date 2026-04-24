"use client";

import { Button, ResetButton } from "@/core/components/ui/button";
import { CardContent, CardFooter } from "@/core/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/core/components/ui/field";
import { Form } from "@/core/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { LoadingSpinner } from "@/core/components/ui/spinner";
import { toast } from "@/core/components/ui/toast";
import { messages } from "@/core/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, SaveIcon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { updateProfileName } from "../actions";
import { useAuth } from "../provider";
import { userSchema } from "../schema";
import { ProfilePicture } from "./profile-picture";

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  type FormSchema = z.infer<typeof formSchema>;
  const formSchema = userSchema.pick({ name: true, email: true });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: user,
  });

  const formHandler = ({ name }: FormSchema) => {
    if (name === user.name)
      return toast.add({
        type: "info",
        title: messages.noChanges("profil Anda"),
      });

    setIsLoading(true);
    toast.promise(updateProfileName(name), {
      loading: { title: messages.loading },
      success: () => {
        setIsLoading(false);
        return { title: "Profil Anda berhasil diperbarui." };
      },
      error: (e) => {
        setIsLoading(false);
        return { title: e.message };
      },
    });
  };

  return (
    <Form onSubmit={form.handleSubmit(formHandler)}>
      <CardContent>
        <ProfilePicture user={user} />

        <div className="grid gap-x-2 gap-y-4 lg:grid-cols-2">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>Alamat email</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="email"
                    placeholder="Masukan email anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <MailIcon />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field name={field.name} invalid={fieldState.invalid}>
                <FieldLabel>Nama</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    placeholder="Masukan nama anda"
                    required
                    {...field}
                  />
                  <InputGroupAddon>
                    <UserRoundIcon />
                  </InputGroupAddon>
                </InputGroup>
                <FieldError error={fieldState.error} />
              </Field>
            )}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={isLoading}>
          <LoadingSpinner loading={isLoading} icon={{ base: <SaveIcon /> }} />
          {messages.actions.update}
        </Button>
        <ResetButton onClick={() => form.reset(user)} />
      </CardFooter>
    </Form>
  );
}
