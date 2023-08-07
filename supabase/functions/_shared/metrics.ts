import {
  Objective,
  ObjectiveLatency,
  ObjectivePercentile,
  init,
} from "./deps.ts";

export const ANIMAL_OBJECTIVE: Objective = {
  name: "animalbuttons.biz - DEMO",
  successRate: ObjectivePercentile.P99_9,
  latency: [ObjectiveLatency.Ms500, ObjectivePercentile.P99],
};

export function initializeAutometrics(jobName: string) {
  // NOTE - You need to add `job/{name_of_function}`
  //        to the push gateway URL if you want to use buildInfo
  const PUSH_GATEWAY = Deno.env.get("AM_PUSH_GATEWAY") + `/job/${jobName}`;

  init({
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
}