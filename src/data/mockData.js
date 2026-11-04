// ------------------------------------------------------------------
// SAMPLE DATA ONLY — used for the UI prototype.
// None of these names, numbers or events are real. Replace with
// responses from the Flask REST API once the backend is built.
// ------------------------------------------------------------------

export const SPORTS = ['Football', 'Basketball', 'Cricket', 'Badminton', 'Volleyball', 'Table Tennis']

export const DEPARTMENTS = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical',
  'Civil',
  'Chemical',
  'Biotechnology',
  'Electrical',
]

export const currentStudent = {
  name: 'Amberneal Singh',
  roll: '[Roll No.]',
  department: 'Computer Science',
  role: 'Student',
}

export const events = [
  {
    id: 'football-cup',
    name: 'Inter-Department Football Cup',
    sport: 'Football',
    type: 'Team',
    format: 'Knockout',
    teamSize: '11 players (squad of 15)',
    startDate: '2026-11-14',
    endDate: '2026-11-22',
    deadline: '2026-11-08',
    venue: 'Main Football Ground',
    status: 'Open',
    slotsFilled: 10,
    slotsTotal: 16,
    image: '/images/arena.jpg',
    organizer: 'Sports Council',
    minSize: 11,
    maxSize: 15,
  },
  {
    id: 'hoops-3v3',
    name: '3v3 Half-Court Basketball',
    sport: 'Basketball',
    type: 'Team',
    format: 'League',
    teamSize: '3 players (squad of 5)',
    startDate: '2026-10-20',
    endDate: '2026-10-28',
    deadline: '2026-10-15',
    venue: 'Basketball Court B',
    status: 'Ongoing',
    slotsFilled: 12,
    slotsTotal: 12,
    image: '/images/basketball.jpg',
    organizer: 'Basketball Club',
    minSize: 3,
    maxSize: 5,
  },
  {
    id: 't10-cricket',
    name: 'T10 Floodlight Cricket Cup',
    sport: 'Cricket',
    type: 'Team',
    format: 'Knockout',
    teamSize: '11 players (squad of 14)',
    startDate: '2026-11-25',
    endDate: '2026-12-02',
    deadline: '2026-11-18',
    venue: 'Cricket Ground',
    status: 'Open',
    slotsFilled: 6,
    slotsTotal: 12,
    image: '/images/arena.jpg',
    organizer: 'Cricket Club',
    minSize: 11,
    maxSize: 14,
  },
  {
    id: 'badminton-open',
    name: 'Campus Open Badminton',
    sport: 'Badminton',
    type: 'Individual',
    format: 'Knockout',
    teamSize: 'Singles & doubles',
    startDate: '2026-11-10',
    endDate: '2026-11-12',
    deadline: '2026-11-06',
    venue: 'Indoor Badminton Hall',
    status: 'Open',
    slotsFilled: 20,
    slotsTotal: 32,
    image: '/images/basketball.jpg',
    organizer: 'Badminton Club',
    minSize: 1,
    maxSize: 2,
  },
  {
    id: 'volley-league',
    name: 'Intramural Volleyball League',
    sport: 'Volleyball',
    type: 'Team',
    format: 'League',
    teamSize: '6 players (squad of 10)',
    startDate: '2026-12-05',
    endDate: '2026-12-12',
    deadline: '2026-11-28',
    venue: 'Volleyball Courts',
    status: 'Open',
    slotsFilled: 4,
    slotsTotal: 10,
    image: '/images/arena.jpg',
    organizer: 'Sports Council',
    minSize: 6,
    maxSize: 10,
  },
  {
    id: 'tt-series',
    name: 'Table Tennis Series',
    sport: 'Table Tennis',
    type: 'Individual',
    format: 'Knockout',
    teamSize: 'Singles',
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    deadline: '2026-09-30',
    venue: 'Recreation Hall',
    status: 'Completed',
    slotsFilled: 24,
    slotsTotal: 24,
    image: '/images/basketball.jpg',
    organizer: 'TT Club',
    minSize: 1,
    maxSize: 1,
  },
]

