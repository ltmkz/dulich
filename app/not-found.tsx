import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "80px" }}>🏛️</div>
      <h1 style={{ fontSize: "32px", fontWeight: 800 }} className="gradient-text">
        404 - Không Tìm Thấy
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "400px" }}>
        Điểm di tích hoặc trang bạn tìm kiếm không tồn tại hoặc đã bị gỡ.
      </p>
      <Link href="/">
        <button className="btn-primary" style={{ marginTop: "8px" }}>
          🏠 Về Trang Chủ
        </button>
      </Link>
    </main>
  );
}
