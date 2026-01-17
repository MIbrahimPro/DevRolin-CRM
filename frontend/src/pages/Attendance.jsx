import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import api from '../config/axios';

export default function Attendance() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTodayStatus();
    fetchAttendance();
  }, []);

  const checkTodayStatus = async () => {
    try {
      const response = await api.get('/attendance/today');
      setCheckedIn(response.data.checkedIn);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.post('/attendance/checkin', { location: 'remote' });
      setCheckedIn(true);
      fetchAttendance();
    } catch (error) {
      console.error('Error checking in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Attendance</h1>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Check In</h3>
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

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Attendance History</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {attendance.map((record) => (
                <div key={record._id} className="flex justify-between">
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                  <span>{record.status}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}

