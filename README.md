# animalbuttons.biz

An example of adding objectives and alerts to supabase edge functions, using autometrics-ts.

If you're useing VSCode, I recommend the `animalbuttons.code-workspace` workspace.

## Running locally

1. `npm install` in project root
2. `npm run dev` in project root
3. `supabase functions serve` to serve the edge functions locally
4. Launch the autometrics explorer (`am explore`)
5. Connect the explorer to the managed prometheus instance we're using (`https://wercker.fmp.fiberplane.dev/`)
