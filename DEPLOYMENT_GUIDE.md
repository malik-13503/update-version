# Deployment Guide for D4U Pros Scratch & Win Platform

## Quick Start

### 1. Environment Setup
```bash
# Clone repository
git clone https://github.com/malik-13503/D4YouPromotion.git
cd D4YouPromotion

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Configure Environment Variables
Edit `.env` file with your actual values:
```
DATABASE_URL=postgresql://user:password@host:port/database
RESEND_API_KEY=re_your_actual_resend_api_key
NODE_ENV=production
```

### 3. Database Setup
```bash
# Push database schema
npm run db:push
```

### 4. Build and Run
```bash
# Build for production
npm run build

# Start application
npm run dev
```

## Platform-Specific Deployment

### Replit Deployment
1. Import project to Replit
2. Set environment variables in Replit Secrets:
   - `DATABASE_URL`
   - `RESEND_API_KEY`
3. Run `npm run db:push`
4. Click "Run" button

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway Deployment
1. Connect GitHub repository to Railway
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically

### Traditional VPS/Server
1. Install Node.js 18+
2. Install PostgreSQL
3. Clone repository and install dependencies
4. Configure environment variables
5. Run with PM2: `pm2 start npm --name "d4u-pros" -- run dev`

## Required Services

### Database (PostgreSQL)
- **Neon** (Recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **Local PostgreSQL**: Install locally

### Email Service (Resend)
1. Sign up at https://resend.com
2. Create API key
3. Add to environment variables as `RESEND_API_KEY`

## Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |
| `NODE_ENV` | Environment mode (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong database passwords
- [ ] Enable SSL for database connections
- [ ] Set up rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS in production

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Optimize database queries
- [ ] Enable caching
- [ ] Monitor performance metrics

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify credentials

2. **Email Not Sending**
   - Verify RESEND_API_KEY
   - Check email domain configuration
   - Review API usage limits

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version (18+ required)
   - Verify TypeScript configuration

### Logs and Monitoring

```bash
# View application logs
tail -f logs/app.log

# Monitor database connections
npm run db:introspect

# Check email service status
curl -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Admin credentials changed
- [ ] Email service tested
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Performance optimized

## Support

For deployment issues:
1. Check the logs for error messages
2. Verify all environment variables
3. Test database and email connections
4. Review the troubleshooting section
5. Create an issue in the repository if needed

## Updates and Maintenance

```bash
# Update dependencies
npm update

# Database migrations
npm run db:push

# Restart application
pm2 restart d4u-pros
```