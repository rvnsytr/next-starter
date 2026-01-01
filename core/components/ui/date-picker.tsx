"use client";

import {
  cn,
  formatDate,
  formatDDMMYY,
  parseDDMMYYYY,
  sanitizeDate,
} from "@/core/utils";
import { isSameDay } from "date-fns";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CalendarRangeIcon,
} from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { DateRange, PropsBase } from "react-day-picker";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerBaseProps = Omit<PropsBase, "mode"> & {
  invalid?: boolean;
  required?: boolean;
};

export type DatePickerProps = DatePickerBaseProps & {
  selected?: Date;
  onSelect: (value?: Date) => void;
};

export type DateMultiProps = DatePickerBaseProps & {
  selected?: Date[];
  onSelect: (value?: Date[]) => void;
};

export type DateRangeProps = DatePickerBaseProps & {
  selected?: DateRange;
  onSelect: (value?: DateRange) => void;
};

function RequiredBridge({ required }: { required?: boolean }) {
  // ? Hidden input used only to trigger the label’s `required` state
  return <Input className="hidden" disabled required={required} />;
}

export function DatePicker({
  invalid = false,
  selected,
  onSelect,
  ...props
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [strValue, setStrValue] = useState<string>("");

  const onDateSelected = useEffectEvent(() => {
    if (!selected) return setStrValue("");
    const formatted = formatDate(selected, "ddMMyyyy");
    if (formatted !== strValue) setStrValue(formatted);
  });

  useEffect(() => onDateSelected(), [selected]);

  return (
    <InputGroup>
      <InputGroupInput
        type="text"
        id={props.id}
        aria-invalid={invalid}
        required={props.required}
        placeholder="DD/MM/YYYY"
        inputMode="numeric"
        value={formatDDMMYY(strValue)}
        disabled={props.disabled === true || isPopoverOpen}
        onChange={(e) => {
          const raw = e.target.value;
          const sanitized = sanitizeDate(raw);

          setStrValue(sanitized);
          const parsed = parseDDMMYYYY(sanitized);

          if (parsed && (!selected || parsed.getTime() !== selected.getTime()))
            onSelect(parsed);
        }}
      />

      <InputGroupAddon align="inline-end">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <InputGroupButton
              size="icon-xs"
              variant={invalid ? "outline_destructive" : "outline"}
              disabled={props.disabled === true}
              className={cn(
                !selected && "text-muted-foreground",
                invalid && "border-destructive text-destructive",
              )}
            >
              <CalendarIcon />
            </InputGroupButton>
          </PopoverTrigger>

          <PopoverContent align="end" sideOffset={12} className="size-fit p-0">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={onSelect}
              defaultMonth={selected}
              {...props}
            />
          </PopoverContent>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function DateMultiPicker({
  invalid,
  selected,
  ...props
}: DateMultiProps) {
  let value = null;

  if (selected && selected.length > 0) {
    const max = 1;
    const { length } = selected;
    const dates = selected.map((date) => formatDate(date, "PPP"));

    value = dates.slice(0, max).join(", ");
    if (length > max) value += `, dan ${length - max} lainnya`;
  }

  return (
    <Popover>
      <RequiredBridge required={props.required} />
      <PopoverTrigger asChild>
        <Button
          variant={invalid ? "outline_destructive" : "outline"}
          disabled={props.disabled === true}
          className={cn(
            "justify-between",
            !selected?.length && "text-muted-foreground",
            invalid && "border-destructive text-destructive",
          )}
        >
          {value ?? "Pilih tanggal"} <CalendarDaysIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-fit p-0">
        <Calendar mode="multiple" selected={selected} {...props} />
      </PopoverContent>
    </Popover>
  );
}

export function DateRangePicker({
  invalid,
  selected,
  ...props
}: DateRangeProps) {
  let value = null;

  if (selected?.from) {
    const { from, to } = selected;
    value =
      to && !isSameDay(from, to)
        ? `${formatDate(from, "PPP")} - ${formatDate(to, "PPP")}`
        : formatDate(from, "PPP");
  }
  return (
    <Popover>
      <RequiredBridge required={props.required} />
      <PopoverTrigger asChild>
        <Button
          variant={invalid ? "outline_destructive" : "outline"}
          disabled={props.disabled === true}
          className={cn(
            "justify-between",
            !selected?.from && "text-muted-foreground",
            invalid && "border-destructive text-destructive",
          )}
        >
          {value ?? "Pilih rentang tanggal"} <CalendarRangeIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="size-fit p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={selected}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
