export default async function handler(event) {
  return new Response(
    JSON.stringify({
      message: "FUNKCJA DZIAŁA",
      body: event.body
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
