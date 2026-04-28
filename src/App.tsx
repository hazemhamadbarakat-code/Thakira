import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/auth/AuthContext";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
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
import ChapterDetail from "./pages/ChapterDetail";
import ArchiveDetail from "./pages/ArchiveDetail";

import Quiz from "./pages/Quiz";
import Daleel from "./pages/Daleel";

import AdminOverview from "./pages/AdminOverview";
import AdminUsers from "./pages/AdminUsers";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminLogs from "./pages/AdminLogs";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const memberOnly = ["member"] as const;
const adminOnly = ["admin"] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover" element={<RecoveryStep1 />} />
            <Route path="/recover/verify" element={<RecoveryStep2 />} />
            <Route path="/recover/reset" element={<RecoveryStep3 />} />

            {/* Community Member routes */}
            <Route path="/discover" element={<ProtectedRoute allow={[...memberOnly]}><Discover /></ProtectedRoute>} />
            <Route path="/archive" element={<ProtectedRoute allow={[...memberOnly]}><Archive /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute allow={[...memberOnly]}><HeritageCollection /></ProtectedRoute>} />
            <Route path="/journey" element={<ProtectedRoute allow={[...memberOnly]}><Journey /></ProtectedRoute>} />
            <Route path="/journey/:chapterId" element={<ProtectedRoute allow={[...memberOnly]}><ChapterDetail /></ProtectedRoute>} />
            <Route path="/archive/:archiveId" element={<ProtectedRoute allow={[...memberOnly]}><ArchiveDetail /></ProtectedRoute>} />
            <Route path="/contribute" element={<ProtectedRoute allow={[...memberOnly]}><Contribute /></ProtectedRoute>} />
            <Route path="/submissions" element={<ProtectedRoute allow={[...memberOnly]}><SubmissionStatus /></ProtectedRoute>} />
            <Route path="/submissions/rejected" element={<ProtectedRoute allow={[...memberOnly]}><SubmissionRejected /></ProtectedRoute>} />
            <Route path="/vr" element={<ProtectedRoute allow={[...memberOnly]}><VrLoading /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allow={[...memberOnly]}><StorytellerProfile /></ProtectedRoute>} />
            <Route path="/quiz" element={<ProtectedRoute allow={[...memberOnly]}><Quiz /></ProtectedRoute>} />
            <Route path="/daleel" element={<ProtectedRoute allow={[...memberOnly]}><Daleel /></ProtectedRoute>} />

            {/* Administrator routes */}
            <Route path="/admin" element={<ProtectedRoute allow={[...adminOnly]}><AdminOverview /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allow={[...adminOnly]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/maintenance" element={<ProtectedRoute allow={[...adminOnly]}><AdminMaintenance /></ProtectedRoute>} />
            <Route path="/admin/logs" element={<ProtectedRoute allow={[...adminOnly]}><AdminLogs /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
