import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Button, Chip, Tabs, Tab } from '@nextui-org/react';
import DocumentEditor from '../components/DocumentEditor';
import api from '../config/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchDocuments();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks?project=${id}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/documents?project=${id}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!project) {
    return <Layout><div>Project not found</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Chip className="mt-2">{project.status}</Chip>
          </div>
        </div>

        <Tabs>
          <Tab key="overview" title="Overview">
            <Card className="mt-4">
              <CardBody>
                <p>{project.description}</p>
              </CardBody>
            </Card>
          </Tab>
          <Tab key="tasks" title="Tasks">
            <div className="mt-4 space-y-2">
              {tasks.map((task) => (
                <Link key={task._id} to={`/tasks/${task._id}`}>
                  <Card isPressable>
                    <CardBody>
                      <div className="flex justify-between">
                        <span>{task.title}</span>
                        <Chip size="sm">{task.status}</Chip>
                      </div>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </Tab>
          <Tab key="documents" title="Documents">
            <div className="mt-4 space-y-2">
              {documents.map((doc) => (
                <Card key={doc._id}>
                  <CardBody>
                    <Link to={`/documents/${doc._id}`}>{doc.title}</Link>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </Layout>
  );
}

