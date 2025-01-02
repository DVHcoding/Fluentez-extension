export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
    // use Math.hypot instead of Math.sqrt to prevent overflow
}
