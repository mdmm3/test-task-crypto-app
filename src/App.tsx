import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '@/shared/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RatesPage from '@/pages/RatesPage';
import ConvertPage from '@/pages/ConvertPage';
import useRatesStore from '@/services/ratesStore';
import useAuthStore from '@/services/authStore';

import './main.css';

function App() {
  const isAuthorized = useAuthStore(state => state.isAuthorized);
  const initRates = useRatesStore(state => state.init);
  const ratesStatus = useRatesStore(state => state.status);

  useEffect(() => {
    if (isAuthorized && ratesStatus === 'idle') {
      initRates();
    }
  }, [isAuthorized, ratesStatus]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/convert"
        element={
          <ProtectedRoute>
            <ConvertPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App;
