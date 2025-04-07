# Use the latest Bun runtime as the base image
FROM oven/bun:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy only package manifests first for better layer caching
COPY package.json bun.lock ./

# Enable cache for faster installs
ENV BUN_INSTALL_CACHE=/root/.cache/bun

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the entire application source code
COPY . .

# Build the application
RUN bun run build

# ---- Production Stage ----
FROM oven/bun:latest as runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Use a non-root user for security
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Set the default port via ENV (can be overridden)
ARG PORT=3000
ENV PORT=${PORT}

# Expose the application port
EXPOSE ${PORT}

# Start the application using Bun
CMD ["bun", "start"]
