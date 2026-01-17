# DevRolin CRM

A comprehensive, centralized CRM system for managing DevRolin's internal operations, client requirements, and automated workflows.

## Features

- **Multi-Role System**: Admin, Project Manager (PM), HR, Employee, and Client roles
- **Employee Management**: Complete employee lifecycle management with documents, performance tracking
- **Recruitment Workflow**: Full hiring pipeline from request to onboarding
- **Project & Task Management**: Project creation, task assignment, milestone tracking, and review workflows
- **Document Management**: BlockNote-based document editor with live and static sharing modes
- **Attendance Tracking**: Check-in system for employees
- **Leave Management**: Leave applications with approval workflows
- **Client Portal**: Client access to shared documents and project communication
- **Meetings**: Jitsi integration for video meetings
- **Reporting**: Weekly and monthly reports with PDF/Excel export
- **Dark/Light Mode**: User preference-based theme switching

## Tech Stack

### Backend
- Node.js (ES Modules)
- Express.js
- MongoDB with Mongoose
- Socket.io for real-time features
- JWT authentication
- Jitsi integration

### Frontend
- React 19
- React Router
- HeroUI (NextUI-like component library)
- BlockNote for document editing
- Socket.io Client
- Axios for API calls
- Tailwind CSS

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devrolin-crm
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
JITSI_APP_ID=your-jitsi-app-id
JITSI_KID=your-jitsi-kid
JITSI_SECRET=your-jitsi-secret
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## User Roles & Permissions

### Admin
- Full system access
- Project approvals
- Employee termination
- Override leave decisions
- System-wide reports

### Project Manager (PM)
- Create and manage projects
- Assign tasks to team members
- Review and approve tasks
- Create client credentials
- Share documents with clients
- Approve leave requests

### HR
- Manage recruitment pipeline
- Create job postings
- Schedule interviews
- Manage employee records
- Generate HR reports
- Flag suspicious leave patterns

### Employee
- Check in daily
- View and update assigned tasks
- Update task progress and milestones
- Apply for leaves
- View personal documents

### Client
- View shared documents
- Answer project questions
- Participate in live document editing (if granted)
- Access project information (limited)

## Key Workflows

### Recruitment Workflow
1. PM creates hiring request
2. HR receives request and creates job posting
3. Candidates apply (via CRM or LinkedIn)
4. HR schedules meetings via Jitsi
5. HR selects candidate
6. Admin approves hiring
7. Employee account created and activated

### Project Workflow
1. PM creates project (pending approval)
2. Admin approves project
3. PM defines scope, timeline, budget
4. PM assigns team members
5. Team chat automatically created
6. PM creates tasks and assigns to team
7. Team members work on tasks and update milestones
8. Tasks submitted for review
9. PM reviews and accepts/rejects with feedback

### Document Sharing
- **Static Share**: Client receives current version, not updated automatically
- **Live Share**: Client can edit and see real-time changes

### Attendance
- Employees check in daily via button (remote)
- Onsite employees use fingerprint machine (future implementation)
- Attendance tracked and reported

### Leave Management
1. Employee applies for leave
2. PM approves/rejects within 24 hours
3. If approved, leave balance auto-updated
4. HR can flag suspicious patterns
5. Admin can override any decision

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update preferences
- `POST /api/auth/create-client` - Create client credentials (PM only)

### Employees
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Terminate employee

### Projects
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (PM)
- `PUT /api/projects/:id/approve` - Approve project (Admin)

### Tasks
- `GET /api/tasks` - List tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/submit` - Submit for review
- `PUT /api/tasks/:id/review` - Review task (PM)

### Documents
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `POST /api/documents` - Create document
- `PUT /api/documents/:id` - Update document
- `POST /api/documents/:id/share` - Share document

### Attendance
- `POST /api/attendance/checkin` - Check in
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/today` - Get today's status

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves` - List leaves
- `PUT /api/leaves/:id/approve` - Approve leave (PM)
- `PUT /api/leaves/:id/reject` - Reject leave (PM)

### Reports
- `GET /api/reports/weekly` - Weekly report
- `GET /api/reports/monthly` - Monthly report
- `GET /api/reports/export/xlsx` - Export to Excel
- `GET /api/reports/export/pdf` - Export to PDF

## Development

### Adding New Features
1. Backend: Add route in `backend/routes/`
2. Frontend: Add page in `frontend/src/pages/`
3. Update navigation in `frontend/src/components/Layout.jsx`

### Database Models
All models are in `backend/models/` directory. Use Mongoose schemas for data validation.

## Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Update `JWT_SECRET` to a secure random string
3. Update MongoDB URI to production database
4. Configure Jitsi credentials
5. Build frontend: `cd frontend && npm run build`
6. Serve frontend build or use a static hosting service
7. Use PM2 or similar to run backend server

## License

Proprietary - DevRolin Internal Use Only

## Support

For issues or questions, contact the development team.

