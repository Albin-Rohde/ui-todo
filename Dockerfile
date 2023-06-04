# Stage 1: Install and build frontend
FROM node:18.16.0 AS frontend
WORKDIR /tmp/src/frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci
COPY ./frontend .
RUN npm run build

# Stage 2: Install and build backend
FROM node:18.16.0 AS backend
WORKDIR /tmp/src/backend
COPY ./backend/package.json ./backend/package-lock.json ./
RUN npm ci
COPY ./backend .
RUN npm run build

# Stage 3: Final image
FROM node:18.16.0-alpine
WORKDIR /app
COPY --from=frontend /tmp/src/frontend/build ./frontend/build
COPY --from=backend /tmp/src/backend/package.json /tmp/src/backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production
COPY --from=backend /tmp/src/backend/build ./build
CMD ["npm", "run", "production"]
