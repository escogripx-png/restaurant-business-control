/**
 * Demo mode lets the whole app be browsed with fabricated data and no
 * database, for structural UI review (MASTER SPEC §9/§43: mock data is
 * dev-only and must never silently substitute for real data in production).
 *
 * Safety: this is opt-in ONLY via the explicit DEMO_MODE=true env var, never
 * inferred from a missing/broken DATABASE_URL — falling back to fake data on
 * a real outage would hide the outage instead of surfacing it (see §30).
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true";
}
