// ------------------------------------------------------------------
// SAMPLE DATA for the smart features. Not real people or figures.
// ------------------------------------------------------------------

export const SKILL_LABEL = (s) => (s >= 8 ? 'Advanced' : s >= 5 ? 'Intermediate' : 'Beginner')

// 22 checked-in players for an intramural football friendly
// If you add src/data/real/players.json (made by scripts/convert_players.py),
// the app uses it automatically. Otherwise it uses the sample list below.
const REAL = import.meta.glob('./real/*.json', { eager: true, import: 'default' })

const samplePool = [
  { id: 'p1', name: 'Amberneal Singh', dept: 'CSE', pos: 'MID', role: 'CM', skill: 8 },
  { id: 'p2', name: 'Arjun Rao', dept: 'Mech', pos: 'DEF', role: 'CB', skill: 8 },
  { id: 'p3', name: 'Kunal Sharma', dept: 'Civil', pos: 'DEF', role: 'CB', skill: 8 },
  { id: 'p4', name: 'Vikram Sen', dept: 'Chem', pos: 'GK', role: 'GK', skill: 8 },
  { id: 'p5', name: 'Pranav Joshi', dept: 'Mech', pos: 'GK', role: 'GK', skill: 7 },
  { id: 'p6', name: 'Rohan Mehta', dept: 'ECE', pos: 'FWD', role: 'ST', skill: 9 },
  { id: 'p7', name: 'Dev Patel', dept: 'EE', pos: 'MID', role: 'LM', skill: 6 },
  { id: 'p8', name: 'Aditya Nair', dept: 'CSE', pos: 'DEF', role: 'RB', skill: 6 },
  { id: 'p9', name: 'Siddharth M.', dept: 'Meta', pos: 'DEF', role: 'LB', skill: 4 },
  { id: 'p10', name: 'Ayush B.', dept: 'Aero', pos: 'FWD', role: 'RW', skill: 4 },
  { id: 'p11', name: 'Karthik V.', dept: 'Civil', pos: 'DEF', role: 'CB', skill: 6 },
  { id: 'p12', name: 'Nikhil P.', dept: 'EE', pos: 'DEF', role: 'RB', skill: 5 },
  { id: 'p13', name: 'Farhan A.', dept: 'ECE', pos: 'DEF', role: 'CB', skill: 6 },
  { id: 'p14', name: 'Gaurav R.', dept: 'EE', pos: 'DEF', role: 'LB', skill: 3 },
  { id: 'p15', name: 'Harsh Vardhan', dept: 'Chem', pos: 'MID', role: 'CM', skill: 8 },
  { id: 'p16', name: 'Rahul D.', dept: 'Mech', pos: 'MID', role: 'LM', skill: 6 },
  { id: 'p17', name: 'Varun T.', dept: 'CSE', pos: 'MID', role: 'RM', skill: 5 },
  { id: 'p18', name: 'Aman Verma', dept: 'Mech', pos: 'MID', role: 'RM', skill: 4 },
  { id: 'p19', name: 'Mayank S.', dept: 'Aero', pos: 'FWD', role: 'ST', skill: 8 },
  { id: 'p20', name: 'Tanmay G.', dept: 'CSE', pos: 'FWD', role: 'LW', skill: 6 },
  { id: 'p21', name: 'Sameer K.', dept: 'Civil', pos: 'FWD', role: 'RW', skill: 5 },
  { id: 'p22', name: 'Deepak K.', dept: 'Meta', pos: 'FWD', role: 'LW', skill: 6 },
]

export const footballPool = Array.isArray(REAL['./real/players.json']) ? REAL['./real/players.json'] : samplePool

export const POSITIONS = [
  ['GK', 'Goalkeeper'],
  ['DEF', 'Defenders'],
  ['MID', 'Midfielders'],
  ['FWD', 'Forwards'],
]

// ---------- Participation table used by "Ask Sports Sphere" ----------
// participants[department][sport] = number of students who played (this semester)
export const DEPTS = ['Computer Science', 'Electronics', 'Mechanical', 'Electrical', 'Civil', 'Chemical']
export const SPORT_LIST = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Volleyball', 'Table Tennis']

export const participants = {
  'Computer Science': { Football: 38, Cricket: 30, Badminton: 22, Basketball: 14, Volleyball: 9, 'Table Tennis': 11 },
  Electronics: { Football: 27, Cricket: 24, Badminton: 18, Basketball: 12, Volleyball: 10, 'Table Tennis': 7 },
  Mechanical: { Football: 34, Cricket: 26, Badminton: 10, Basketball: 8, Volleyball: 12, 'Table Tennis': 4 },
  Electrical: { Football: 18, Cricket: 20, Badminton: 14, Basketball: 6, Volleyball: 8, 'Table Tennis': 6 },
  Civil: { Football: 22, Cricket: 18, Badminton: 8, Basketball: 5, Volleyball: 7, 'Table Tennis': 3 },
  Chemical: { Football: 12, Cricket: 14, Badminton: 9, Basketball: 4, Volleyball: 5, 'Table Tennis': 5 },
}

