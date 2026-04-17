import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import RegisterPage from "./pages/Register/RegisterPage"
import HomePage from "./pages/Home/HomePage"
import Layout from "./Layout"
import UserProfilePage from "./pages/UserProfile/UserProfilePage"
import AskQuestionPage from "./pages/AskQuestion/AskQuestionPage"
import QuestionDetailPage from "./pages/QuestionDetail/QuestionDetailPage"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import HealthCheck from "./pages/HealthCheck"
import { AdminOnly } from "./components/CustomeRoutes"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route path="/ask" element={<AskQuestionPage />} />
      <Route path="/profile/:username" element={<UserProfilePage />} />
      <Route path="/question/:postId" element={<QuestionDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<AdminOnly />}>
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  )
}

export default App;
