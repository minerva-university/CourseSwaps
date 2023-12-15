# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install PostgreSQL client and other necessary packages
RUN apt-get update && \
    apt-get install -y gcc python3-dev libpq-dev && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get remove -y gcc python3-dev libpq-dev && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Gunicorn
RUN pip install gunicorn

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8000", "API:create_app()"]
