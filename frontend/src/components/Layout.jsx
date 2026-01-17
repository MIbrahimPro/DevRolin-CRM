import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from '@nextui-org/react';
import { Sun, Moon, LogOut, Settings, User } from 'lucide-react';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projects', path: '/projects', roles: ['admin', 'pm', 'employee'] },
    { name: 'Tasks', path: '/tasks', roles: ['admin', 'pm', 'employee'] },
    { name: 'Employees', path: '/employees', roles: ['admin', 'hr', 'pm'] },
    { name: 'Recruitment', path: '/recruitment', roles: ['admin', 'hr', 'pm'] },
    { name: 'Attendance', path: '/attendance', roles: ['admin', 'pm', 'hr', 'employee'] },
    { name: 'Leaves', path: '/leaves', roles: ['admin', 'pm', 'hr', 'employee'] },
    { name: 'Reports', path: '/reports', roles: ['admin', 'hr', 'pm'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuOpenChange={setIsMenuOpen} isBordered>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link to="/dashboard" className="font-bold text-xl">
              DevRolin CRM
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {filteredMenuItems.map((item) => (
            <NavbarItem key={item.path} isActive={location.pathname === item.path}>
              <Link to={item.path} color={location.pathname === item.path ? 'primary' : 'foreground'}>
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  size="sm"
                  name={profile?.firstName || user?.email}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" startContent={<User size={16} />}>
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.email}
                </DropdownItem>
                <DropdownItem key="settings" startContent={<Settings size={16} />}>
                  <Link to="/settings">Settings</Link>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut size={16} />}
                  onPress={handleLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {filteredMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.path}-${index}`}>
              <Link
                to={item.path}
                className="w-full"
                color={location.pathname === item.path ? 'primary' : 'foreground'}
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}

