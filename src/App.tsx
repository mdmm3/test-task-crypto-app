import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '@/shared/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';

import './main.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            Rates
          </ProtectedRoute>
        }
      />
      <Route
        path="/convert"
        element={
          <ProtectedRoute>
            Convert
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App;
