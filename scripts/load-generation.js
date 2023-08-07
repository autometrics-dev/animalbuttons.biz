import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import {inspect} from "util";
import { createClient } from "@supabase/supabase-js";

// shim `__filename` and `__dirname` because we're in an ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// NOTE - this is a simplified "dotenv" implementation
//        it might fail, e.g., if you use double quotes for values in your .env file
loadEnvFile();

// Set up supabase client
const supabaseUrl =
  process.env.SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Configure load test
const requestsPerSecond = 2;
const duration = 300; // duration of load test in seconds

let count = 0;

// Generate load
// - call rabbit function ~70% of the time
// - call panda function ~30% of the time
const loadInterval = setInterval(() => {
  for (let i = 0; i < requestsPerSecond; i++) {
    supabase.functions.invoke(
      Math.random() < 0.7 ? "rabbit" : "panda"
    );
  }
  count++;

  // if load test duration is over, clear the interval
  if (count >= duration) {
    clearInterval(loadInterval);
  }
}, 1000);


/**
 * Simple dotenv implementation
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.error(".env file does not exist");
    return;
  }

  const envData = fs.readFileSync(envPath, "utf8");
  const lines = envData.split("\n");

  for (let line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") continue;
    if (trimmedLine.startsWith("#")) continue;

    const [key, value] = trimmedLine.split("=");
    process.env[key.trim()] = value.trim();
  }
}