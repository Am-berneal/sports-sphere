import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import FindPlayers from './pages/FindPlayers'
import Matches from './pages/Matches'
import FacilityBooking from './pages/FacilityBooking'
import Notifications from './pages/Notifications'
import CoordinatorDashboard from './pages/CoordinatorDashboard'
import CreateEvent from './pages/CreateEvent'
import Approvals from './pages/Approvals'
import ScoreEntry from './pages/ScoreEntry'
import AdminDashboard from './pages/AdminDashboard'
import WeeklyDigest from './pages/WeeklyDigest'
import TrainingCoach from './pages/TrainingCoach'
import TeamBalancer from './pages/TeamBalancer'
import MatchRecap from './pages/MatchRecap'
import ParticipationInsights from './pages/ParticipationInsights'
import AskSportsSphere from './pages/AskSportsSphere'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Student */}
      <Route element={<Layout role="student" />}>
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/find-players" element={<FindPlayers />} />
        <Route path="/digest" element={<WeeklyDigest />} />
        <Route path="/training-coach" element={<TrainingCoach />} />
      </Route>

      {/* Shared screens: sidebar follows the logged-in role */}
      <Route element={<Layout />}>
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/facilities" element={<FacilityBooking />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Coordinator */}
      <Route element={<Layout role="coordinator" />}>
        <Route path="/coordinator" element={<CoordinatorDashboard />} />
        <Route path="/coordinator/create-event" element={<CreateEvent />} />
        <Route path="/coordinator/approvals" element={<Approvals />} />
        <Route path="/coordinator/scores" element={<ScoreEntry />} />
        <Route path="/coordinator/team-balancer" element={<TeamBalancer />} />
        <Route path="/coordinator/match-recap" element={<MatchRecap />} />
        <Route path="/coordinator/insights" element={<ParticipationInsights />} />
      </Route>

      {/* Administrator */}
      <Route element={<Layout role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/ask" element={<AskSportsSphere />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </ErrorBoundary>
  )
}
