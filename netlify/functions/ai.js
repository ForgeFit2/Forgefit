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
        "Authorization": "Bearer sk-proj-liCeKSUmWqWrm"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Jesteś trenerem personalnym. Tworzysz krótkie, konkretne plany treningowe."
          },
          {
            role: "user",
            content: `Stwórz plan treningowy dla celu: ${goal}. Podaj 4-6 ćwiczeń.`
          }
        ]
      })
    });

    const data = await response.json();

    // 🔥 DEBUG (jeśli coś się zepsuje)
    console.log("OPENAI RESPONSE:", data);

    if (!data.choices || !data.choices[0]) {
      return new Response(
        JSON.stringify({ plan: "Błąd AI ❌ sprawdź klucz API lub limit" }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        plan: data.choices[0].message.content
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
