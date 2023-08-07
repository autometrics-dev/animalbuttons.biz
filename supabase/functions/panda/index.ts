import { Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { autometrics } from "../_shared/deps.ts";

import { ANIMAL_OBJECTIVE, initializeAutometrics } from "../_shared/metrics.ts";
import { corsHeaders } from "../_shared/cors.ts";

initializeAutometrics();

const metricsDefinition = {
  functionName: "panda",
  moduleName: "animalbuttons",
  objective: ANIMAL_OBJECTIVE,
};

// Create a handler that will automatically record metrics for each function invocation
const handler: Handler = autometrics(metricsDefinition, pandaHandler);

// Serve our edge function
serve(handler);

/**
 * The handler for our edge function
 */
async function pandaHandler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const data = {
    message: await getPanda(),
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

const getPanda = async function getPanda() {
  // Add delay because pandas are slow
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate panda clumsiness
  throwErrorWith50PercentChance();

  return Promise.resolve("🐼");
};

// const getPanda = autometrics(async function getPanda() {
//   // Add delay because pandas are slow
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   // Simulate panda clumsiness
//   throwErrorWith50PercentChance();

//   return Promise.resolve("🐼");
// });

// Utility to simulate panda clumsiness
function throwErrorWith50PercentChance(): void {
  const chanceOfError = 0.1;

  if (Math.random() < chanceOfError) {
    throw new Error("Pandamonimum!");
  }
}
