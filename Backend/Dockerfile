FROM python:3.7

WORKDIR /app

COPY ./requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY ./.env.backend.dev ./.env.backend

EXPOSE 5000

CMD ["sh", "-c", "alembic upgrade head && python3 app.py"]
