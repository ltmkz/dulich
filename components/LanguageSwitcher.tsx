"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "vi";

  const toggleLanguage = () => {
    const newLang = lang === "vi" ? "en" : "vi";
    const params = new URLSearchParams(searchParams.toString());
    if (newLang === "vi") {
      params.delete("lang");
    } else {
      params.set("lang", "en");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur shadow-sm font-medium gap-2 rounded-full px-4 h-10 border-slate-200"
    >
      {lang === "vi" ? (
        <>
          <span className="text-xl">🇻🇳</span> VN
        </>
      ) : (
        <>
          <span className="text-xl">🇬🇧</span> EN
        </>
      )}
    </Button>
  );
}
