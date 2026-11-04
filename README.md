# Sports Sphere — Frontend UI Prototype

An Integrated College Sports Management and Tournament Coordination System
Software Engineering Project · Thapar Institute of Engineering and Technology
Presenter: Amberneal Singh

This is the **React + Tailwind CSS frontend prototype**, built from the Google Stitch designs.
All data is **sample data** in `src/data/mockData.js`; there is no backend yet. The Flask REST API
and MySQL database are planned next.

## Run it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the link shown in the terminal (usually http://localhost:5173).

## Screens

| Route | Screen | Role |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Log in / Create account with role selection | Public |
| `/student` | Student dashboard | Student |
| `/events` | Events & tournaments (search + filters) | All |
| `/events/:id` | Event details + team registration | All |
| `/find-players` | Find players & teams | Student |
| `/matches` | Fixtures, results, standings | All |
| `/facilities` | Facility booking calendar | All |
| `/notifications` | Notifications | All |
| `/coordinator` | Coordinator dashboard | Coordinator |
| `/coordinator/create-event` | Create event form | Coordinator |
| `/coordinator/approvals` | Registration approvals | Coordinator |
| `/coordinator/scores` | Match score entry | Coordinator |
| `/admin` | Admin dashboard: charts, users & roles, reports, activity log | Admin |

### Smart features (new)

| Route | Screen | Role | Type |
|---|---|---|---|
| `/digest` | Smart Weekly Digest: settings + live email preview | Student | AI |
| `/training-coach` | Training Coach: 4-week practice plan with progress tracking | Student | AI |
| `/coordinator/team-balancer` | Smart Team Balancer: fair teams by skill + position, reshuffle, manual swap | Coordinator | Algorithm |
| `/coordinator/match-recap` | AI Match Recap: summary + 3 social captions, edit, approve & publish | Coordinator | AI |
| `/coordinator/insights` | Participation Insights: inactive students, nudge messages, low-turnout departments | Coordinator | AI |
| `/admin/ask` | Ask Sports Sphere: plain-English questions → answer, chart and read-only SQL | Admin | AI |

Use **Switch role (demo)** at the bottom of the sidebar to move between Student, Coordinator and Admin views.

## Working prototype logic (the three technical challenges)

1. **Booking conflict prevention** — `findConflict()` in `mockData.js`. Two bookings overlap when
   `startA < endB && startB < endA`. On `/facilities`, pick Thu 5–7 PM on the Main Football Ground
   to see the conflict warning and the "next available slot" suggestion.
2. **Role-based access control** — each role gets its own sidebar and screens; only coordinators
   see Score Entry, approval and booking-review actions. (Real enforcement will be on the Flask API.)
3. **Automatic tournament standings** — `computeStandings()` (Win 3, Draw 1, Loss 0, then goal
   difference). Publish a score on `/coordinator/scores` and the standings on `/matches` update.

## How the "AI" works in this prototype

The AI text (digest summary, match recap, captions, nudges, training plans) is produced by
templates in `src/lib/smartText.js`, and Ask Sports Sphere uses keyword rules in
`src/lib/askEngine.js`. This keeps the demo offline, fast and predictable.
In the final system each of these becomes a Flask endpoint that calls the **Gemini API**
(for example `POST /api/ai/digest`). Only the data a feature needs is sent — never passwords,
phone numbers or roll numbers. Ask Sports Sphere only runs read-only `SELECT` queries and is admin-only.

The Team Balancer (`src/lib/teamBalancer.js`) is our own algorithm: players are grouped by
position, and each player goes to the team with the lower total skill so far.

## Stability

- Every page is wrapped in an error boundary, so one broken page shows a message instead of a blank screen.
- All saved demo data (role, digest settings, confirmed teams, recaps, nudges, training progress) goes through
  a safe storage helper and falls back to defaults if the browser blocks storage.
- To reset the demo, clear site data in the browser or use "Reset demo data" on Score Entry.

## Project structure

```
src/
  App.jsx               routes
  components/Layout.jsx sidebar + top bar per role
  components/ui.jsx     shared UI (cards, badges, stat cards)
  data/mockData.js      sample data + conflict and standings logic
  data/smartData.js     sample data for the smart features
  lib/                  team balancer, AI text templates, Ask engine, safe storage
  pages/                one file per screen
public/images/          logo and photos
```

## Next steps (planned)

- Replace `mockData.js` with `fetch()` calls to the Flask REST API
- JWT login and server-side role checks
- MySQL tables: users, events, registrations, teams, team_members, matches, results, facilities, bookings
