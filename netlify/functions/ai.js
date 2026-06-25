    export default async function handler(event) {
  try {
    // 🧠 Bezpieczne odczytanie danych z frontu (Netlify bywa różne)
    let body = {};

    try {
      body =
        typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body || {};
    } catch (e) {
      body = {};
    }

    const goal = body.goal;

    // ❗ brak danych z frontu
    if (!goal) {
      return new Response(
        JSON.stringify({
          plan: "Brak celu treningowego (goal)"
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    // 🤖 OpenAI request
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Jesteś profesjonalnym trenerem personalnym. Tworzysz konkretne, krótkie i skuteczne plany treningowe."
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

    // ❗ błąd OpenAI
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

    // ✅ sukces
    return new Response(
      JSON.stringify({
        plan:
          data?.choices?.[0]?.message?.content ||
          "AI nie zwróciło odpowiedzi"
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    // 💀 fallback
    return new Response(
      JSON.stringify({
        plan: "Server error ❌ " + e.message
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
    }
