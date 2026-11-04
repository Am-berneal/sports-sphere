// ------------------------------------------------------------------
// "Ask Sports Sphere" — natural language questions for admins.
//
// FINAL SYSTEM: Flask sends the question + the MySQL schema to Gemini,
// which returns a SELECT query. Flask checks it is read-only, runs it
// and returns the rows.
// PROTOTYPE: we recognise common question types with keyword rules and
// answer from the sample data, showing the SQL that would be generated.
// ------------------------------------------------------------------
import { DEPTS, SPORT_LIST, participants, enrolled, activeStudents, facilityBookings } from '../data/smartData'

const DEPT_ALIASES = [
  ['Computer Science', /\b(computer|cse|coe|cs)\b/],
  ['Electronics', /\b(electronics?|ece|ec)\b/],
  ['Electrical', /\b(electrical|ee|eee)\b/],
  ['Mechanical', /\b(mechanical|mech)\b/],
  ['Civil', /\bcivil\b/],
  ['Chemical', /\b(chemical|chem)\b/],
]
const SPORT_ALIASES = [
  ['Football', /\b(football|soccer|futsal)\b/],
  ['Cricket', /\bcricket\b/],
  ['Badminton', /\bbadminton\b/],
  ['Basketball', /\b(basketball|hoops)\b/],
  ['Volleyball', /\b(volleyball|volley)\b/],
  ['Table Tennis', /\b(table tennis|tt|ping pong)\b/],
]
const FORBIDDEN = /\b(delete|drop|update|insert|alter|truncate|remove|grant|create table)\b/i

const find = (q, aliases) => aliases.find(([, re]) => re.test(q))?.[0] || null
const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0)
const sortRows = (rows) => [...rows].sort((a, b) => b.value - a.value)
const TERM = "e.term = 'Odd Sem 2026'"

export const SUGGESTIONS = [
  'Which department had the most tournament participants this semester?',
  'What is the most popular sport this semester?',
  'Which facility is booked the most?',
  'How many Mechanical students played football this semester?',
  'Which departments have the most students with no event this semester?',
]

