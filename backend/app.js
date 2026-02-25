import OpenAI from "openai";
import express from "express"
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json())

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: "process.env.HF_TOKEN",
});

const messages = [
  { role: "system", content: "You reply in short sentences." }
];


app.get("/", async(req, res)=>{
    res.status(200).json({message:"welcome to botworld"})

});
app.post('/ask',async(req,res)=>{
const  {prompt} = req.body;

if(!prompt){
  return  res.status(404).json({message:"empty prompt"})
}

 const response =  await sendMessage( prompt);
res.status(200).json({message:response})

});



app.listen(2000,()=>{
    console.log("server running on port 2000")
})



async function sendMessage(text) {
  messages.push({ role: "user", content: text });

  const res = await client.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages,
    max_tokens: 150
  });

  const reply = res.choices[0].message.content;

  messages.push({ role: "assistant", content: reply });

return reply
}
async function generateInsights(financialData) {

  const response = await client.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      {
        role: "system",
        content: "You are a financial analyst for SMEs. Give clear structured insights."
      },
      {
        role: "user",
        content: `Here are the business financials:\n${financialData}`
      }
    ],
    max_tokens: 300
  });

  return response.choices[0].message.content;
}
