import { Route, Routes } from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import RegisterPage from "./pages/Register/RegisterPage"
import HomePage from "./pages/Home/HomePage"
import Layout from "./Layout"
import UserProfilePage from "./pages/UserProfile/UserProfilePage"
import AskQuestionPage from "./pages/AskQuestion/AskQuestionPage"
import QuestionDetailPage from "./pages/QuestionDetail/QuestionDetailPage"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import HealthCheck from "./pages/Admin/HealthCheck"
import EditProfilePage from "./pages/UserProfile/EditProfilePage"
import VerifyEmailPage from "./pages/UserProfile/VerifyEmailPage"
import ResetPasswordPage from "./pages/UserProfile/ResetPasswordPage"
import { AdminOnly } from "./components/CustomeRoutes"
import ProfileLayout from "./ProfileLayout"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="" element={<ProfileLayout />}>
          <Route path="/profile/:username" element={<UserProfilePage />} />
          <Route path="/profile/:username/edit" element={<EditProfilePage />} />
          <Route path="/profile/:username/verify-email" element={<VerifyEmailPage />} />
          <Route path="/profile/:username/reset-password" element={<ResetPasswordPage />} />
          <Route path="" element={<AdminOnly />}>
            <Route path="/health" element={<HealthCheck />} />
            <Route path="/tag" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="/ask" element={<AskQuestionPage />} />
      <Route path="/profile/reset-password" element={<ResetPasswordPage />} />
      <Route path="/question/:encryptedPostId" element={<QuestionDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App