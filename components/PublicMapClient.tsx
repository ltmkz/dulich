"use client";

import dynamic from "next/dynamic";

const PublicMap = dynamic(() => import("./PublicMap"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%", background: "#16213e", display: "flex", alignItems: "center", justifyContent: "center" }}>Đang tải bản đồ...</div>
});

export default function PublicMapClient(props: any) {
  return <PublicMap {...props} />;
}