export function ask(question) {
  const raw = (question || '').trim()
  if (!raw) return { error: 'Type a question first.' }
  if (FORBIDDEN.test(raw)) {
    return {
      blocked: true,
      error: 'Blocked: Ask Sports Sphere can only read data. Changing or deleting records is not allowed from here.',
    }
  }
  const q = ` ${raw.toLowerCase()} `
  const dept = find(q, DEPT_ALIASES)
  const sport = find(q, SPORT_ALIASES)

  // 1. students with no event
  if (/(no event|not played|haven'?t played|inactive|did not play|didn'?t play|no participation)/.test(q)) {
    const rows = sortRows(DEPTS.filter((d) => !dept || d === dept).map((d) => ({ label: d, value: enrolled[d] - activeStudents[d] })))
    const total = rows.reduce((a, r) => a + r.value, 0)
    return {
      title: 'Students with no event this semester',
      answer: dept
        ? `${rows[0].value} ${dept} students have not taken part in any event this semester.`
        : `${total} students have not taken part in any event this semester. ${rows[0].label} has the most (${rows[0].value}).`,
      rows,
      unit: 'students',
      sql: `SELECT u.department, COUNT(*) AS students_without_event
FROM users u
WHERE u.role = 'student'${dept ? `\n  AND u.department = '${dept}'` : ''}
  AND u.user_id NOT IN (
    SELECT r.user_id FROM registrations r
    JOIN events e ON e.event_id = r.event_id
    WHERE ${TERM})
GROUP BY u.department
ORDER BY students_without_event DESC;`,
    }
  }

  // 2. facilities
  if (/(facility|facilities|booked|booking|ground|court|hall|venue)/.test(q)) {
    const rows = sortRows(Object.entries(facilityBookings).map(([label, value]) => ({ label, value })))
    return {
      title: 'Approved bookings per facility (last 30 days)',
      answer: `${rows[0].label} is booked the most, with ${rows[0].value} approved bookings in the last 30 days, followed by ${rows[1].label} (${rows[1].value}).`,
      rows,
      unit: 'bookings',
      sql: `SELECT f.name, COUNT(b.booking_id) AS approved_bookings
FROM facilities f
JOIN bookings b ON b.facility_id = f.facility_id
WHERE b.status = 'Approved'
  AND b.booking_date >= CURDATE() - INTERVAL 30 DAY
GROUP BY f.name
ORDER BY approved_bookings DESC;`,
    }
  }

  // 3. one department + one sport -> single number
  if (dept && sport) {
    const n = participants[dept][sport]
    const share = Math.round((n / sum(participants[dept])) * 100)
    return {
      title: `${dept} · ${sport}`,
      answer: `${n} ${dept} students played ${sport.toLowerCase()} this semester. That is about ${share}% of all ${dept} sports entries.`,
      rows: sortRows(SPORT_LIST.map((s) => ({ label: s, value: participants[dept][s] }))),
      highlight: sport,
      unit: 'students',
      sql: `SELECT COUNT(DISTINCT r.user_id) AS players
FROM registrations r
JOIN users u  ON u.user_id = r.user_id
JOIN events e ON e.event_id = r.event_id
WHERE u.department = '${dept}'
  AND e.sport = '${sport}'
  AND ${TERM};`,
    }
  }

  // 4. most popular sport / one sport across departments
  if (sport || /(sport|popular|most played|game)/.test(q)) {
    if (sport) {
      const rows = sortRows(DEPTS.map((d) => ({ label: d, value: participants[d][sport] })))
      return {
        title: `${sport} participants by department`,
        answer: `${rows.reduce((a, r) => a + r.value, 0)} students played ${sport.toLowerCase()} this semester. ${rows[0].label} had the most (${rows[0].value}).`,
        rows,
        unit: 'students',
        sql: `SELECT u.department, COUNT(DISTINCT r.user_id) AS players
FROM registrations r
JOIN users u  ON u.user_id = r.user_id
JOIN events e ON e.event_id = r.event_id
WHERE e.sport = '${sport}' AND ${TERM}
GROUP BY u.department
ORDER BY players DESC;`,
      }
    }
    const rows = sortRows(SPORT_LIST.map((s) => ({ label: s, value: DEPTS.reduce((a, d) => a + participants[d][s], 0) })))
    return {
      title: 'Participants by sport',
      answer: `${rows[0].label} is the most popular sport this semester with ${rows[0].value} participants, followed by ${rows[1].label} (${rows[1].value}).`,
      rows,
      unit: 'participants',
      sql: `SELECT e.sport, COUNT(DISTINCT r.user_id) AS participants
FROM registrations r
JOIN events e ON e.event_id = r.event_id
WHERE ${TERM}
GROUP BY e.sport
ORDER BY participants DESC;`,
    }
  }

  // 5. one department -> its sports
  if (dept) {
    const rows = sortRows(SPORT_LIST.map((s) => ({ label: s, value: participants[dept][s] })))
    return {
      title: `${dept} participation by sport`,
      answer: `${dept} recorded ${sum(participants[dept])} sports entries this semester. The most popular sport was ${rows[0].label} (${rows[0].value}).`,
      rows,
      unit: 'entries',
      sql: `SELECT e.sport, COUNT(*) AS entries
FROM registrations r
JOIN users u  ON u.user_id = r.user_id
JOIN events e ON e.event_id = r.event_id
WHERE u.department = '${dept}' AND ${TERM}
GROUP BY e.sport
ORDER BY entries DESC;`,
    }
  }

  // 6. participation by department
  if (/(department|dept|branch|participa|registered|most students|entries)/.test(q)) {
    const rows = sortRows(DEPTS.map((d) => ({ label: d, value: sum(participants[d]) })))
    const total = rows.reduce((a, r) => a + r.value, 0)
    return {
      title: 'Tournament entries by department',
      answer: `${rows[0].label} had the most tournament entries this semester (${rows[0].value}), followed by ${rows[1].label} (${rows[1].value}) and ${rows[2].label} (${rows[2].value}). Total entries: ${total}.`,
      rows,
      unit: 'entries',
      sql: `SELECT u.department, COUNT(*) AS entries
FROM registrations r
JOIN users u  ON u.user_id = r.user_id
JOIN events e ON e.event_id = r.event_id
WHERE ${TERM}
GROUP BY u.department
ORDER BY entries DESC;`,
    }
  }

  return {
    error: "Sorry, I couldn't understand that question yet. Try asking about departments, sports, facilities, or students with no event — or pick one of the suggestions.",
  }
}
