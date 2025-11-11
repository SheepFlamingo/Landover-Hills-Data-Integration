# /backend/Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Gunicorn will run on port 8000 inside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]