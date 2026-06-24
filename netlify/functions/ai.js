export default async function handler(req) {
  try {
    const { goal } = JSON.parse(req.body);

    if (!goal) {
      return new Response(
        JSON.stringify({ plan: "Brak celu 😄 wpisz masa / siła / redukcja" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer twoj klucz tutaj"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś agresywnie konkretnym trenerem personalnym. Tworzysz krótkie plany treningowe (4-6 ćwiczeń)."
          },
          {
            role: "user",
            content: `Stwórz plan treningowy dla celu: ${goal}`
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    return new Response(
      JSON.stringify({
        plan: data?.choices?.[0]?.message?.content || "Błąd AI ❌ brak odpowiedzi"
      }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ plan: "Server error ❌ coś poszło nie tak" }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
}
