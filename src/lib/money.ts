// Money is always stored as an integer count of minor units (e.g. kopecks
// for RUB) to avoid float rounding errors. These helpers are the only place
// that should convert between minor units and a display value.

const MINOR_UNITS_PER_MAJOR = 100;

// Currencies a restaurant dashboard should show without decimal places —
// kopecks/haléře are noise at KPI-card scale. Extend this list as new
// currencies are onboarded rather than special-casing them at call sites.
const ZERO_DECIMAL_DISPLAY_CURRENCIES = new Set(["RUB", "CZK"]);

export function minorToMajor(minorUnits: number): number {
  return minorUnits / MINOR_UNITS_PER_MAJOR;
}

export function majorToMinor(majorUnits: number): number {
  return Math.round(majorUnits * MINOR_UNITS_PER_MAJOR);
}

export function formatMoney(minorUnits: number, currency: string, locale = "ru-RU"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: ZERO_DECIMAL_DISPLAY_CURRENCIES.has(currency) ? 0 : 2,
  }).format(minorToMajor(minorUnits));
}
