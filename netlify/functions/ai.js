export default async function handler(req) {
  return new Response(
    JSON.stringify({ plan: "Netlify działa 💪" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
