# DOCKER-DEMO

This repo was made for teaching full stack developers tha Docker technology. 

## Running app

Clone the repository and install dependencies for the project.

App itself is made as a simple node.js script, which will be just used for learning purposes.
Open terminal and in a project direstory, run:
```bash
node src/index.js
```

# Docker Commands Documentation
[Official Docker docs](https://docs.docker.com/desktop/install/mac-install/)

## Introduction
This documentation provides a quick reference to basic Docker commands used in our project. It's designed to help developers quickly spin up, manage, and interact with Docker containers.

### Prerequisites
- Docker installed on your machine.
- Basic understanding of Docker commands and concepts.

## Basic Docker Commands

### 1. Starting Services with Docker Compose
```bash
docker compose up
```
This command starts all the services defined in your docker-compose.yml file.

### 2. Listing Running Containers
```bash
docker ps
```
Use this to see all currently running containers.

### 3. Running a Container with Port Mapping
```bash
docker run -p 5001:8080 c9b19b0e6729
```
This command runs a container and maps port 8080 inside the container to port 5001 on the host machine.

### 4. Building a Docker Image with a Tag
```bash
docker build -t kacperher/docker-demo:1.1 .
```
This builds a Docker image from a Dockerfile in the current directory and tags it with a specific version.

### 5. Running a Container from an Image
```bash
docker run f6413f4104c8
```
This command creates and starts a container from the specified image.

### 6. Removing a Container
```bash
docker rm d8f60915f384
```
Use this command to remove a stopped container.

### 7. Listing All Containers (Running and Stopped)
```bash
docker ps -a
```
This shows all containers, including those that are not currently running.

### 8. Running a Specific Container
```bash
docker run c9b19b0e6729
```
This starts a container based on the specified image ID.

## Non-Docker Commands

## Docker App

# Docker Desktop Handbook

## What is Docker Desktop?
Docker Desktop is an integrated development environment (IDE) for building, sharing, and running containerized applications and microservices. It's designed to streamline Docker workflows, offering a user-friendly interface and compatibility with multiple platforms.

## Installation
Follow these steps to install Docker Desktop on your machine:

### For Windows
1. **Download:** Go to the [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) page and download the installer.
2. **Install:** Double-click the installer file and follow the on-screen instructions.
3. **Run:** After installation, run Docker Desktop from the Start menu.

### For macOS
1. **Download:** Visit the [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop) page to download the installer.
2. **Install:** Open the downloaded `.dmg` file and drag Docker to the Applications folder.
3. **Run:** Open Docker from the Applications folder.

## Basic Usage
Here’s how to get started with Docker Desktop:

### Running a Container
- **Open Docker Desktop:** Ensure Docker is running on your system.
- **Open Terminal (or Command Prompt on Windows):** Run Docker commands here.
- **Example Command:** To run a simple Hello World container, type:

```bash
  docker run hello-world
```

or use the dashboard:

![Docker app screen](/public/screen-docker-app.png)