// enrolled students per department (sample) — used for "students with no event"
export const enrolled = {
  'Computer Science': 240, Electronics: 180, Mechanical: 170, Electrical: 140, Civil: 130, Chemical: 110,
}
// students who played at least one event (a student can play several sports)
export const activeStudents = {
  'Computer Science': 96, Electronics: 70, Mechanical: 64, Electrical: 46, Civil: 40, Chemical: 30,
}

export const facilityBookings = {
  'Main Football Ground': 34, 'Indoor Badminton Hall': 41, 'Basketball Court B': 22, 'Cricket Nets': 27, Gymnasium: 15,
}

// ---------- Participation Insights ----------
export const inactiveStudents = [
  { id: 's1', name: 'Rohan Verma', dept: 'Mechanical', year: '2nd year', lastSport: 'Cricket', lastActive: 42, interest: 'Cricket', level: 'Intermediate' },
  { id: 's2', name: 'Ananya Deshmukh', dept: 'Civil', year: '1st year', lastSport: 'Volleyball', lastActive: 30, interest: 'Volleyball', level: 'Beginner' },
  { id: 's3', name: 'Karthik Subramanian', dept: 'Chemical', year: '3rd year', lastSport: 'Football', lastActive: 55, interest: 'Football', level: 'Intermediate' },
  { id: 's4', name: 'Pooja Bhatt', dept: 'Electrical', year: '1st year', lastSport: 'Badminton', lastActive: 36, interest: 'Badminton', level: 'Beginner' },
  { id: 's5', name: 'Irfan Qureshi', dept: 'Civil', year: '2nd year', lastSport: 'Basketball', lastActive: 61, interest: 'Basketball', level: 'Beginner' },
  { id: 's6', name: 'Meera Pillai', dept: 'Chemical', year: '2nd year', lastSport: 'Table Tennis', lastActive: 33, interest: 'Table Tennis', level: 'Intermediate' },
]

export const beginnerEvents = {
  Cricket: 'Box Cricket Evening League (starts next Monday)',
  Volleyball: 'Intramural Volleyball League — beginner pool',
  Football: '5-a-side Weekend Friendlies',
  Badminton: 'Beginner Badminton Social (Friday 5 PM)',
  Basketball: '3v3 Half-Court Basketball — open entry',
  'Table Tennis': 'Table Tennis Ladder — casual round',
}

// ---------- Training coach drill library ----------
export const drills = {
  Football: {
    focus: ['Ball control & first touch', 'Passing accuracy', 'Positioning & movement', 'Match fitness & finishing'],
    sessions: ['Cone dribbling + first-touch drills', 'Short & long passing pairs', 'Small-sided game (5v5)', 'Shooting & finishing practice', 'Sprint intervals + agility ladder', 'Defensive shape & pressing'],
  },
  Badminton: {
    focus: ['Footwork foundations', 'Clears & drops', 'Smash & net play', 'Match play & stamina'],
    sessions: ['Six-corner footwork drill', 'High clear & drop shot rally', 'Smash + net kill practice', 'Serve & return accuracy', 'Shadow badminton intervals', 'Practice match (best of 3)'],
  },
  Cricket: {
    focus: ['Batting basics & stance', 'Bowling line & length', 'Fielding & catching', 'Match simulation'],
    sessions: ['Front-foot & back-foot drives (nets)', 'Bowling line & length targets', 'High-catch & ground fielding', 'Running between wickets', 'Throwing accuracy drills', 'Net session vs pace & spin'],
  },
  Basketball: {
    focus: ['Ball handling', 'Shooting form', 'Defence & rebounding', 'Game situations'],
    sessions: ['Two-ball dribbling drills', 'Form shooting close to the basket', 'Lay-up lines (both hands)', 'Defensive slides + box-out', 'Free-throw routine', '3v3 half-court scrimmage'],
  },
  Volleyball: {
    focus: ['Passing & platform', 'Setting', 'Serving & attacking', 'Team rotation'],
    sessions: ['Forearm passing pairs', 'Overhead setting to target', 'Float serve practice', 'Approach & spike timing', 'Blocking footwork', 'Rotation drill + mini match'],
  },
  'Table Tennis': {
    focus: ['Grip & basic strokes', 'Spin control', 'Serve & receive', 'Rally & match play'],
    sessions: ['Forehand & backhand drive rally', 'Push & chop control', 'Topspin serve practice', 'Receive vs spin serves', 'Footwork side-to-side drill', 'Practice games to 11'],
  },
}
