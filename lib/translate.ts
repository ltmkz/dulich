export async function translateText(text: string, from = "vi", to = "en"): Promise<string> {
  if (!text) return "";
  
  try {
    // Dùng MyMemory API - hoạt động ổn định trên Vercel server
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}&de=contact@dulich.local`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 }, // Cache 24h
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error("No translation returned");
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback về bản gốc nếu lỗi
  }
}
