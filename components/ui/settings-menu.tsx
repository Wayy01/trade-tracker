"use client";

import { Menu } from "@base-ui/react/menu";
import { LogOut, Settings } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { cn } from "@/lib/utils";

export function SettingsMenu({ className }: { className?: string }) {
  const { signOut } = useAuthActions();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Settings"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground/80 transition hover:text-foreground active:scale-95",
          className,
        )}
      >
        <Settings className="h-4 w-4" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={6}>
          <Menu.Popup
            className={cn(
              "z-50 min-w-44 overflow-hidden rounded-xl border border-border/80 bg-popover p-1 text-sm text-popover-foreground shadow-xl shadow-black/40 outline-none",
              "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            )}
          >
            <Menu.Item
              onClick={() => signOut()}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-foreground/90 outline-none transition data-highlighted:bg-loss/10 data-highlighted:text-loss"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
