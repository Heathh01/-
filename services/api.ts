import { ApiConfig } from "../types";
import { cleanJson } from "../utils";

export const callAI = async (apiConfig: ApiConfig, systemPrompt: string, userPrompt: string, jsonMode = true) => {
  if (!apiConfig.apiKey) {
    console.log("No API Key, using mock data mode.");
    return null; 
  }
  try {
    let responseData;
    if (apiConfig.provider === 'gemini') {
      const url = `${apiConfig.baseUrl}/${apiConfig.model}:generateContent?key=${apiConfig.apiKey}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: jsonMode ? "application/json" : "text/plain" }
      };
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No content generated");
      responseData = jsonMode ? JSON.parse(cleanJson(text) || "{}") : text;
    } else {
      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiConfig.apiKey}` },
        body: JSON.stringify({
          model: apiConfig.model,
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
          temperature: 0.7,
          response_format: jsonMode ? { type: "json_object" } : undefined
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const content = data.choices[0].message.content;
      responseData = jsonMode ? JSON.parse(cleanJson(content) || "{}") : content;
    }
    return responseData;
  } catch (error: any) {
    alert(`API 调用失败: ${error.message}\n请检查“API 设置”中的 Key 是否正确。`);
    throw error;
  }
};
