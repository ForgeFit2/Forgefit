export default async function handler(event) {
  try {
    console.log("RAW BODY:", event.body);

    let body = {};

    // 🔥 KLUCZOWY FIX
    if (event.body) {
      body =
        typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body;
    }

    console.log("PARSED BODY:", body);

    const goal = body?.goal;

    // 🔥 jeśli nadal puste
    if (!goal) {
      return new Response(
        JSON.stringify({
          debug: {
            raw: event.body,
            parsed: body
          },
          plan: "Brak celu treningowego (goal)"
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        goalReceived: goal
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e.message
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
