# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY package.json bun.lock ./
RUN npm install -g bun
RUN bun install
COPY . .
RUN echo "Building with VITE_API_BASE_URL: $VITE_API_BASE_URL"
RUN bun run build

# Stage 2: Serve the application
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
