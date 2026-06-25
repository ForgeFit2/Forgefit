export default async function handler(event) {
  try {
    // 🔍 DEBUG: co naprawdę przyszło z frontu
    console.log("RAW EVENT BODY:", event.body);

    let body = {};

    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      console.log("JSON PARSE ERROR:", e.message);
      body = {};
    }

    console.log("PARSED BODY:", body);

    const goal = body.goal;

    console.log("GOAL:", goal);

    // ❗ brak danych
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

    // 🤖 OPENAI
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
              content: "Jesteś trenerem personalnym."
            },
            {
              role: "user",
              content: `Zrób plan dla celu: ${goal}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    return new Response(
      JSON.stringify({
        plan:
          data?.choices?.[0]?.message?.content ||
          "AI nie odpowiedziało"
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
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
