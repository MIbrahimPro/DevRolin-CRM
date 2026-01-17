import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Button, Chip } from '@nextui-org/react';
import api from '../config/axios';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            approved: 'success',
            active: 'primary',
            'on-hold': 'default',
            completed: 'success',
            cancelled: 'danger'
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return <Layout><div>Loading...</div></Layout>;
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Projects</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <Link key={project._id} to={`/projects/${project._id}`}>
                            <Card isPressable className="h-full">
                                <CardHeader>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="text-lg font-semibold">{project.name}</h3>
                                        <Chip size="sm" color={getStatusColor(project.status)}>
                                            {project.status}
                                        </Chip>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-sm text-foreground-500 line-clamp-2">
                                        {project.description}
                                    </p>
                                </CardBody>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

