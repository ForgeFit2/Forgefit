export default async function handler(req) {
  try {
    // Netlify czasem daje string, czasem obiekt
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { goal } = body || {};

    if (!goal) {
      return new Response(
        JSON.stringify({ plan: "Brak celu treningowego (goal)" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Jesteś profesjonalnym trenerem personalnym. Tworzysz konkretne, krótkie plany treningowe."
            },
            {
              role: "user",
              content: `Zrób plan treningowy dla celu: ${goal}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          plan: `Błąd OpenAI: ${data.error?.message || "Nieznany błąd"}`
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    return new Response(
      JSON.stringify({
        plan:
          data?.choices?.[0]?.message?.content ||
          "AI nie zwróciło odpowiedzi"
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        plan: `Server error: ${e.message}`
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
}
