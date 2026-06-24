export default async function handler(req) {
  const { goal } = JSON.parse(req.body);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-proj-liCeKSUmWqWrm"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Jesteś trenerem personalnym. Twórz krótkie plany treningowe."
        },
        {
          role: "user",
          content: `Stwórz plan treningowy dla: ${goal}`
        }
      ]
    })
  });

  const data = await response.json();

  return new Response(
    JSON.stringify({
      plan: data.choices[0].message.content
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );
}
