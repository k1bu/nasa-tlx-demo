# NASA TLX Demo

A web application for administering the NASA Task Load Index (TLX) assessment with user authentication and role-based access control.

## Features

- **NASA TLX Assessment**: Complete implementation of the NASA Task Load Index with pairwise comparison weighting
- **User Authentication**: Secure login/registration system with session management
- **Role-Based Access Control**: Two user types:
  - **Regular Users**: Athletes, executives, and other participants taking TLX assessments
  - **Superusers**: Performance coaches and administrators who can view user data
- **Admin Dashboard**: Superusers can view users in their organization and TLX result statistics
- **Modern UI**: Clean, responsive interface built with SvelteKit and Tailwind CSS

## User Types

### Regular Users

- Can take TLX assessments
- Results are linked to their account
- Can view their own submission history (future feature)

### Superusers

- All regular user capabilities
- Can view all users in their organization
- Access to admin dashboard with user statistics
- Can see TLX result counts per user

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Environment variables configured

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nasa-tlx-demo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file
DATABASE_URL="your-postgres-connection-string"
```

4. Set up the database:

```bash
npm run db:push
```

5. Create a superuser account:

```bash
npm run create-superuser <email> <password> [organization]
```

6. Start the development server:

```bash
npm run dev
```

## Usage

### For Regular Users

1. Visit `/register` to create an account
2. Log in at `/login`
3. Take TLX assessments on the main page
4. Results are automatically saved to your account

### For Superusers

1. Create account using the script above or register normally
2. Log in at `/login`
3. Access admin dashboard at `/admin`
4. View user statistics and TLX result counts

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### TLX Assessment

- `POST /api/tlx` - Submit TLX results (requires authentication)

### Admin (Superuser Only)

- `GET /api/admin/users` - Get users in organization

## Database Schema

### Users Table

- `id` - Primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `role` - 'regular' or 'superuser'
- `organization` - Organization name (optional)
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

### TLX Results Table

- `id` - Primary key
- `user_id` - Foreign key to users table
- `task` - Task description
- `mental`, `physical`, `temporal`, `performance`, `effort`, `frustration` - TLX ratings
- `mental_weight`, `physical_weight`, etc. - Pairwise comparison weights (optional)
- `created_at` - Submission timestamp

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Role-Based Access**: API endpoints protected by role requirements
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM

## Development

### Adding New Features

1. Update database schema in `src/lib/server/db/schema.ts`
2. Run `npm run db:push` to apply changes
3. Add API endpoints in `src/routes/api/`
4. Create UI components in `src/routes/`

### Database Management

- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## Deployment

The application is configured for deployment on Vercel with Neon PostgreSQL. Set the `DATABASE_URL` environment variable in your deployment platform.

## License

[Add your license here]
