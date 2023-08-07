import { Handler, serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { autometrics, ObjectivePercentile, ObjectiveLatency } from "https://esm.sh/@autometrics/autometrics@0.7.0-beta";
import type {
  Objective
} from "https://esm.sh/@autometrics/autometrics@0.7.0-beta";

import { initializeAutometrics } from "../_shared/metrics.ts";
import { corsHeaders } from "../_shared/cors.ts";

initializeAutometrics();

const FUNCTION_NAME = "panda";
const MODULE_NAME = "animalbuttons";

const ANIMAL_OBJECTIVE: Objective = {
  name: "animalbuttons.biz - DEMO",
  successRate: ObjectivePercentile.P99_9,
  latency: [ObjectiveLatency.Ms500, ObjectivePercentile.P99],
};

const metricsDefinition = {
  functionName: FUNCTION_NAME,
  moduleName: MODULE_NAME,
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
