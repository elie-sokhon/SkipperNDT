# Use official Python image
FROM python:3.12

# Set work directory
WORKDIR /code

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir django djangorestframework psycopg2 numpy pandas django-cors-headers

# Expose backend port
EXPOSE 8000

# Run Django server
CMD ["bash", "-c", "sleep 5 && python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
