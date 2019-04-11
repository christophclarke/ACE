FROM python:3

ENV PYTHONUNBUFFERED 1

RUN mkdir -p /code/ace_backend
WORKDIR /code/ace_backend

COPY requirements.txt /code/ace_backend/

RUN pip install -r requirements.txt
COPY . /code/ace_backend/

EXPOSE 8000
STOPSIGNAL SIGINT
# ENTRYPOINT ["python", "manage.py"]
# CMD ["runserver", "0.0.0.0:8000"]