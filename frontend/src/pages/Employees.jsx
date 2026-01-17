import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardBody, Avatar } from '@nextui-org/react';
import api from '../config/axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Employees</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {employees.map((employee) => (
            <Link key={employee._id} to={`/employees/${employee._id}`}>
              <Card isPressable>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={`${employee.firstName} ${employee.lastName}`}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <p className="text-sm text-foreground-500">{employee.position}</p>
                      <p className="text-sm text-foreground-500">{employee.department}</p>
                    </div>
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

