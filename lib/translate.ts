export async function translateText(text: string, from = "vi", to = "en"): Promise<string> {
  if (!text) return "";
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    
    // The translated text is broken down into sentences in the first array
    let translated = "";
    if (data && data[0]) {
      data[0].forEach((item: any) => {
        if (item[0]) translated += item[0];
      });
    }
    
    return translated || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text if translation fails
  }
}
