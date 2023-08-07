/**
 * This is a copy of the rabbit function — to compare execution time with the version that uses autometrics
 */
import { Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from the invisible rabbit function!");

// Create a handler that will automatically record metrics for each function invocation
const handler: Handler = rabbitHandler;

// Serve our edge function
serve(handler);

/**
 * The handler for our edge function
 */
async function rabbitHandler(req: Request): Promise<Response> {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const data = {
    message: await getRabbit(),
  };

  await new Promise((resolve) => setTimeout(resolve, 50));

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

const getRabbit = async function getRabbit() {
  // HACK - This is just to simulate latency
  await new Promise((resolve) => setTimeout(resolve, 10));
  return Promise.resolve("🐇");
};
