#!/bin/bash

# Script to generate Let's Encrypt certificates for the domains
# Make sure your domains point to this server before running this script

set -e

# Create directories
mkdir -p certs logs

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get update
        sudo apt-get install -y certbot
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install certbot
    else
        echo "Please install certbot manually for your system"
        exit 1
    fi
fi

# Generate certificates for each domain
echo "Generating certificates..."

# For insaurral.de
certbot certonly --standalone -d insaurral.de --email matias@insaurral.de --agree-tos --non-interactive

# For www.insaurral.de
certbot certonly --standalone -d www.insaurral.de --email matias@insaurral.de --agree-tos --non-interactive

# For matias.insaurral.de
certbot certonly --standalone -d matias.insaurral.de --email matias@insaurral.de --agree-tos --non-interactive

# Copy certificates to the certs directory
echo "Copying certificates to certs directory..."

# Copy insaurral.de certificates
sudo cp /etc/letsencrypt/live/insaurral.de/fullchain.pem certs/insaurral.de.crt
sudo cp /etc/letsencrypt/live/insaurral.de/privkey.pem certs/insaurral.de.key

# Copy www.insaurral.de certificates
sudo cp /etc/letsencrypt/live/www.insaurral.de/fullchain.pem certs/www.insaurral.de.crt
sudo cp /etc/letsencrypt/live/www.insaurral.de/privkey.pem certs/www.insaurral.de.key

# Copy matias.insaurral.de certificates
sudo cp /etc/letsencrypt/live/matias.insaurral.de/fullchain.pem certs/matias.insaurral.de.crt
sudo cp /etc/letsencrypt/live/matias.insaurral.de/privkey.pem certs/matias.insaurral.de.key

# Set proper permissions
sudo chown -R $USER:$USER certs/
chmod 600 certs/*.key
chmod 644 certs/*.crt

echo "Certificates generated successfully!"
echo "You can now start the Docker Compose stack with:"
echo "docker compose up -d" 