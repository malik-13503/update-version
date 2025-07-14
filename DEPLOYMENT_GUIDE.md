# VPSDime Deployment Guide - Done For You Pros Scratch & Win Game

## Prerequisites

### 1. VPSDime Server Setup
- Ubuntu 20.04 LTS or 22.04 LTS VPS
- At least 1GB RAM (2GB+ recommended)
- 20GB+ storage space
- Root or sudo access

### 2. Required Software
- Node.js 18+ or 20+
- PostgreSQL 12+
- PM2 (Process Manager)
- Nginx (Web Server)
- SSL Certificate (Let's Encrypt)

## Step-by-Step Deployment

### 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE d4u_scratch_game;
CREATE USER d4u_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE d4u_scratch_game TO d4u_user;
ALTER USER d4u_user CREATEDB;
\q
EOF
```

### 3. Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Setup PM2 to start on boot
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

### 4. Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Allow HTTP and HTTPS through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw --force enable
```

### 5. Deploy Your Application

```bash
# Create application directory
sudo mkdir -p /var/www/d4u-scratch-game
sudo chown -R $USER:$USER /var/www/d4u-scratch-game

# Navigate to application directory
cd /var/www/d4u-scratch-game

# Clone your code (replace with your repository URL)
git clone https://your-repository-url.git .

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://d4u_user:your_secure_password_here@localhost:5432/d4u_scratch_game
EOF

# Build the application
npm run build

# Run database migrations
npm run db:push
```

### 6. Configure PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'd4u-scratch-game',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G'
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
```

### 7. Configure Nginx

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/d4u-scratch-game << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/json application/xml+rss;

    # Handle static files
    location /assets/ {
        alias /var/www/d4u-scratch-game/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle video files with proper MIME type
    location ~* \.(mp4|webm|ogg)$ {
        root /var/www/d4u-scratch-game/dist/public;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Content-Type "video/mp4";
    }

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files or proxy to Node.js
    location / {
        try_files $uri $uri/ @nodejs;
    }

    location @nodejs {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Handle WebSocket connections
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/d4u-scratch-game /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 8. SSL Certificate with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 9. Database Backup Script

```bash
# Create backup script
sudo tee /usr/local/bin/backup-d4u-db.sh << 'EOF'
#!/bin/bash

# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/d4u-scratch-game"
DB_NAME="d4u_scratch_game"
DB_USER="d4u_user"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
PGPASSWORD="your_secure_password_here" pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Remove backups older than 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

echo "Database backup completed: $BACKUP_DIR/backup_$DATE.sql"
EOF

# Make script executable
sudo chmod +x /usr/local/bin/backup-d4u-db.sh

# Add to crontab for daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-d4u-db.sh") | crontab -
```

### 10. Monitoring and Logs

```bash
# Check PM2 status
pm2 status

# View application logs
pm2 logs d4u-scratch-game

# Monitor system resources
pm2 monit

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
free -h
```

## Post-Deployment Configuration

### 1. Domain Configuration
- Point your domain's A record to your VPS IP address
- Wait for DNS propagation (usually 5-30 minutes)
- Test your site at https://your-domain.com

### 2. Admin Access
- Navigate to https://your-domain.com/admin
- Login with: admin@doneforyoupros.com / password@security
- Change default credentials immediately

### 3. Security Hardening

```bash
# Update system packages regularly
sudo apt update && sudo apt upgrade -y

# Configure automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Set up fail2ban for SSH protection
sudo apt install -y fail2ban

# Configure firewall rules
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### 4. Performance Optimization

```bash
# Optimize PostgreSQL
sudo -u postgres psql << EOF
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
EOF

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   pm2 logs d4u-scratch-game
   pm2 restart d4u-scratch-game
   ```

2. **Database connection errors**
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -c "SELECT version();"
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

### Useful Commands

```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart postgresql

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# View system logs
sudo journalctl -f
```

## Maintenance

### Regular Tasks
- Check application logs weekly
- Monitor disk space and memory usage
- Update system packages monthly
- Review database backups
- Monitor SSL certificate expiration

### Updates
```bash
# Update application
cd /var/www/d4u-scratch-game
git pull origin main
npm install
npm run build
npm run db:push
pm2 restart d4u-scratch-game
```

## Support

For issues with:
- VPS setup: Contact VPSDime support
- Application deployment: Check logs and error messages
- Domain configuration: Check DNS settings
- SSL certificates: Use Let's Encrypt documentation

Your Done For You Pros Scratch & Win Game should now be live and accessible at your domain!