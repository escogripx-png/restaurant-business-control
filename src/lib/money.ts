// Money is always stored as an integer count of minor units (e.g. haléře for
// CZK) to avoid float rounding errors. These helpers are the only place that
// should convert between minor units and a display value.

const MINOR_UNITS_PER_MAJOR = 100;

export function minorToMajor(minorUnits: number): number {
  return minorUnits / MINOR_UNITS_PER_MAJOR;
}

export function majorToMinor(majorUnits: number): number {
  return Math.round(majorUnits * MINOR_UNITS_PER_MAJOR);
}

export function formatMoney(minorUnits: number, currency: string, locale = "cs-CZ"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "CZK" ? 0 : 2,
  }).format(minorToMajor(minorUnits));
}
