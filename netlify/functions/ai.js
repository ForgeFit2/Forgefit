export default async function handler(req) {
  try {
    const { goal } = JSON.parse(req.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-WKLEJ_TUTAJ_KLUCZ"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś trenerem personalnym."
          },
          {
            role: "user",
            content: `Zrób plan dla: ${goal}`
          }
        ]
      })
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({
        plan: data?.choices?.[0]?.message?.content || "AI nie odpowiedziało"
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ plan: "server error ❌" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
