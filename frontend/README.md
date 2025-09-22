# PDFville Frontend

## Environment Configuration

This application is configured to work in both local development and production (AWS) environments.

### Environment Files

- `.env.development` - Development environment settings (localhost)
- `.env.production` - Production environment settings (AWS)
- `.env.local` - Local overrides (takes precedence over the above)

### API URL Configuration

The application automatically detects whether it's running locally or in production:

- When running on localhost, it connects to `http://localhost:5000`
- When running on the production domain, it connects to `https://pdfville.com/api`

### Manual Configuration

You can manually set the API URL in `.env.local` by changing:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

to:

```
NEXT_PUBLIC_API_URL=https://pdfville.com/api
```

## Development

To run the application in development mode:

```bash
npm run dev
```

## Production Build

To create a production build:

```bash
npm run build
npm start
```

## Deployment to AWS

When deploying to AWS, the application will automatically use the production environment settings.