import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Button, Chip, Progress } from '@nextui-org/react';
import api from '../config/axios';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/tasks/${id}/submit`);
      fetchTask();
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!task) {
    return <Layout><div>Task not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{task.title}</h1>
            <Chip className="mt-2">{task.status}</Chip>
          </div>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Description</h3>
          </CardHeader>
          <CardBody>
            <p>{task.description}</p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Progress</h3>
          </CardHeader>
          <CardBody>
            <Progress value={task.progress} className="w-full" />
            <p className="text-sm mt-2">{task.progress}% complete</p>
          </CardBody>
        </Card>

        {task.milestones && task.milestones.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Milestones</h3>
            </CardHeader>
            <CardBody>
              {task.milestones.map((milestone, idx) => (
                <div key={idx} className="mb-4">
                  <h4 className="font-semibold">{milestone.title}</h4>
                  {milestone.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={step.completed}
                        readOnly
                      />
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {task.status === 'in-progress' && (
          <Button color="primary" onPress={handleSubmit}>
            Submit for Review
          </Button>
        )}
      </div>
    </Layout>
  );
}

