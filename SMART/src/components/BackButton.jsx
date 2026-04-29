import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const DASHBOARD_ORDER = [
  'overview',
  'predict',
  'diet',
  'exercise',
  'appointments',
  'chatbot'
];

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleBack = () => {
    // Check if we are inside a dashboard route
    const match = location.pathname.match(/\/dashboard\/(\w+)/);
    if (match) {
      const currentPage = match[1];
      const currentIndex = DASHBOARD_ORDER.indexOf(currentPage);
      
      if (currentIndex > 0) {
        // Go to the previous attribute (menu item) in the dashboard
        const prevPage = DASHBOARD_ORDER[currentIndex - 1];
        navigate(`/dashboard/${prevPage}`);
        window.scrollTo(0, 0);
        return;
      } else if (currentIndex === 0) {
        // If on overview (first attribute), log out and go to login page
        logout();
        navigate('/login');
        return;
      }
    }
    
    // Default fallback to browser history back (for Home, Login, etc.)
    navigate(-1);
  };

  return (
    <div className="back-nav-container">
      <button className="back-btn" onClick={handleBack}>
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>
    </div>
  );
}
