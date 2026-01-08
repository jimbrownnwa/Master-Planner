import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext';
import { LoginPage } from './features/auth/LoginPage';
import { SignupPage } from './features/auth/SignupPage';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { WeeklyPlanningView } from './pages/WeeklyPlanningView';
import { GoalsProjectsView } from './pages/GoalsProjectsView';
import { DailyFocusView } from './pages/DailyFocusView';
import { ReflectionView } from './pages/ReflectionView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<WeeklyPlanningView />} />
              <Route path="goals" element={<GoalsProjectsView />} />
              <Route path="focus" element={<DailyFocusView />} />
              <Route path="reflect" element={<ReflectionView />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
