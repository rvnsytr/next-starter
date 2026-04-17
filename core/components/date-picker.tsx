"use client";

import { isSameDay } from "date-fns";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CalendarRangeIcon,
} from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { DateRange, PropsBase } from "react-day-picker";
import {
  cn,
  formatDDMMYY,
  formatLocalizedDate,
  parseDDMMYYYY,
  sanitizeDateStr,
} from "../utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Label } from "./ui/label";
import { Popover, PopoverPopup, PopoverTrigger } from "./ui/popover";

export type DatePickerBaseProps = Omit<PropsBase, "mode"> & {
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

export function DatePicker({ selected, onSelect, ...props }: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const [strValue, setStrValue] = useState<string>("");

  const onDateSelected = useEffectEvent(() => {
    if (!selected) return setStrValue("");
    const formatted = formatLocalizedDate(selected, "ddMMyyyy");
    if (formatted !== strValue) setStrValue(formatted);
  });

  useEffect(() => onDateSelected(), [selected]);

  return (
    <InputGroup>
      <InputGroupInput
        id={props.id}
        type="text"
        placeholder="dd/mm/yyyy"
        inputMode="numeric"
        required={props.required}
        disabled={props.disabled === true || isPopoverOpen}
        value={formatDDMMYY(strValue)}
        onChange={(e) => {
          const raw = e.target.value;
          const sanitized = sanitizeDateStr(raw);

          setStrValue(sanitized);
          const parsed = parseDDMMYYYY(sanitized);

          if (parsed && parsed.getTime() !== selected?.getTime())
            onSelect(parsed);
        }}
      />

      <InputGroupAddon
        align="block-end"
        className="flex items-center justify-between"
      >
        <Label
          data-slot="date-picker-label"
          className="group-invalid/field:text-destructive text-muted-foreground text-xs"
        >
          {selected ? formatLocalizedDate(selected, "PPPP") : "-"}
        </Label>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger
            render={
              <Button
                data-slot="date-picker-trigger"
                size="icon-xs"
                variant="ghost"
                disabled={props.disabled === true}
                className={cn(!selected && "text-muted-foreground")}
              >
                <CalendarIcon />
              </Button>
            }
          />

          <PopoverPopup
            align="end"
            sideOffset={12}
            alignOffset={-12}
            className="size-fit p-0"
          >
            <Calendar
              mode="single"
              selected={selected}
              onSelect={onSelect}
              defaultMonth={selected}
              {...props}
            />
          </PopoverPopup>
        </Popover>
      </InputGroupAddon>
    </InputGroup>
  );
}

export function DateMultiPicker({
  className,
  selected,
  ...props
}: DateMultiProps) {
  let value: string | null = null;

  if (selected && selected.length > 0) {
    const max = 1;
    const { length } = selected;
    const dates = selected.map((date) => formatLocalizedDate(date, "PPP"));

    value = dates.slice(0, max).join(", ");
    if (length > max) value += `, dan ${length - max} lainnya`;
  }

  return (
    <Popover>
      <RequiredBridge required={props.required} />
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={props.disabled === true}
            className={cn(
              "justify-between",
              !selected?.length && "text-muted-foreground",
              className,
            )}
          >
            {value ?? "Pilih tanggal"} <CalendarDaysIcon />
          </Button>
        }
      />

      <PopoverPopup align="end" className="size-fit p-0">
        <Calendar mode="multiple" selected={selected} {...props} />
      </PopoverPopup>
    </Popover>
  );
}

export function DateRangePicker({
  className,
  selected,
  ...props
}: DateRangeProps) {
  let value: string | null = null;

  if (selected?.from) {
    const { from, to } = selected;
    value =
      to && !isSameDay(from, to)
        ? `${formatLocalizedDate(from, "PPP")} - ${formatLocalizedDate(to, "PPP")}`
        : formatLocalizedDate(from, "PPP");
  }

  return (
    <Popover>
      <RequiredBridge required={props.required} />
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            disabled={props.disabled === true}
            className={cn(
              "justify-between",
              !selected?.from && "text-muted-foreground",
              className,
            )}
          >
            {value ?? "Pilih rentang tanggal"} <CalendarRangeIcon />
          </Button>
        }
      />

      <PopoverPopup align="end" className="size-fit p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={selected}
          {...props}
        />
      </PopoverPopup>
    </Popover>
  );
}
