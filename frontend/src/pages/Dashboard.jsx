import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'pm') {
        navigate('/pm', { replace: true });
      } else if (user.role === 'hr') {
        navigate('/hr', { replace: true });
      } else if (user.role === 'client') {
        navigate('/client', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  );
}

