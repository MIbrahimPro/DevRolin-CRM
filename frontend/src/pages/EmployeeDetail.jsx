import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Tabs, Tab } from '@nextui-org/react';
import api from '../config/axios';

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
    fetchTasks();
    fetchStats();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await api.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/employees/${id}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/employees/${id}/statistics`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!employee) {
    return <Layout><div>Employee not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">
          {employee.firstName} {employee.lastName}
        </h1>

        <Tabs>
          <Tab key="overview" title="Overview">
            <Card className="mt-4">
              <CardBody>
                <p><strong>Position:</strong> {employee.position}</p>
                <p><strong>Department:</strong> {employee.department}</p>
                <p><strong>Employee ID:</strong> {employee.employeeId}</p>
                <p><strong>Hire Date:</strong> {new Date(employee.hireDate).toLocaleDateString()}</p>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="tasks" title="Tasks">
            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <Card key={task._id}>
                  <CardBody>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-foreground-500">{task.status}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
          <Tab key="statistics" title="Statistics">
            {stats && (
              <Card className="mt-4">
                <CardBody>
                  <p>Total Tasks: {stats.totalTasks}</p>
                  <p>Completed: {stats.completedTasks}</p>
                  <p>Present Days: {stats.presentDays}</p>
                </CardBody>
              </Card>
            )}
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
}

