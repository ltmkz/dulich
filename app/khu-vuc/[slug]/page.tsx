import ThonThongMinh from "@/components/ThonThongMinh";
import { Suspense } from "react";

export default async function KhuVucSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  // In Next.js 15, params is asynchronous, so we must await it or pass it safely.
  // Wait, if it's asynchronous, we should await it if we use it directly.
  // Since this is a server component, we can await params.
  const { slug } = await params;
  return (
    <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">Loading...</div>}>
      <ThonThongMinh slugKhuVuc={slug} />
    </Suspense>
  );
}
