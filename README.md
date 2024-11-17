# Nest.js | Prisma | Cloudinary Starter Kit

A robust starter template for Nest.js applications with pre-configured essential modules and security features.

P.S: this is opinionated and may not fit all use cases, but it's a good starting point that you can customize.

## Features

### Authentication & Authorization
- Built-in authentication system
- Role-based access control (ADMIN, SELLER, CLIENT)
- API Key protection
- Guards implementation for security

### User Management
- User registration and authentication
- Password reset functionality
- Role management
- Profile image handling

### Image Handling
- Image upload and storage
- Image URL management
- Built-in Image module

### Email System
- Email service integration
- Password reset email functionality
- Email module for communication

### Database Integration
- Prisma ORM integration
- MySQL database support
- Pre-configured schema with:
  - User management
  - Image storage
  - Password reset tokens

### Security Features
- API Key Guard
- Authentication Guard
- Roles Guard
- Password hashing
- Token-based authentication

## Database Schema

The starter kit includes a Prisma schema with the following models:
- User (with role-based access)
- Image
- PasswordResetToken

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up your environment variables:
   - Create a `.env` file
   - Add your `DATABASE_URL`

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the application:
```bash
npm run start:dev
```

## Environment Variables

Make sure to set up the following environment variables:
- `DATABASE_URL`: Your MySQL database connection string
- Other configuration variables as needed

## Contributing

Feel free to submit issues and pull requests.

## License

MIT
