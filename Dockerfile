# Stage 1: Build frontend
FROM node:20-alpine AS builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine
WORKDIR /app

# Copy backend
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ .

# Copy built frontend
COPY --from=builder /app/frontend/dist ./public

# Setup environment variables
ENV NODE_ENV=production
# PORT is provided by Cloud Run

EXPOSE 8080
CMD ["node", "server.js"]
