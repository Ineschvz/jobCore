export async function GET() {
  return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
//function to check if the api is up and running 
//this is a simple healthcheck route that returns a json object with ok: true 

