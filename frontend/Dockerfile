# syntax=docker/dockerfile:1

# Specify the Node.js version to use
ARG NODE_VERSION=20.11.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
WORKDIR /usr/src/app

ARG VITE_PORT_FRONTEND
ARG VITE_URL_BACKEND
ARG VITE_URL_BACKEND_WS
# Set environment variables during the build process
ENV VITE_PORT_FRONTEND=${VITE_PORT_FRONTEND}
ENV VITE_URL_BACKEND=${VITE_URL_BACKEND}
ENV VITE_URL_BACKEND_WS=${VITE_URL_BACKEND_WS}
ENV VITE_ANALYTICS_ID=${VITE_ANALYTICS_ID}
ENV VITE_TEST="FUCK YOU VITE WHY DO YOU DO THIS TO ME GOD DAMNIT"
ENV VITE_IS_DOCKER=true
ENV NODE_OPTIONS="--max-old-space-size=16384"

################################################################################
# Create a stage for installing production dependencies.
FROM base as deps

# Copy the shared directory into the image
COPY shared /usr/src/shared

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage bind mounts to package.json and package-lock.json to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=frontend/package.json,target=package.json \
  --mount=type=bind,source=frontend/package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev --force

################################################################################
# Create a stage for building the application.
FROM deps as build

# Download additional development dependencies before building, as some projects require
# "devDependencies" to be installed to build.
RUN --mount=type=bind,source=frontend/package.json,target=package.json \
  --mount=type=bind,source=frontend/package-lock.json,target=package-lock.json \
  --mount=type=cache,target=/root/.npm \
  npm ci --force

# Copy the frontend source files into the image
COPY frontend /usr/src/app

WORKDIR /usr/src/app
# Run the build script.
RUN npm run build

################################################################################
# Create a new stage to run the application with minimal runtime dependencies
# where the necessary files are copied from the build stage.
FROM base as final

# Run the application as a non-root user.
USER node

# Copy package.json so that package manager commands can be used.
COPY frontend/package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/build ./build


# Run the application.
CMD node build
