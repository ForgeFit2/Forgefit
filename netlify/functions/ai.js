export default async function handler(req) {
  try {
    const { goal } = JSON.parse(req.body);

    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś trenerem personalnym. Dawaj krótkie plany treningowe."
          },
          {
            role: "user",
            content: `Cel użytkownika: ${goal}`
          }
        ]
      })
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        plan: data?.choices?.[0]?.message?.content || "Brak odpowiedzi AI ❌"
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ plan: "SERVER ERROR ❌" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
