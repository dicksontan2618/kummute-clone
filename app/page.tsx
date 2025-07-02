import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function Home() {
  return (
    <div className="flex h-full justify-center items-center bg-[#1eb0e6]">
      <LoginForm />
    </div>
  );
}
