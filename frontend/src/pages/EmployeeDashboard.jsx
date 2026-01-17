import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/axios';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTodayStatus();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const response = await api.get('/attendance/today');
      setCheckedIn(response.data.checkedIn);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.post('/attendance/checkin', { location: 'remote' });
      setCheckedIn(true);
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        
        {user?.role === 'employee' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Attendance</h3>
            </CardHeader>
            <CardBody>
              {checkedIn ? (
                <p className="text-green-600">You have checked in today</p>
              ) : (
                <Button
                  color="primary"
                  size="lg"
                  onPress={handleCheckIn}
                  isLoading={loading}
                >
                  Check In
                </Button>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </Layout>
  );
}

