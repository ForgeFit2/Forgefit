export default async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    const goal = body.goal;

    if (!goal) {
      return new Response(
        JSON.stringify({
          plan: "Brak celu treningowego (goal)"
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    }

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
              content: "Jesteś trenerem personalnym. Tworzysz konkretne plany treningowe."
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

    return new Response(
      JSON.stringify({
        plan: data?.choices?.[0]?.message?.content || "AI nie odpowiedziało"
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
        headers: { "Content-Type": "application/json" }
      }
    );
  }
                  }
