import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useTheme } from '../contexts/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      // Navigate based on role
      const userRole = result.user?.role;
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'pm') {
        navigate('/pm');
      } else if (userRole === 'hr') {
        navigate('/hr');
      } else if (userRole === 'client') {
        navigate('/client');
      } else {
        navigate('/employee');
      }
    } else {
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center pt-6">
          <h1 className="text-3xl font-bold">DevRolin CRM</h1>
          <p className="text-sm text-foreground-500">Sign in to your account</p>
        </CardHeader>
        <CardBody className="gap-4 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-danger-50 text-danger text-sm rounded-lg">
                {error}
              </div>
            )}
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

