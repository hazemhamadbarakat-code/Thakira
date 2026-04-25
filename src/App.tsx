import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import RecoveryStep1 from "./pages/RecoveryStep1";
import RecoveryStep2 from "./pages/RecoveryStep2";
import RecoveryStep3 from "./pages/RecoveryStep3";

import Discover from "./pages/Discover";
import Archive from "./pages/Archive";
import HeritageCollection from "./pages/HeritageCollection";
import Journey from "./pages/Journey";
import Contribute from "./pages/Contribute";
import SubmissionStatus from "./pages/SubmissionStatus";
import SubmissionRejected from "./pages/SubmissionRejected";
import VrLoading from "./pages/VrLoading";
import StorytellerProfile from "./pages/StorytellerProfile";

import Quiz from "./pages/Quiz";
import Daleel from "./pages/Daleel";

import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminLogs from "./pages/AdminLogs";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recover" element={<RecoveryStep1 />} />
          <Route path="/recover/verify" element={<RecoveryStep2 />} />
          <Route path="/recover/reset" element={<RecoveryStep3 />} />

          <Route path="/discover" element={<Discover />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/saved" element={<HeritageCollection />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/submissions" element={<SubmissionStatus />} />
          <Route path="/submissions/rejected" element={<SubmissionRejected />} />
          <Route path="/vr" element={<VrLoading />} />
          <Route path="/profile" element={<StorytellerProfile />} />

          <Route path="/quiz" element={<Quiz />} />
          <Route path="/daleel" element={<Daleel />} />

          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/logs" element={<AdminLogs />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
