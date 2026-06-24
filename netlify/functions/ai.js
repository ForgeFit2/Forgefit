export default async function handler(req) {
  try {
    const { goal } = JSON.parse(req.body);

    if (!goal) {
      return new Response(
        JSON.stringify({ plan: "Wpisz cel: masa / siła / redukcja 💪" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

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
            content: "Jesteś brutalnie konkretnym trenerem personalnym. Dawaj krótkie plany (4-6 ćwiczeń)."
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
        plan: data?.choices?.[0]?.message?.content || "Błąd AI ❌"
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ plan: "Server error ❌" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
