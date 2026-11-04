// ------------------------------------------------------------------
// "AI" TEXT GENERATORS — SIMULATED FOR THE PROTOTYPE
//
// In the final system these functions are replaced by a call to the
// Flask backend, which sends a prompt to the Gemini API, e.g.
//   POST /api/ai/digest  { studentId }  ->  { subject, summary }
// For the UI prototype we build the text from templates so the
// screens work offline and always give stable, predictable output.
// Only the data each feature needs is used — never passwords,
// phone numbers or roll numbers.
// ------------------------------------------------------------------

const pick = (arr, i) => arr[((i % arr.length) + arr.length) % arr.length]

// ---------- Weekly Digest ----------
export function digestText({ name, matches, deadlines, invites, picks, tone }) {
  const first = name.split(' ')[0]
  const parts = []
  if (matches.length) {
    const m = matches[0]
    parts.push(
      matches.length === 1
        ? `you have one match this week: ${m.title} on ${m.when}`
        : `you have ${matches.length} matches this week, starting with ${m.title} on ${m.when}`
    )
  }
  if (deadlines.length) parts.push(`the ${deadlines[0].title} registration closes on ${deadlines[0].date}`)
  if (invites.length) parts.push(`${invites.length} team invite${invites.length > 1 ? 's are' : ' is'} waiting for your reply`)

  const subjectBits = []
  if (matches.length) subjectBits.push(`${matches.length} match${matches.length > 1 ? 'es' : ''}`)
  if (deadlines.length) subjectBits.push(`${deadlines.length} deadline${deadlines.length > 1 ? 's' : ''}`)
  if (invites.length) subjectBits.push(`${invites.length} invite${invites.length > 1 ? 's' : ''}`)
  const subject = subjectBits.length ? `Your Sports Week: ${subjectBits.join(', ')}` : 'Your Sports Week: a quiet one'

  if (!parts.length && !picks.length) {
    return { subject, summary: `Hi ${first}, nothing is scheduled for you this week. Explore new events on Sports Sphere whenever you're ready.` }
  }

  let summary
  if (tone === 'Concise') {
    summary = parts.length ? `This week: ${parts.join('; ')}.` : 'No fixtures this week — see the events picked for you below.'
  } else if (tone === 'Detailed') {
    summary =
      `Here is your sports briefing for the coming week. ` +
      (parts.length ? `In short, ${parts.join(', and ')}. ` : '') +
      (picks.length ? `Based on your sports, we also found ${picks.length} new event${picks.length > 1 ? 's' : ''} you might enjoy. ` : '') +
      `Everything below links straight to Sports Sphere, so you don't need to search through other emails.`
  } else {
    summary =
      (parts.length ? `Busy week ahead! ${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)}` : 'A lighter week ahead') +
      (parts.length > 1 ? `, and ${parts.slice(1).join(', and ')}.` : '.') +
      (deadlines.length ? ` Don't miss the deadline!` : '')
  }
  return { subject, summary }
}

// ---------- Match Recap ----------
export function recapText(match, variant = 0) {
  const { teamA, teamB, scoreA, scoreB, round, venue } = match
  const draw = scoreA === scoreB
  const winner = scoreA > scoreB ? teamA : teamB
  const loser = scoreA > scoreB ? teamB : teamA
  const hi = Math.max(scoreA, scoreB)
  const lo = Math.min(scoreA, scoreB)
  const margin = hi - lo

  const openers = draw
    ? [
        `${teamA} and ${teamB} shared the points in a ${scoreA}–${scoreB} draw in ${round} at the ${venue}.`,
        `Nothing could separate ${teamA} and ${teamB}, as their ${round} clash ended ${scoreA}–${scoreB}.`,
      ]
    : [
        `${winner} beat ${loser} ${hi}–${lo} in ${round} at the ${venue}.`,
        `${winner} picked up a ${margin === 1 ? 'hard-fought' : 'convincing'} ${hi}–${lo} win over ${loser} in ${round}.`,
        `A ${margin === 1 ? 'tight' : 'one-sided'} ${round} contest ended with ${winner} defeating ${loser} ${hi}–${lo}.`,
      ]
  const middles = draw
    ? ['Both sides created chances, but neither could find a winner.', 'It was an evenly matched game from start to finish.']
    : margin === 1
      ? [`${loser} pushed hard until the final whistle, but ${winner} held on.`, `The result was in doubt until the very end.`]
      : [`${winner} controlled the game and deserved the win.`, `${loser} will need to regroup before their next fixture.`]
  const closers = draw
    ? ['The group remains wide open going into the next round.', 'Both teams stay in contention in the standings.']
    : [`The win moves ${winner} up the ${round} standings.`, `${winner} will carry this momentum into their next match.`]

  return [pick(openers, variant), pick(middles, variant), pick(closers, variant)].join(' ')
}