export const students = [
  { roll: '102303001', name: 'Arjun Mehta', dept: 'Computer Science', sport: 'Football', skill: 'Advanced', position: 'Striker', availability: 'Weekdays 5–8 PM' },
  { roll: '102303002', name: 'Simran Kaur', dept: 'Electronics & Communication', sport: 'Basketball', skill: 'Advanced', position: 'Point Guard', availability: 'Tue/Thu evenings' },
  { roll: '102303003', name: 'Rohan Verma', dept: 'Mechanical', sport: 'Cricket', skill: 'Intermediate', position: 'All-rounder', availability: 'After 4:30 PM daily' },
  { roll: '102303004', name: 'Ananya Sharma', dept: 'Biotechnology', sport: 'Badminton', skill: 'Advanced', position: 'Singles', availability: 'Evenings 6–9 PM' },
  { roll: '102303005', name: 'Karan Gill', dept: 'Electrical', sport: 'Football', skill: 'Intermediate', position: 'Goalkeeper', availability: 'Weekends' },
  { roll: '102303006', name: 'Priya Nair', dept: 'Civil', sport: 'Volleyball', skill: 'Intermediate', position: 'Setter', availability: 'Mon/Wed/Fri' },
  { roll: '102303007', name: 'Harsh Bansal', dept: 'Chemical', sport: 'Football', skill: 'Beginner', position: 'Defender', availability: 'Weekends' },
  { roll: '102303008', name: 'Neha Joshi', dept: 'Computer Science', sport: 'Table Tennis', skill: 'Beginner', position: 'Singles', availability: 'Lunch break' },
]

export const teamsRecruiting = [
  { name: 'Thunderbolts FC', sport: 'Football', captain: 'Amberneal Singh', members: 9, max: 11, needs: ['Right Winger', 'Goalkeeper'] },
  { name: 'Net Ninjas', sport: 'Volleyball', captain: 'Priya Nair', members: 4, max: 6, needs: ['Libero', 'Blocker'] },
  { name: 'Boundary Hunters', sport: 'Cricket', captain: 'Rohan Verma', members: 8, max: 11, needs: ['Bowler', 'Wicket-keeper', 'Batter'] },
]

export const myTeam = {
  name: 'Thunderbolts FC',
  sport: 'Football',
  event: 'Inter-Department Football Cup',
  members: [
    { name: 'Amberneal Singh', role: 'Captain', position: 'Midfielder' },
    { name: 'Arjun Mehta', role: 'Member', position: 'Striker' },
    { name: 'Karan Gill', role: 'Member', position: 'Goalkeeper' },
    { name: 'Harsh Bansal', role: 'Member', position: 'Defender' },
    { name: 'Dev Arora', role: 'Member', position: 'Defender' },
  ],
  max: 11,
}

export const upcomingMatches = [
  { id: 1, sport: 'Basketball', round: 'League · Game 4', teamA: 'Hoop Dreams', teamB: 'Court Kings', date: 'Mon, Nov 9', time: '6:30 PM', venue: 'Basketball Court B', status: 'Confirmed' },
  { id: 2, sport: 'Football', round: 'Friendly', teamA: 'Thunderbolts FC', teamB: 'Civil United', date: 'Thu, Nov 12', time: '4:00 PM', venue: 'Main Football Ground', status: 'Scheduled' },
  { id: 3, sport: 'Badminton', round: 'Practice slot', teamA: 'Singles practice', teamB: '', date: 'Sat, Nov 14', time: '5:00 PM', venue: 'Badminton Hall · Court 2', status: 'Booked' },
]

export const notifications = [
  { id: 1, type: 'info', text: 'Match vs Court Kings moved to Court B.', time: '10 min ago' },
  { id: 2, type: 'success', text: 'Your registration for Campus Open Badminton was approved.', time: '2 h ago' },
  { id: 3, type: 'warning', text: 'Football Cup registration closes on Nov 8.', time: '5 h ago' },
  { id: 4, type: 'info', text: 'Facility booking reminder: Badminton Court 2, Sat 14 Nov, 5 PM.', time: 'Yesterday' },
]

export const teamInvites = [
  { id: 1, team: 'Net Ninjas', sport: 'Volleyball', captain: 'Priya Nair', role: 'Middle Blocker' },
  { id: 2, team: 'Boundary Hunters', sport: 'Cricket', captain: 'Rohan Verma', role: 'Bowler' },
]

// ---------- Tournament: matches & standings (football cup sample) ----------
export const tournamentTeams = [
  'CSE Strikers', 'ECE Warriors', 'Mech Iron Gears', 'Civil Titans',
  'Chem Crusaders', 'Biotech FC', 'Electrical Sparks', 'Thunderbolts FC',
]

// If you add src/data/real/fixtures.json (made by scripts/convert_ipl.py),
// the app uses it automatically. Otherwise it uses the sample fixtures below.
const REAL = import.meta.glob('./real/*.json', { eager: true, import: 'default' })

