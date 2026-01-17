import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import api from '../config/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    activeTasks: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, projectsRes, tasksRes] = await Promise.all([
        api.get('/employees'),
        api.get('/projects'),
        api.get('/tasks')
      ]);

      setStats({
        employees: employeesRes.data.length,
        projects: projectsRes.data.length,
        activeTasks: tasksRes.data.filter(t => t.status === 'in-progress').length,
        pendingApprovals: projectsRes.data.filter(p => p.status === 'pending').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Total Employees</h3>
            </CardHeader>
            <CardBody>
              <p className="text-3xl font-bold">{stats.employees}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Total Projects</h3>
            </CardHeader>
            <CardBody>
              <p className="text-3xl font-bold">{stats.projects}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Active Tasks</h3>
            </CardHeader>
            <CardBody>
              <p className="text-3xl font-bold">{stats.activeTasks}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Pending Approvals</h3>
            </CardHeader>
            <CardBody>
              <p className="text-3xl font-bold">{stats.pendingApprovals}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

