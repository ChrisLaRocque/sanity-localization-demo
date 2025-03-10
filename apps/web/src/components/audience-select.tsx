"use client";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { CheckIcon } from "@heroicons/react/24/solid";
import { cn as clsx } from "@workspace/ui/lib/utils";

import { useAudience } from "./audience-provider";

const AudienceSelect = () => {
  const { audience, setAudience } = useAudience();
  const [isPending, startTransition] = useTransition();
  const items = [
    { value: "retail", label: "Retail" },
    { value: "professional", label: "Professional" },
  ];

  return (
    <Select
      value={audience || ""}
      onValueChange={(value) => {
        startTransition(() => {
          setAudience(value as "retail" | "professional" | null);
        });
      }}
    >
      <SelectTrigger
        aria-label="Audience"
        className={clsx(
          "rounded-sm p-2 transition-colors hover:bg-slate-200",
          isPending && "pointer-events-none opacity-60",
        )}
      >
        <SelectValue placeholder="Select an audience" />
      </SelectTrigger>
      <SelectContent
        align="end"
        className="min-w-[8rem] overflow-hidden rounded-sm bg-white py-1 shadow-md"
        position="popper"
      >
        {items.map((item) => (
          <SelectItem
            key={item.value}
            className="block w-full cursor-default items-center px-3 py-2 text-base data-[highlighted]:bg-slate-100"
            value={item.value}
          >
            <div className="flex flex-col">
              {/* <div className="mr-2 w-[1rem]">
                {item.value === audience && (
                  <CheckIcon className="h-5 w-5 text-slate-600" />
                )}
              </div> */}
              <span className="text-slate-900">{item.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AudienceSelect;
