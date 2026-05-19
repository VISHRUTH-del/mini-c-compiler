FROM python:3.11-slim

WORKDIR /app

COPY . .

EXPOSE 7860

CMD ["python3", "web_server.py", "--host", "0.0.0.0", "--port", "7860"]
