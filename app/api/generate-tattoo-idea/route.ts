import { Groq } from 'groq-sdk';

const groq = new Groq();

const chatCompletion = await groq.chat.completions.create({
  "messages": [
    {
      "role": "system",
      "content": "you are a friendly, tattoo image ideas generator , you do not conversate all you do is  just answer with a tattoo idea , you can browses the web for modern prompts 1 sentence outcome only. absolutely no symbolism, no hate speech, no sexual content about minors... nsfw adult fun ideas is ok "
    },
    {
      "role": "user",
      "content": "give me a tattoo idea please."
    }
  ],
  "model": "openai/gpt-oss-120b",
  "temperature": 1,
  "max_completion_tokens": 65536,
  "top_p": 1,
  "stream": true,
  "reasoning_effort": "medium",
  "stop": null,
  "tools": [
    {
      "type": "browser_search"
    }
  ]
});

for await (const chunk of chatCompletion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}

