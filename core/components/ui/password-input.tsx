"use client";

import { messages } from "@/core/constants";
import { cn } from "@/core/utils";
import { Check, Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useState } from "react";
import { FieldDescription } from "./field";
import { InputProps } from "./input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";

export function PasswordInput({
  icon,
  withList = false,
  value,
  ...props
}: Omit<InputProps, "type"> & { icon?: React.ReactNode; withList?: boolean }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { lowercase, uppercase, number, character } = messages.password;

  const regexes = [
    { regex: /[a-z]/, text: lowercase },
    { regex: /[A-Z]/, text: uppercase },
    { regex: /[0-9]/, text: number },
    { regex: /[^A-Za-z0-9]/, text: character },
  ];

  return (
    <>
      <InputGroup>
        <InputGroupInput
          type={isVisible ? "text" : "password"}
          value={value}
          {...props}
        />

        <InputGroupAddon>{icon ?? <LockKeyhole />}</InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      {withList && (
        <div className="space-y-1">
          <FieldDescription>Kata sandi harus berisi:</FieldDescription>

          <ul className="space-y-1">
            {regexes.map(({ regex, text }) => {
              const isValid = regex.test(String(value));
              const Icon = isValid ? Check : X;
              return (
                <li
                  key={String(regex)}
                  className="text-muted-foreground flex items-center gap-2"
                >
                  <Icon
                    className={cn(
                      "size-4",
                      isValid ? "text-success" : "text-destructive",
                    )}
                  />
                  <small>{text}</small>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
