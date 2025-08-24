# Clerk + FastAPI Integration Setup

This guide explains how to set up Clerk authentication with your FastAPI backend.

## Prerequisites

1. A Clerk account and application
2. Your Clerk API keys
3. Python environment with the required packages

## Environment Variables

Create a `.env` file in the `apps/api` directory with the following variables:

```bash
# Clerk Configuration
CLERK_API_KEY=sk_test_zNGCYI1jmZI4AvarxXKg78k4Ia6OcV4OLmifPVWd78
CLERK_JWT_ISSUER=https://viable-tapir-70.clerk.accounts.dev

# FastAPI Configuration
APP_NAME=Tweak Jobs API
DEBUG=True
```

## Installation

1. Install the required packages:

```bash
cd apps/api
pip install -r requirements.txt
```

2. Make sure you have the `PyJWT` package installed:

```bash
pip install PyJWT
```

## API Endpoints

The Clerk integration provides the following endpoints:

- `GET /clerk/health` - Health check
- `GET /clerk/user` - Get current user information (requires JWT)
- `POST /clerk/update-context` - Update user context (requires JWT)
- `GET /clerk/protected` - Example protected endpoint (requires JWT)

## Frontend Integration

The Next.js frontend (`apps/web/app/clerk/page.tsx`) demonstrates how to:

1. Get authentication tokens from Clerk
2. Send requests to FastAPI with JWT authentication
3. Handle responses from protected endpoints

## Testing

1. Start your FastAPI server:

```bash
cd apps/api
uvicorn app:app --reload
```

2. Start your Next.js frontend:

```bash
cd apps/web
npm run dev
```

3. Navigate to `/clerk` page and test the integration

## Security Notes

- JWT tokens are automatically verified on each request
- Invalid or expired tokens return 401 Unauthorized
- All protected endpoints require valid Clerk JWT tokens
- The integration follows the pattern from [916exsetty/fastapi-nextjs-clerk](https://github.com/916exsetty/fastapi-nextjs-clerk)

## Next Steps

1. Replace placeholder Clerk API keys with your actual keys
2. Integrate with Supabase for database operations
3. Add more protected endpoints as needed
4. Implement proper error handling and logging
