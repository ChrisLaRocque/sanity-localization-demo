"use client";

import { CheckIcon, LanguageIcon } from "@heroicons/react/24/solid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn as clsx } from "@workspace/ui/lib/utils";
import { useTransition } from "react";

import type { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="relative">
      <Select defaultValue={defaultValue} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className={clsx(
            "rounded-sm p-2 transition-colors hover:bg-slate-200",
            isPending && "pointer-events-none opacity-60",
          )}
        >
          <SelectValue
            placeholder={
              <LanguageIcon className="h-6 w-6 text-slate-600 transition-colors group-hover:text-slate-900" />
            }
          />
        </SelectTrigger>

        <SelectContent
          align="end"
          className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md"
          position="popper"
        >
          {items.map((item) => (
            <SelectItem
              key={item.value}
              className="flex cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
              value={item.value}
            >
              <span className="text-slate-900">{item.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
