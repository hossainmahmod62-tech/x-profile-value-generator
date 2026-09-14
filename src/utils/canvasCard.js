// Renders the shareable result card to an offscreen <canvas> so it can be
// downloaded as a PNG without pulling in a screenshot library. Styled as a
// numbered collectible card: foil corner ribbon, edition number, rarity-tinted
// glow, and a clear type hierarchy (kicker -> value -> stats -> footer).

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function drawScoreRow(ctx, x, y, width, label, score, color) {
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(237,239,248,0.8)'
  ctx.font = '600 25px "Inter", sans-serif'
  ctx.fillText(label, x, y)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#EDEFF8'
  ctx.font = '700 25px "Space Grotesk", sans-serif'
  ctx.fillText(`${score}/100`, x + width, y)

  // Track
  const barY = y + 14
  const barH = 10
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  roundRectPath(ctx, x, barY, width, barH, barH / 2)
  ctx.fill()

  // Fill
  const fillW = Math.max(barH, (width * score) / 100)
  const grad = ctx.createLinearGradient(x, 0, x + width, 0)
  grad.addColorStop(0, color)
  grad.addColorStop(1, '#9D6FFF')
  ctx.fillStyle = grad
  roundRectPath(ctx, x, barY, fillW, barH, barH / 2)
  ctx.fill()
}

/**
 * Draws the full shareable collectible card and returns a PNG data URL.
 */
