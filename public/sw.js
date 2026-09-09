// Deliberately network-only: this app shows financial/operational data that
// must never be served stale without the "last updated at" indicator the
// spec requires (see MASTER SPEC §30). No caching strategy is implemented
// yet — this file exists only so the app is installable as a PWA.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // No-op: fall through to the network for every request.
});
