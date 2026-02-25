import OpenAI from "openai";


const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

export const generateInsights = async (financialData) => {
  const response = await client.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      {
        role: "system",
        content: `
You are a financial analyst for small businesses.
Analyze the financials and return:
- Health: Healthy, Stable, At Risk
- 1-3 practical recommendations
- Return output in JSON format
`
      },
      {
        role: "user",
        content: `Here are the business financials:\n${financialData}`
      }
    ],
    max_tokens: 300
  });

  return response.choices[0].message.content;
};
