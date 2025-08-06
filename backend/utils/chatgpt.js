const { OpenAI } = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function chatWithGPT(messages) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 0.7
  })

  return response.choices[0].message.content
}

module.exports = chatWithGPT
