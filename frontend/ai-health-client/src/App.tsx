import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AiRecommendationPage from "./pages/AiRecommendationPage";
import NutritionPlanPage from "./pages/NutritionPlanPage";
import WaterTrackerPage from "./pages/WaterTrackerPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage"; 
import WorkoutPlanPage from "./pages/WorkoutPlanPage";
import AiChatPage from "./pages/AiChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ai-chat" element={<AiChatPage />} />
        <Route path="/workout-plan" element={<WorkoutPlanPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/water-tracker" element={<WaterTrackerPage />} />
        <Route path="/nutrition-plan" element={<NutritionPlanPage />} />
        <Route path="/ai-recommendation" element={<AiRecommendationPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;