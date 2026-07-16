# Use a lightweight, clean Python base image
FROM python:3.13-slim-bookworm

# Copy uv binary from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set working directory inside the container
WORKDIR /app

# Enable bytecode compilation for faster execution
ENV UV_COMPILE_BYTECODE=1

# Copy dependency files first to leverage caching
COPY pyproject.toml uv.lock* requirements.txt* ./

# Install dependencies directly into the system environment (no virtualenv needed in a container)
RUN if [ -f requirements.txt ]; then \
        uv pip install --system -r requirements.txt; \
    else \
        # If you are using pyproject.toml instead
        uv pip install --system .; \
    fi

# Copy the rest of backend codebase
COPY . .

# Expose FastAPI's default port
EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "apiapp:app", "--host", "0.0.0.0", "--port", "8000"]