export async function renderResultCard({ imageSrc, result, siteLabel }) {
  const W = 1080
  const H = 1280
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // ---- Background ----
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#0A0E1B')
  bg.addColorStop(0.55, '#171432')
  bg.addColorStop(1, '#11162B')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // Rarity-tinted glow behind the card, plus a secondary violet glow —
  // ties the ambient color to whatever tier this profile landed on.
  const glow1 = ctx.createRadialGradient(W * 0.82, H * 0.1, 0, W * 0.82, H * 0.1, 460)
  glow1.addColorStop(0, `${result.rarityColor}40`)
  glow1.addColorStop(1, `${result.rarityColor}00`)
  ctx.fillStyle = glow1
  ctx.fillRect(0, 0, W, H)

  const glow2 = ctx.createRadialGradient(W * 0.12, H * 0.92, 0, W * 0.12, H * 0.92, 420)
  glow2.addColorStop(0, 'rgba(91,141,239,0.25)')
  glow2.addColorStop(1, 'rgba(91,141,239,0)')
  ctx.fillStyle = glow2
  ctx.fillRect(0, 0, W, H)

  // ---- Outer card frame ----
  const pad = 52
  const cardX = pad
  const cardY = pad
  const cardW = W - pad * 2
  const cardH = H - pad * 2
  roundRectPath(ctx, cardX, cardY, cardW, cardH, 44)
  ctx.fillStyle = 'rgba(255,255,255,0.045)'
  ctx.fill()
  ctx.lineWidth = 2
  const frameGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH)
  frameGrad.addColorStop(0, `${result.rarityColor}99`)
  frameGrad.addColorStop(1, 'rgba(255,255,255,0.12)')
  ctx.strokeStyle = frameGrad
  ctx.stroke()

  // Corner "foil" tag — collectible-card signature detail. Kept as a flat,
  // unrotated pill (rather than a rotated ribbon) so it always renders fully
  // on-card regardless of card proportions.
  ctx.font = '700 18px "Space Grotesk", sans-serif'
  const tagText = 'COLLECTIBLE'
  const tagTextWidth = ctx.measureText(tagText).width
  const tagPadX = 20
  const tagW = tagTextWidth + tagPadX * 2
  const tagH = 40
  const tagX = cardX + cardW - tagW - 32
  const tagY = cardY + 32
  const tagGrad = ctx.createLinearGradient(tagX, 0, tagX + tagW, 0)
  tagGrad.addColorStop(0, '#5B8DEF')
  tagGrad.addColorStop(1, '#9D6FFF')
  roundRectPath(ctx, tagX, tagY, tagW, tagH, tagH / 2)
  ctx.fillStyle = tagGrad
  ctx.fill()
  ctx.fillStyle = '#0A0E1B'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(tagText, tagX + tagW / 2, tagY + tagH / 2 + 1)
  ctx.textBaseline = 'alphabetic'

  // ---- Brand row ----
  ctx.fillStyle = 'rgba(237,239,248,0.55)'
  ctx.font = '600 23px "Inter", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X PROFILE VALUE GENERATOR', cardX + 44, cardY + 66)

  // ---- Avatar ----
  const avatarSize = 208
  const avatarX = W / 2 - avatarSize / 2
  const avatarY = cardY + 108
  try {
    const img = await loadImage(imageSrc)
    ctx.save()
    ctx.beginPath()
    ctx.arc(W / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, avatarX, avatarY, avatarSize, avatarSize)
    ctx.restore()
  } catch (e) {
    // If the image fails to load into the canvas, continue without it
    // rather than failing the whole download.
  }

  // Rarity-colored ring + soft glow around the avatar
  ctx.save()
  ctx.shadowColor = result.rarityColor
  ctx.shadowBlur = 30
  ctx.beginPath()
  ctx.arc(W / 2, avatarY + avatarSize / 2, avatarSize / 2 + 6, 0, Math.PI * 2)
  ctx.lineWidth = 5
  ctx.strokeStyle = result.rarityColor
  ctx.stroke()
  ctx.restore()

  // ---- Personality line ----
  const personalityY = avatarY + avatarSize + 58
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(237,239,248,0.85)'
  ctx.font = '600 32px "Space Grotesk", sans-serif'
  ctx.fillText(`${result.personalityEmoji} ${result.personalityName}`, W / 2, personalityY)

  // ---- Rarity badge ----
  const badgeY = personalityY + 36
  ctx.font = '700 24px "Space Grotesk", sans-serif'
  const badgeText = `${result.rarityEmoji} ${result.rarity.toUpperCase()}`
  const badgeTextWidth = ctx.measureText(badgeText).width
  const badgePadX = 30
  const badgeW = badgeTextWidth + badgePadX * 2
  const badgeH = 54
  const badgeX = W / 2 - badgeW / 2
  roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2)
  ctx.fillStyle = `${result.rarityColor}26`
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = result.rarityColor
  ctx.stroke()
  ctx.fillStyle = result.rarityColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(badgeText, W / 2, badgeY + badgeH / 2 + 2)
  ctx.textBaseline = 'alphabetic'

  // ---- Value ----
  const valueLabelY = badgeY + badgeH + 62
  ctx.fillStyle = 'rgba(237,239,248,0.55)'
  ctx.font = '600 23px "Inter", sans-serif'
  ctx.fillText('FICTIONAL X PROFILE VALUE', W / 2, valueLabelY)

  const valueText = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(result.value)

  const valueY = valueLabelY + 82
  const valueGrad = ctx.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0)
  valueGrad.addColorStop(0, '#EDEFF8')
  valueGrad.addColorStop(0.5, '#B9C6FF')
  valueGrad.addColorStop(1, '#9D6FFF')
  ctx.fillStyle = valueGrad
  ctx.font = '700 78px "Space Grotesk", sans-serif'
  ctx.fillText(valueText, W / 2, valueY)

  // ---- Degen level chip ----
  const degenChipY = valueY + 46
  ctx.font = '600 22px "Inter", sans-serif'
  const degenText = `DEGEN LEVEL · ${result.degenLevel.toUpperCase()}`
  const degenWidth = ctx.measureText(degenText).width
  const degenPadX = 24
  const degenW = degenWidth + degenPadX * 2
  const degenH = 44
  roundRectPath(ctx, W / 2 - degenW / 2, degenChipY, degenW, degenH, degenH / 2)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.16)'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = 'rgba(237,239,248,0.85)'
  ctx.textBaseline = 'middle'
  ctx.fillText(degenText, W / 2, degenChipY + degenH / 2 + 1)
  ctx.textBaseline = 'alphabetic'

  // ---- Scores ----
  const scoresStartY = degenChipY + degenH + 78
  const rowGap = 80
  const rowWidth = cardW - 96 - 48
  const rowX = cardX + 72
  drawScoreRow(ctx, rowX, scoresStartY, rowWidth, 'Digital Aura', result.digitalAura, '#5B8DEF')
  drawScoreRow(ctx, rowX, scoresStartY + rowGap, rowWidth, 'Meme Energy', result.memeEnergy, '#9D6FFF')
  drawScoreRow(ctx, rowX, scoresStartY + rowGap * 2, rowWidth, 'Timeline Power', result.timelinePower, '#6EE7F5')

  // ---- Footer: edition number + disclaimer ----
  const dividerY = scoresStartY + rowGap * 2 + 56
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + 44, dividerY)
  ctx.lineTo(cardX + cardW - 44, dividerY)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(237,239,248,0.45)'
  ctx.font = '600 20px "Inter", sans-serif'
  ctx.fillText(`EDITION #${String(result.editionNumber).padStart(6, '0')}`, cardX + 44, dividerY + 44)

  ctx.textAlign = 'right'
  ctx.fillText(siteLabel || 'Get your value', cardX + cardW - 44, dividerY + 44)

  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(237,239,248,0.35)'
  ctx.font = '500 19px "Inter", sans-serif'
  ctx.fillText('Fictional value — created for entertainment only', W / 2, dividerY + 86)

  return canvas.toDataURL('image/png')
}

export function triggerDownload(dataUrl, filename) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
