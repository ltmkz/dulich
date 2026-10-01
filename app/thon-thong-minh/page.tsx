import ThonThongMinh from "@/components/ThonThongMinh";
import { Suspense } from "react";

export default function SmartVillagePage() {
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
      <ThonThongMinh />
    </Suspense>
  );
}
