import Layout from '../components/Layout';
import { Card, CardBody, CardHeader, Switch, Button } from '@nextui-org/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

export default function Settings() {
  const { user, updatePreferences } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true);

  const handleNotificationChange = async (value) => {
    setNotifications(value);
    await updatePreferences({ notifications: value });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Preferences</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-foreground-500">Toggle between light and dark theme</p>
              </div>
              <Switch isSelected={theme === 'dark'} onValueChange={toggleTheme} />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-foreground-500">Enable or disable notifications</p>
              </div>
              <Switch isSelected={notifications} onValueChange={handleNotificationChange} />
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}

