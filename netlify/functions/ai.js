export default async function handler(event) {
  try {
    // 🔧 Bezpieczne parsowanie danych z frontu
    const body = JSON.parse(event.body || "{}");
    const goal = body.goal;

    // 🧠 Walidacja danych
    if (!goal) {
      return new Response(
        JSON.stringify({ plan: "Brak celu treningowego (goal)" }),
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
                "Jesteś profesjonalnym trenerem personalnym. Tworzysz krótkie, konkretne plany treningowe."
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

    // ❗ Obsługa błędów OpenAI
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

    // ✅ Sukces
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
    // 💀 Fallback error
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