const sampleFixtures = [
  { id: 'M1', round: 'Group A', date: 'Nov 14', time: '3:30 PM', venue: 'Main Ground', teamA: 'CSE Strikers', teamB: 'ECE Warriors', scoreA: 2, scoreB: 1, status: 'Completed' },
  { id: 'M2', round: 'Group A', date: 'Nov 14', time: '5:00 PM', venue: 'Main Ground', teamA: 'Mech Iron Gears', teamB: 'Civil Titans', scoreA: 1, scoreB: 1, status: 'Completed' },
  { id: 'M3', round: 'Group B', date: 'Nov 15', time: '3:30 PM', venue: 'Main Ground', teamA: 'Chem Crusaders', teamB: 'Biotech FC', scoreA: 0, scoreB: 2, status: 'Completed' },
  { id: 'M4', round: 'Group B', date: 'Nov 15', time: '5:00 PM', venue: 'Main Ground', teamA: 'Electrical Sparks', teamB: 'Thunderbolts FC', scoreA: 1, scoreB: 3, status: 'Completed' },
  { id: 'M5', round: 'Group A', date: 'Nov 16', time: '3:30 PM', venue: 'Main Ground', teamA: 'CSE Strikers', teamB: 'Mech Iron Gears', scoreA: null, scoreB: null, status: 'Scheduled' },
  { id: 'M6', round: 'Group A', date: 'Nov 16', time: '5:00 PM', venue: 'Main Ground', teamA: 'ECE Warriors', teamB: 'Civil Titans', scoreA: null, scoreB: null, status: 'Scheduled' },
  { id: 'M7', round: 'Group B', date: 'Nov 17', time: '3:30 PM', venue: 'Main Ground', teamA: 'Chem Crusaders', teamB: 'Thunderbolts FC', scoreA: null, scoreB: null, status: 'Scheduled' },
  { id: 'M8', round: 'Group B', date: 'Nov 17', time: '5:00 PM', venue: 'Main Ground', teamA: 'Biotech FC', teamB: 'Electrical Sparks', scoreA: null, scoreB: null, status: 'Scheduled' },
]

export const initialFixtures = Array.isArray(REAL['./real/fixtures.json']) ? REAL['./real/fixtures.json'] : sampleFixtures

// Points rule: Win = 3, Draw = 1, Loss = 0  (Technical challenge #3)
export function computeStandings(fixtures) {
  const table = {}
  fixtures.forEach((m) => {
    ;[m.teamA, m.teamB].forEach((t) => {
      if (!table[t]) table[t] = { team: t, group: m.round, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, Pts: 0 }
    })
    if (m.status !== 'Completed') return
    const a = table[m.teamA]
    const b = table[m.teamB]
    a.P++; b.P++
    a.GF += m.scoreA; a.GA += m.scoreB
    b.GF += m.scoreB; b.GA += m.scoreA
    if (m.scoreA > m.scoreB) { a.W++; b.L++; a.Pts += 3 }
    else if (m.scoreA < m.scoreB) { b.W++; a.L++; b.Pts += 3 }
    else { a.D++; b.D++; a.Pts++; b.Pts++ }
  })
  return Object.values(table).sort(
    (x, y) => y.Pts - x.Pts || (y.GF - y.GA) - (x.GF - x.GA) || y.GF - x.GF
  )
}

// ---------- Facilities & bookings ----------
export const facilities = [
  { id: 'football', name: 'Main Football Ground', type: 'Outdoor', capacity: 120, image: '/images/arena.jpg' },
  { id: 'basketball', name: 'Basketball Court B', type: 'Outdoor', capacity: 40, image: '/images/basketball.jpg' },
  { id: 'badminton', name: 'Indoor Badminton Hall', type: 'Indoor', capacity: 32, image: '/images/basketball.jpg' },
  { id: 'cricket', name: 'Cricket Nets', type: 'Outdoor', capacity: 24, image: '/images/arena.jpg' },
  { id: 'gym', name: 'Gymnasium', type: 'Indoor', capacity: 45, image: '/images/basketball.jpg' },
]

// hours in 24h format, day = 0..4 (Mon..Fri)
export const initialBookings = [
  { id: 1, facility: 'football', day: 0, start: 8, end: 10, title: 'Football practice', by: 'Sports Council', status: 'Approved' },
  { id: 2, facility: 'football', day: 1, start: 14, end: 16, title: 'CSE friendly', by: 'CSE Strikers', status: 'Pending' },
  { id: 3, facility: 'football', day: 2, start: 10, end: 12, title: 'Athletics track team', by: 'Athletics Club', status: 'Approved' },
  { id: 4, facility: 'football', day: 3, start: 16, end: 18, title: 'Mech vs Civil', by: 'Coordinator', status: 'Approved' },
  { id: 5, facility: 'football', day: 2, start: 16, end: 18, title: 'Ground maintenance', by: 'Facilities', status: 'Closed' },
  { id: 6, facility: 'badminton', day: 4, start: 17, end: 19, title: 'Club practice', by: 'Badminton Club', status: 'Approved' },
  { id: 7, facility: 'basketball', day: 0, start: 18, end: 20, title: 'League game', by: 'Basketball Club', status: 'Approved' },
]

