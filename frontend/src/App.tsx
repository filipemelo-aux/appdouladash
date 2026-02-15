
// FIX: Changed to namespace import for react-router-dom to work around potential module resolution issues where named exports are not found.
import * as ReactRouterDOM from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ClientsPage from './pages/ClientsPage';
import AgendaPage from './pages/AgendaPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <ReactRouterDOM.BrowserRouter>
      <ReactRouterDOM.Routes>
        {/* Rotas Públicas */}
        <ReactRouterDOM.Route path="/" element={<ReactRouterDOM.Navigate to="/login" replace />} />
        <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
        
        {/* Rotas de Administração Protegidas com Layout */}
        <ReactRouterDOM.Route
          element={
            <ProtectedRoute allowedRoles={['admin', 'assistant']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <ReactRouterDOM.Route path="/dashboard" element={<AdminDashboardPage />} />
          <ReactRouterDOM.Route path="/clients" element={<ClientsPage />} />
          <ReactRouterDOM.Route path="/agenda" element={<AgendaPage />} />
          <ReactRouterDOM.Route path="/settings" element={<SettingsPage />} />
        </ReactRouterDOM.Route>

        {/* Outras Rotas Protegidas */}
        <ReactRouterDOM.Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientDashboardPage />
            </ProtectedRoute>
          }
        />
        <ReactRouterDOM.Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          }
        />
        
        {/* Rota de Fallback */}
        <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to="/login" replace />} />
      </ReactRouterDOM.Routes>
    </ReactRouterDOM.BrowserRouter>
  );
}

export default App;