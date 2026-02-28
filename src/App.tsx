
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

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
import { ChatProvider } from "./hooks/use-chat";
import AddCourse from "./pages/AddCourse";
import EditCourseModal from "./pages/EditModal";
import { EnrollmentProvider } from "./hooks/use-enroll";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Sonner } from "./components/ui/sonner";
import Private from "./pages/Private";
import Unauthorized from "./pages/Unauthorized";


const queryClient = new QueryClient();

const App = () => {
  // Apply dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CourseProvider>
        <EnrollmentProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster/>
              <Sonner/>
              <BrowserRouter>
          <Routes>
            {/* Layout route wraps all pages that need navbar/footer */}
            <Route element={<Layout/>}>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/payment" element={<Payment/> } />
              <Route path="/add-course" element={<Private requiredRole="admin"><AddCourse/></Private>} />
              <Route path="/courses/:id" element={<CourseDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* EditCourseModal is used as a component in Admin page, not a route */}
              <Route path="/learn/:id" element={<Learn />} />
              <Route path="/quiz/:courseId" element={<Quiz />} />
              <Route path="/assignment/:id" element={<Assignment />} />
              <Route path="/admin" element={<Private requiredRole="admin"><Admin /></Private>} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ChatProvider>
    </EnrollmentProvider>
    </CourseProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
