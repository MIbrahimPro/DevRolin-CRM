import Layout from '../components/Layout';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function ClientDashboard() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Client Portal</h1>
        <Card>
          <CardBody>
            <p>Client Dashboard content coming soon...</p>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}

