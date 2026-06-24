export default async function handler(req) {
  return new Response(
    JSON.stringify({ plan: "KROK 1 DZIAŁA 💪" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
