"use client";

import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { messages } from "../messages";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export function PasswordInput({
  startAddon = <LockKeyholeIcon />,
  withValidationList = false,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, "type"> & {
  startAddon?: React.ReactNode;
  withValidationList?: boolean;
}) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<string>("");

  const { lowercase, uppercase, number, character } = messages.password;
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const regexes = [
    { regex: /[a-z]/, text: lowercase },
    { regex: /[A-Z]/, text: uppercase },
    { regex: /[0-9]/, text: number },
    { regex: /[^A-Za-z0-9]/, text: character },
  ];

  return (
    <div className="flex w-full flex-col items-start gap-2">
      <InputGroup data-slot="password-input">
        <InputGroupInput
          type={isVisible ? "text" : "password"}
          value={currentValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />

        <InputGroupAddon>{startAddon}</InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <Button
            size="icon-xs"
            variant="outline"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>

      {withValidationList && (
        <div
          data-slot="password-validation"
          className="flex flex-col items-start gap-1"
        >
          <span
            data-slot="password-validation-label"
            className="text-muted-foreground text-xs"
          >
            Kata sandi harus berisi:
          </span>

          <ul data-slot="password-validation-list" className="grid gap-y-1">
            {regexes.map(({ regex, text }) => {
              const isValid = regex.test(String(currentValue));
              const Icon = isValid ? CheckIcon : XIcon;
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
                  <small className="text-xs">{text}</small>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
