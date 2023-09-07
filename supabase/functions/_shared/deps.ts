import {
  autometrics,
  Objective,
  ObjectiveLatency,
  ObjectivePercentile,
} from "https://esm.sh/@autometrics/autometrics@0.7.0-beta5";
import { init } from "https://esm.sh/@autometrics/exporter-prometheus-push-gateway@0.7.0-beta5";

export type { Objective };
export { autometrics, init, ObjectiveLatency, ObjectivePercentile };
