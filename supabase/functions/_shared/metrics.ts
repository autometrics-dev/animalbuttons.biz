import { Objective, ObjectiveLatency, ObjectivePercentile } from "./deps.ts";

export const ANIMAL_OBJECTIVE: Objective = {
  name: "animalbuttons.biz",
  successRate: ObjectivePercentile.P99_9,
  latency: [ObjectiveLatency.Ms500, ObjectivePercentile.P99],
};
