"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 gap-2 text-xs font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Terminate Session</span>
    </Button>
  );
}