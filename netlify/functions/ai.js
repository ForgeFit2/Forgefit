export default async function handler(event) {
  try {
    console.log("RAW BODY:", event.body);

    const body = JSON.parse(event.body || "{}");

    console.log("PARSED BODY:", body);

    // 🧪 NAJWAŻNIEJSZE – pokazujemy co przyszło
    return new Response(
      JSON.stringify({
        received: body,
        goal: body.goal
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
