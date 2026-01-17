import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Chip } from '@nextui-org/react';
import api from '../config/axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      todo: 'default',
      'in-progress': 'primary',
      review: 'warning',
      completed: 'success',
      rejected: 'danger'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        <div className="space-y-2">
          {tasks.map((task) => (
            <Link key={task._id} to={`/tasks/${task._id}`}>
              <Card isPressable>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      {task.project && (
                        <p className="text-sm text-foreground-500">{task.project.name}</p>
                      )}
                    </div>
                    <Chip color={getStatusColor(task.status)}>{task.status}</Chip>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

