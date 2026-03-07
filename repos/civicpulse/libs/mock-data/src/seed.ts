// Mulberry32 PRNG - seeded random number generator
// Seed: 20250307
const SEED = 20250307

export class Mulberry32 {
  private state: number

  constructor(seed: number) {
    this.state = seed
  }

  // Generate next random number
  next(): number {
    let t = (this.state += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  // Get random float in range [min, max)
  float(min: number, max: number): number {
    return min + this.next() * (max - min)
  }

  // Get random integer in range [min, max] (inclusive)
  int(min: number, max: number): number {
    return Math.floor(this.float(min, max + 1))
  }

  // Get random item from array
  item<T>(array: readonly T[]): T {
    return array[this.int(0, array.length - 1)]
  }

  // Get random items from array (without replacement)
  items<T>(array: readonly T[], count: number): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.int(0, i)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, count)
  }

  // Get random item from array with weights
  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0)
    let random = this.next() * totalWeight

    for (let i = 0; i < items.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return items[i]
      }
    }

    // Fallback to last item due to floating point precision
    return items[items.length - 1]
  }

  // Get boolean with probability
  boolean(probability: number = 0.5): boolean {
    return this.next() < probability
  }

  // Get random date string within range
  date(start: Date, end: Date): string {
    const timestamp = this.float(start.getTime(), end.getTime())
    return new Date(timestamp).toISOString()
  }

  // Generate random ID
  id(prefix: string = ""): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let result = prefix
    for (let i = 0; i < 12; i++) {
      result += chars[this.int(0, chars.length - 1)]
    }
    return result
  }
}

// Global seeded instance
export const seed = new Mulberry32(SEED)

// Helper functions using global seed
export const randFloat = (min: number, max: number): number =>
  seed.float(min, max)

export const randInt = (min: number, max: number): number => seed.int(min, max)

export const randItem = <T>(array: readonly T[]): T => seed.item(array)

export const randWeighted = <T>(
  items: readonly T[],
  weights: readonly number[]
): T => seed.weighted(items, weights)

export const randBoolean = (probability?: number): boolean =>
  seed.boolean(probability)

export const randDate = (start: Date, end: Date): string =>
  seed.date(start, end)

export const randId = (prefix?: string): string => seed.id(prefix)
