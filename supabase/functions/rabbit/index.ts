import { Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { autometrics, init } from "../_shared/deps.ts";

import { corsHeaders } from "../_shared/cors.ts";
import { ANIMAL_OBJECTIVE } from "../_shared/metrics.ts";

console.log("Hello from the rabbit function!");

// NOTE - You need to add job/rabbit to the push gateway URL if you want to use buildInfo
const PUSH_GATEWAY = Deno.env.get("AM_PUSH_GATEWAY") + "/job/rabbit";

init({
  // TODO - figure out proper way to set build info in aggregation context
  buildInfo: {
    commit: "4a1bc7e",
    version: "0.0.2",
    branch: "main",
    clearmode: "family",
  },
  pushGateway: PUSH_GATEWAY,
  // NOTE - The current version of autometrics knows that this means to eagerly push metrics upon completion
  pushInterval: 0,
});

// TODO - Create metricsDefinition object from a utility function,
//        so we don't have to repeat ourselves in every edge function
//
// Define the labels and objectives we want to use for our metrics
// Also define a function that will determine whether a given response should count as an error in our metrics
const metricsDefinition = {
  // Explicitly declare the function name to be the same as our edge function
  functionName: "rabbit",
  // Explicitly declare the module name to be the same as our supabase project name
  moduleName: "animalbuttons",
  // Add this edge function to a Service-Level Objective (SLO),
  // so we can view its metrics alongside those of our other functions.
  objective: ANIMAL_OBJECTIVE,
  // NOTE: We may want to be more specific about which status codes should count as errors
  recordErrorIf: (response: Response) => {
    if (response.status >= 400) {
      return true;
    }
    return false;
  },
};

// Create a handler that will automatically record metrics for each function invocation
const handler: Handler = autometrics(metricsDefinition, rabbitHandler);

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

// const getRabbit = autometrics(async function getRabbit() {
//   // HACK - This is just to simulate latency
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   return Promise.resolve("🐇");
// });
