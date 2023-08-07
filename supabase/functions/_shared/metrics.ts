import {
  Objective,
  ObjectiveLatency,
  ObjectivePercentile,
  init,
} from "./deps.ts";

export const ANIMAL_OBJECTIVE: Objective = {
  name: "animalbuttons.biz",
  successRate: ObjectivePercentile.P99_9,
  latency: [ObjectiveLatency.Ms500, ObjectivePercentile.P99],
};

export function initializeAutometrics() {
  // NOTE - You need to add `job/{name_of_function}`
  //        to the push gateway URL if you want to use buildInfo
  const PUSH_GATEWAY = Deno.env.get("AM_PUSH_GATEWAY");

  init({
    buildInfo: {
      commit: "",
      version: "",
      branch: "",
      clearmode: "family",
    },
    pushGateway: PUSH_GATEWAY,
    // NOTE - The current version of autometrics knows that this means to eagerly push metrics upon completion
    pushInterval: 0,
  });
}