// Booking conflict rule (Technical challenge #1):
// two bookings overlap when startA < endB AND startB < endA
export function findConflict(bookings, req) {
  return bookings.find(
    (b) =>
      b.facility === req.facility &&
      b.day === req.day &&
      (b.status === 'Approved' || b.status === 'Closed') &&
      req.start < b.end &&
      b.start < req.end
  )
}

// ---------- Coordinator: registrations ----------
export const initialRegistrations = [
  { id: 'REG-084', team: 'Mech Iron Gears', dept: 'Mechanical', event: 'Inter-Department Football Cup', captain: 'Aarav Sharma', captainRoll: '102203042', members: 11, required: 11, submitted: 'Nov 2 · 14:32', eligible: true, status: 'Pending' },
  { id: 'REG-079', team: 'CSE Strikers', dept: 'Computer Science', event: 'Inter-Department Football Cup', captain: 'Arjun Mehta', captainRoll: '102303001', members: 12, required: 11, submitted: 'Nov 2 · 12:10', eligible: true, status: 'Pending' },
  { id: 'REG-062', team: 'ECE Warriors', dept: 'Electronics & Communication', event: 'Inter-Department Football Cup', captain: 'Tanya Deshmukh', captainRoll: '102203012', members: 9, required: 11, submitted: 'Nov 1 · 18:45', eligible: false, status: 'Pending' },
  { id: 'REG-055', team: 'Civil Titans', dept: 'Civil', event: 'Inter-Department Football Cup', captain: 'Zayn Malik', captainRoll: '102303090', members: 11, required: 11, submitted: 'Nov 1 · 15:20', eligible: true, status: 'Approved' },
  { id: 'REG-048', team: 'Net Ninjas', dept: 'Civil', event: 'Intramural Volleyball League', captain: 'Priya Nair', captainRoll: '102303006', members: 6, required: 6, submitted: 'Oct 31 · 20:05', eligible: true, status: 'Pending' },
  { id: 'REG-041', team: 'Chem Crusaders', dept: 'Chemical', event: 'Inter-Department Football Cup', captain: 'Kunal Kapoor', captainRoll: '102203003', members: 8, required: 11, submitted: 'Oct 30 · 11:15', eligible: false, status: 'Rejected' },
]

export const rosterPreview = [
  { name: 'Aarav Sharma', roll: '102203042', position: 'Striker', captain: true },
  { name: 'Vikram Singh', roll: '102203019', position: 'Goalkeeper' },
  { name: 'Kabir Mehta', roll: '102203088', position: 'Midfielder' },
  { name: 'Siddharth Rao', roll: '102303004', position: 'Defender' },
  { name: 'Rahul Nair', roll: '102203051', position: 'Winger' },
]

// ---------- Admin ----------
export const participationBySport = [
  { sport: 'Football', count: 186 },
  { sport: 'Cricket', count: 154 },
  { sport: 'Badminton', count: 98 },
  { sport: 'Basketball', count: 76 },
  { sport: 'Volleyball', count: 60 },
  { sport: 'Table Tennis', count: 42 },
]

export const registrationsOverTime = [
  { month: 'Jul', regs: 20 },
  { month: 'Aug', regs: 64 },
  { month: 'Sep', regs: 110 },
  { month: 'Oct', regs: 142 },
  { month: 'Nov', regs: 95 },
  { month: 'Dec', regs: 48 },
]

export const participationByDept = [
  { name: 'Computer Science', value: 34 },
  { name: 'Electronics', value: 22 },
  { name: 'Mechanical', value: 18 },
  { name: 'Civil', value: 14 },
  { name: 'Others', value: 12 },
]

export const users = [
  { name: 'Amberneal Singh', email: 'student1@college.edu', role: 'Student', status: 'Active', last: '8 min ago' },
  { name: 'Prof. [Coordinator Name]', email: 'coordinator@college.edu', role: 'Coordinator', status: 'Active', last: '14 min ago' },
  { name: 'Simran Kaur', email: 'student2@college.edu', role: 'Student', status: 'Active', last: '1 h ago' },
  { name: 'Rohan Verma', email: 'student3@college.edu', role: 'Student', status: 'Active', last: '3 h ago' },
  { name: '[Admin Name]', email: 'admin@college.edu', role: 'Administrator', status: 'Active', last: '25 min ago' },
  { name: 'Karan Gill', email: 'student4@college.edu', role: 'Student', status: 'Pending', last: '2 days ago' },
]

export const activityLog = [
  { text: 'Role changed: user promoted to Coordinator', time: '15 min ago' },
  { text: 'New event published: Inter-Department Football Cup', time: '42 min ago' },
  { text: 'Facility booking approved: Badminton Hall, Fri 5–7 PM', time: '2 h ago' },
  { text: 'Match result published: Electrical Sparks 1–3 Thunderbolts FC', time: '4 h ago' },
]
