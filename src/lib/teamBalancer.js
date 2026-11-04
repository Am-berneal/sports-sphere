// ------------------------------------------------------------------
// Smart Team Balancer — our own algorithm (no AI needed).
//
// Idea: split players position by position so every team gets a fair
// share of goalkeepers, defenders, midfielders and forwards. Inside each
// position group, the strongest remaining player goes to the team with
// the LOWEST total skill so far (greedy balancing).
// ------------------------------------------------------------------

// simple seeded random so "Reshuffle" gives different but repeatable results
function rng(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export function balanceTeams(players, teamCount = 2, seed = 0) {
  const rand = rng(seed + 1)
  const teams = Array.from({ length: teamCount }, () => ({ players: [], total: 0 }))
  const order = ['GK', 'DEF', 'MID', 'FWD']

  for (const pos of order) {
    // strongest first; on a reshuffle, add a small random jitter so equal-ish players swap
    const group = players
      .filter((p) => p.pos === pos)
      .map((p) => ({ p, key: p.skill + (seed ? rand() * 1.5 : 0) }))
      .sort((a, b) => b.key - a.key)
      .map((x) => x.p)

    for (const player of group) {
      const countInPos = (t) => t.players.filter((x) => x.pos === pos).length
      // first: keep position counts even; second: give to the weaker team
      const target = [...teams].sort((a, b) => countInPos(a) - countInPos(b) || a.total - b.total)[0]
      target.players.push(player)
      target.total += player.skill
    }
  }
  return teams
}

export function balanceStats(teams) {
  const totals = teams.map((t) => t.total)
  const max = Math.max(...totals)
  const min = Math.min(...totals)
  const all = totals.reduce((a, b) => a + b, 0) || 1
  const diff = max - min
  // 100% = identical totals; lose points as the gap grows relative to team size
  const score = Math.max(0, Math.round(100 - (diff / (all / teams.length)) * 100))
  const gkOk = teams.every((t) => t.players.some((p) => p.pos === 'GK'))
  const sizes = teams.map((t) => t.players.length)
  const sizeOk = Math.max(...sizes) - Math.min(...sizes) <= 1
  return { diff, score, gkOk, sizeOk }
}

export function averageSkill(team) {
  return team.players.length ? (team.total / team.players.length).toFixed(1) : '0.0'
}

export function lineRating(team, pos) {
  const ps = team.players.filter((p) => p.pos === pos)
  if (!ps.length) return 0
  return Math.round((ps.reduce((a, p) => a + p.skill, 0) / (ps.length * 10)) * 100)
}
