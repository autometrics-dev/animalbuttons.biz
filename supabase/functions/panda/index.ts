import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  autometrics,
} from "https://esm.sh/@autometrics/autometrics@0.7.0-beta9";
import { init } from "https://esm.sh/@autometrics/exporter-prometheus-push-gateway@0.7.0-beta9";

import { ANIMAL_OBJECTIVE } from "../_shared/metrics.ts";
import { corsHeaders } from "../_shared/cors.ts";

// NOTE - You need to add `job/{name_of_function}`
//        to the push gateway URL if you want to use buildInfo
const PUSH_GATEWAY = Deno.env.get("AM_PUSH_GATEWAY") + `/job/panda`;

init({
  // TODO - figure out proper way to set build info in aggregation context
  //        This could happen via env vars that are set in CI? (deploying via github)
  buildInfo: {
    commit: "4a1bc7e",
    version: "0.0.2",
    branch: "main",
    clearmode: "family",
  },
  url: PUSH_GATEWAY,
  // NOTE - The current version of autometrics knows that this means to eagerly push metrics upon completion
  pushInterval: 0,
});

// Define the labels and objectives we want to use for our metrics
// Also define a function that will determine whether a given response should count as an error in our metrics
const metricsDefinition = {
  // Explicitly declare the function name to be the same as our edge function
  functionName: "panda",
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
const wrappedPandaHandler = autometrics(metricsDefinition, pandaHandler);

// Serve our edge function
serve(wrappedPandaHandler);

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
