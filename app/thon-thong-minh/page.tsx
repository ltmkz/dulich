import ThonThongMinh from "@/components/ThonThongMinh";

export default function SmartVillagePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const khuVuc = typeof searchParams['khuVuc'] === 'string' ? searchParams['khuVuc'] : "Ngõ 171 Lê Duẩn";
  return <ThonThongMinh khuVuc={khuVuc} />;
}
