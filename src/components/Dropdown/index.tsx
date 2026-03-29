"use client";

import React from "react";
import * as RadixDropdown from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  onClick?: () => void;
  /** Nested submenu items */
  submenu?: DropdownItem[];
}

export interface DropdownSection {
  label?: string;
  items: DropdownItem[];
}

const itemClass = (danger?: boolean, disabled?: boolean) =>
  [
    "flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer select-none outline-none transition-colors",
    danger
      ? "text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
      : "text-ink dark:text-canvas focus:bg-gray-100 dark:focus:bg-gray-700",
    disabled && "opacity-40 pointer-events-none",
  ]
    .filter(Boolean)
    .join(" ");

const MenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixDropdown.Content>
>((props, ref) => (
  <RadixDropdown.Content ref={ref} {...props} asChild>
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="z-50 min-w-[14rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 focus:outline-none"
    >
      {props.children}
    </motion.div>
  </RadixDropdown.Content>
));
MenuContent.displayName = "MenuContent";

const RenderItem: React.FC<{ item: DropdownItem }> = ({ item }) => {
  if (item.submenu) {
    return (
      <RadixDropdown.Sub>
        <RadixDropdown.SubTrigger
          disabled={item.disabled}
          className={itemClass(item.danger, item.disabled) + " justify-between"}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="shrink-0 text-gray-400">{item.icon}</span>}
            {item.label}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        </RadixDropdown.SubTrigger>
        <RadixDropdown.Portal>
          <RadixDropdown.SubContent asChild sideOffset={4}>
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.13 }}
              className="z-50 min-w-[12rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1 focus:outline-none"
            >
              {item.submenu.map((sub) => (
                <RenderItem key={sub.id} item={sub} />
              ))}
            </motion.div>
          </RadixDropdown.SubContent>
        </RadixDropdown.Portal>
      </RadixDropdown.Sub>
    );
  }

  return (
    <RadixDropdown.Item
      disabled={item.disabled}
      onSelect={item.onClick}
      className={itemClass(item.danger, item.disabled)}
    >
      {item.icon && <span className="shrink-0 text-gray-400">{item.icon}</span>}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <span className="text-xs text-gray-400 ml-auto">{item.shortcut}</span>
      )}
    </RadixDropdown.Item>
  );
};

export interface DropdownProps {
  trigger: React.ReactNode;
  sections: DropdownSection[];
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  sections,
  side = "bottom",
  align = "start",
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <RadixDropdown.Root open={open} onOpenChange={setOpen}>
      <RadixDropdown.Trigger asChild>{trigger}</RadixDropdown.Trigger>
      <RadixDropdown.Portal>
        <AnimatePresence>
          {open && (
            <MenuContent side={side} align={align} sideOffset={6}>
              {sections.map((section, si) => (
                <React.Fragment key={si}>
                  {si > 0 && (
                    <RadixDropdown.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  )}
                  {section.label && (
                    <RadixDropdown.Label className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.label}
                    </RadixDropdown.Label>
                  )}
                  {section.items.map((item) => (
                    <RenderItem key={item.id} item={item} />
                  ))}
                </React.Fragment>
              ))}
            </MenuContent>
          )}
        </AnimatePresence>
      </RadixDropdown.Portal>
    </RadixDropdown.Root>
  );
};
