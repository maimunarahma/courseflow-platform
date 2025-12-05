import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import Assignment from "./pages/Assignment";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Payment from "./pages/payment";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";

import { CourseProvider } from "./hooks/use-courses";
import AddCourse from "./pages/AddCourse";
import EditCourseModal from "./pages/EditModal";
import { EnrollmentProvider } from "./hooks/use-enroll";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
       <CourseProvider>
        <EnrollmentProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Layout route wraps all pages that need navbar/footer */}
            <Route element={<Layout/>}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/payment" element={<Payment/> } />
              <Route path="/add-course" element={<AddCourse/> } />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit-modal" element={<EditCourseModal />} />
              <Route path="/learn/:id" element={<Learn />} />
              <Route path="/quiz/:courseId/:quizId" element={<Quiz />} />
              <Route path="/assignment/:id" element={<Assignment />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </EnrollmentProvider>
      </CourseProvider>
      
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
