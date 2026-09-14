// Deterministic fictional value generator.
// The same image (same bytes) will always produce the same result, because
// every number below is derived from a hash of the file's raw bytes rather
// than Math.random().

/**
 * FNV-1a hash — fast, dependency-free, good distribution for our purposes.
 * Returns an unsigned 32-bit integer.
 */
function fnv1aHash(bytes) {
  let hash = 0x811c9dc5
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i]
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * mulberry32 — a tiny, fast, seedable PRNG.
 * Given the same seed it always produces the same sequence of floats in [0, 1).
 */
function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash a File/Blob's actual bytes into a 32-bit integer seed. */
export async function hashFileToSeed(file) {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Sampling every byte on very large images is unnecessary for a good hash
  // and costs performance — stride through the buffer instead.
  const stride = bytes.length > 200000 ? Math.floor(bytes.length / 200000) : 1
  const sampled = stride === 1 ? bytes : bytes.filter((_, i) => i % stride === 0)

  // Mix in the file size and name so visually-similar but distinct files
  // (e.g. re-saved copies) still tend to diverge.
  const nameBytes = new TextEncoder().encode(file.name + ':' + file.size)
  const combined = new Uint8Array(sampled.length + nameBytes.length)
  combined.set(sampled, 0)
  combined.set(nameBytes, sampled.length)

  return fnv1aHash(combined)
}

// Rarity tiers — decided by the composite "power" score. Each carries a
// color (used for badges/glows) and an emoji (used in copy + share text).
const RARITY_TIERS = [
  { name: 'Common', min: 0, max: 0.4, color: '#9AA3C4', emoji: '⚪' },
  { name: 'Rare', min: 0.4, max: 0.68, color: '#5B8DEF', emoji: '🔵' },
  { name: 'Epic', min: 0.68, max: 0.87, color: '#9D6FFF', emoji: '🟣' },
  { name: 'Legendary', min: 0.87, max: 0.97, color: '#F5B94A', emoji: '🟡' },
  { name: 'Mythic', min: 0.97, max: 1.001, color: '#6EE7F5', emoji: '💎' },
]

// Degen Level — a separate, semi-independent axis so two profiles of the
// same rarity can still feel distinct ("Mythic, but only a Casual degen").
const DEGEN_LEVELS = [
  { name: 'Newbie', min: 0, max: 0.2 },
  { name: 'Casual', min: 0.2, max: 0.42 },
  { name: 'Committed', min: 0.42, max: 0.65 },
  { name: 'Elite', min: 0.65, max: 0.85 },
  { name: 'Legendary', min: 0.85, max: 0.96 },
  { name: 'Certified Degen', min: 0.96, max: 1.001 },
]

// Profile personalities — purely for flavor. One is picked deterministically
// per image so the same upload always reads the same "character."
const PERSONALITIES = [
  { name: 'Crypto Wizard', emoji: '🧙' },
  { name: 'Meme Lord', emoji: '👑' },
  { name: 'Silent Lurker', emoji: '🕶️' },
  { name: 'Timeline Prophet', emoji: '🔮' },
  { name: 'Chaos Agent', emoji: '🌀' },
  { name: 'Based Anon', emoji: '😎' },
  { name: 'Serial Poster', emoji: '📈' },
  { name: 'Reply Guy Supreme', emoji: '💬' },
  { name: 'Founder Energy', emoji: '🚀' },
  { name: 'Tech Bro Sage', emoji: '🧠' },
  { name: 'Doomscroll Champion', emoji: '📱' },
  { name: 'Quote Tweet Assassin', emoji: '⚔️' },
  { name: 'Ratio Magnet', emoji: '🔥' },
  { name: 'Vibes Curator', emoji: '✨' },
  { name: 'Alpha Leaker', emoji: '🗝️' },
  { name: 'Thread Guy', emoji: '🧵' },
  { name: 'Screenshot Historian', emoji: '📸' },
  { name: 'Main Character', emoji: '🎬' },
  { name: 'Verified Menace', emoji: '✅' },
  { name: 'Terminally Online', emoji: '💻' },
]

function pickTier(tiers, score) {
  return tiers.find((t) => score >= t.min && score < t.max) || tiers[tiers.length - 1]
}

const LOADING_MESSAGES = [
  'Scanning digital aura...',
  'Checking meme energy...',
  'Calculating timeline power...',
  'Finding imaginary buyers...',
  'Consulting the algorithm gods...',
  'Cross-referencing the vibe index...',
  'Measuring degen levels...',
  'Assigning a profile personality...',
  'Appraising imaginary NFT worth...',
  'Ratioing the competition...',
]

export function getLoadingMessages() {
  return LOADING_MESSAGES
}

/**
 * Given a numeric seed, deterministically derive the full fictional profile
 * valuation: a dollar value, three 0-100 scores, a rarity tier, a degen
 * level, and a personality — all reproducible from the same seed.
 */
export function generateValueFromSeed(seed) {
  const rand = mulberry32(seed)

  // Draw the sub-scores first — they influence the overall "power" score
  // that decides both the dollar value and the rarity tier, so a profile
  // that scores well across the board reads as coherently rare, not random.
  const digitalAura = Math.round(40 + rand() * 60) // 40-100
  const memeEnergy = Math.round(30 + rand() * 70) // 30-100
  const timelinePower = Math.round(35 + rand() * 65) // 35-100

  const power = (digitalAura + memeEnergy + timelinePower) / 300 // 0-1
  // Blend the composite power score with a bit of independent randomness so
  // the dollar figure doesn't feel like a pure linear function of the scores.
  const valueNoise = rand()
  const composite = power * 0.75 + valueNoise * 0.25

  const MIN_VALUE = 1000
  const MAX_VALUE = 100000
  const value = Math.round(MIN_VALUE + composite * (MAX_VALUE - MIN_VALUE))

  const rarity = pickTier(RARITY_TIERS, composite)

  // Degen level leans on meme energy plus its own independent draw, so it
  // doesn't just mirror rarity.
  const degenNoise = rand()
  const degenScore = (memeEnergy / 100) * 0.6 + degenNoise * 0.4
  const degenLevel = pickTier(DEGEN_LEVELS, degenScore).name

  // Personality is an independent categorical draw — flavor, not a score.
  const personalityIndex = Math.floor(rand() * PERSONALITIES.length)
  const personality = PERSONALITIES[personalityIndex]

  // A stable "edition number" for the collectible-card feel on the download.
  const editionNumber = 100000 + (seed % 899999)

  return {
    value,
    rarity: rarity.name,
    rarityColor: rarity.color,
    rarityEmoji: rarity.emoji,
    digitalAura,
    memeEnergy,
    timelinePower,
    degenLevel,
    personalityName: personality.name,
    personalityEmoji: personality.emoji,
    editionNumber,
  }
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Builds the tweet text used by the "Share on X" button — leads with the
 * number, names the rarity, and closes with a friendly challenge so people
 * want to tag friends rather than just post their own result.
 */
export function buildShareText(result, siteUrl) {
  const lines = [
    `My X profile just got valued at ${formatCurrency(result.value)} ${result.rarityEmoji}`,
    `Rarity: ${result.rarity} · ${result.personalityEmoji} ${result.personalityName}`,
    `Degen Level: ${result.degenLevel}`,
    '',
    `Think your profile is worth more? Prove it 👇`,
    siteUrl,
  ]
  return lines.join('\n')
}