export function captionText(match, tone, variant = 0) {
  const { teamA, teamB, scoreA, scoreB, round } = match
  const tag = `#SportsSphere #${round.replace(/\s+/g, '')}`
  const draw = scoreA === scoreB
  const winner = scoreA > scoreB ? teamA : teamB
  const loser = scoreA > scoreB ? teamB : teamA
  const hi = Math.max(scoreA, scoreB)
  const lo = Math.min(scoreA, scoreB)

  const rotate = (arr) => arr.map((_, i) => pick(arr, i + variant))
  if (tone === 'Formal') {
    return rotate([
      `Result | ${round}: ${teamA} ${scoreA}–${scoreB} ${teamB}. Updated standings are now live on Sports Sphere. ${tag}`,
      `Full time in ${round}: ${teamA} ${scoreA}, ${teamB} ${scoreB}. Fixtures and standings on Sports Sphere. ${tag}`,
      `Match report: ${draw ? `${teamA} and ${teamB} drew ${scoreA}–${scoreB}` : `${winner} defeated ${loser} ${hi}–${lo}`} (${round}). ${tag}`,
    ])
  }
  if (tone === 'Short') {
    return rotate([
      `FT: ${teamA} ${scoreA}–${scoreB} ${teamB} ${tag}`,
      draw ? `All square! ${scoreA}–${scoreB} ${tag}` : `${winner} win ${hi}–${lo}! ${tag}`,
      `${round} result is in ➜ ${teamA} ${scoreA}–${scoreB} ${teamB}`,
    ])
  }
  // Exciting
  const ex = draw
    ? [
        `⚽ What a battle! ${teamA} and ${teamB} can't be separated — ${scoreA}–${scoreB}! ${tag}`,
        `🔥 Honours even in ${round}! ${teamA} ${scoreA}–${scoreB} ${teamB}. Who takes it next time? ${tag}`,
        `It's all to play for! ${scoreA}–${scoreB} between ${teamA} and ${teamB} 👀 ${tag}`,
      ]
    : [
        `🔥 ${winner} edge past ${loser} ${hi}–${lo} in ${round}! ${tag}`,
        `⚽ Full time! ${winner} take the win ${hi}–${lo} — standings updated! ${tag}`,
        `🏆 ${winner} make a statement with a ${hi}–${lo} victory over ${loser}! ${tag}`,
      ]
  return rotate(ex)
}

// ---------- Participation nudge ----------
export function nudgeText(student, event, tone = 'Friendly') {
  const first = student.name.split(' ')[0]
  if (tone === 'Formal') {
    return `Dear ${first}, we noticed you haven't taken part in a sports event recently. Registrations are open for the ${event}, which is suitable for ${student.level.toLowerCase()} players. You can register on Sports Sphere.`
  }
  if (tone === 'Short') {
    return `Hi ${first}! ${event} is open now — ${student.level.toLowerCase()}-friendly. Join on Sports Sphere?`
  }
  return `Hi ${first}! We've missed you on the ${student.lastSport.toLowerCase()} court. The ${event} is beginner-friendly and a great way to get back into the game. Want to join? Register on Sports Sphere in one click.`
}

// ---------- Training plan ----------
export function trainingPlan({ library, level, daysPerWeek }) {
  const intensity = { Beginner: ['Light', 'Light', 'Medium', 'Medium'], Intermediate: ['Medium', 'Medium', 'Hard', 'Medium'], Advanced: ['Medium', 'Hard', 'Hard', 'Medium'] }[level] || ['Medium', 'Medium', 'Medium', 'Medium']
  const minutes = { Beginner: 40, Intermediate: 55, Advanced: 70 }[level] || 50
  return library.focus.map((focus, w) => {
    const days = []
    for (let d = 0; d < daysPerWeek; d++) {
      const isRest = daysPerWeek >= 5 && d === daysPerWeek - 1
      days.push({
        id: `w${w}d${d}`,
        title: isRest ? 'Active recovery & stretching' : library.sessions[(w * 2 + d) % library.sessions.length],
        minutes: isRest ? 25 : minutes + (w === 2 ? 10 : 0),
        intensity: isRest ? 'Light' : w === 3 && d === daysPerWeek - 1 ? 'Light' : intensity[w],
      })
    }
    return { week: w + 1, focus, days }
  })
}
