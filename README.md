# Serverless CI/CD platform 
> A fully serverless CI/CD orchestration platform built using AWS managed services — no Jenkins, no idle servers, no manual intervention.

---

## Overview

This project demonstrates an **event-driven, fully serverless CI/CD pipeline** that automatically builds, tests, containerizes, and deploys applications triggered by GitHub push events. It leverages AWS managed services to eliminate the need for traditional CI/CD tools like Jenkins.

---

## Architecture Flow

```
GitHub Push
    │
    ▼
API Gateway  ──►  Lambda (Webhook Processor)
                        │
                        ▼
               Step Functions (Orchestrator)
               ┌────────┴────────┐
               ▼                 ▼
         CodeBuild           CodeBuild
        (Run Tests)      (Build & Push to ECR)
                                 │
                                 ▼
                          Lambda (Deploy Trigger)
                                 │
                                 ▼
                        ECS Fargate (Redeploy)


```
<img width="1366" height="499" alt="Screenshot (209)" src="https://github.com/user-attachments/assets/fdee1d92-dd48-45c2-8d1b-ab3bbd04a94f" />
<img width="1366" height="480" alt="Screenshot (210)" src="https://github.com/user-attachments/assets/cbfc1361-51cc-4837-9a1d-190a37b209be" />
---

## Technology Stack

| Layer | Service |
|---|---|
| Compute | AWS Lambda, AWS CodeBuild, Amazon ECS (Fargate) |
| Orchestration | AWS Step Functions |
| API | Amazon API Gateway |
| Container Registry | Amazon ECR |
| Storage | Amazon S3 |
| Monitoring | Amazon CloudWatch |
| Source Control | GitHub Webhooks |
| Containerization | Docker |

---

## Key Features

-  **Fully serverless** — no server management required
-  **Event-driven architecture** — triggered automatically on GitHub push
-  **Auto-scaling** with zero idle cost (pay per execution)
-  **Containerized deployment** using Docker + ECS Fargate
-  **Modular and extensible** workflow via Step Functions
-  **Integrated logging and monitoring** with CloudWatch

---

##  Project Structure

```
.
├── app.js
├── package.json
├── Dockerfile
├── buildspec.yml
├── lambda/
│   ├── trigger_lambda.py
│   └── deploy_lambda.py
└── README.md
```

---

## Workflow Details

### 1. Webhook Integration

1. GitHub sends a `POST` request on every code push
2. API Gateway exposes the public endpoint
3. Lambda parses the payload and triggers Step Functions

### 2. Step Functions Pipeline

| Step | Service | Description |
|---|---|---|
| Run Tests | CodeBuild | Installs dependencies and runs tests |
| Build Image | CodeBuild | Builds Docker image and pushes to ECR |
| Deploy | Lambda | Triggers ECS service update |

---

## CodeBuild Configuration

### Test Stage (`buildspec-test.yml`)

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  build:
    commands:
      - npm install
      - npm test
```

### Build & Push Stage (`buildspec-build.yml`)

```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin 535387297335.dkr.ecr.ap-south-1.amazonaws.com/cicd-app
  build:
    commands:
      - docker build -t cicd .
      - docker tag cicd:latest 535387297335.dkr.ecr.ap-south-1.amazonaws.com/cicd-app:latest
  post_build:
    commands:
      - docker push 535387297335.dkr.ecr.ap-south-1.amazonaws.com/cicd-app:latest
```
---

## Deployment Strategy

- **ECS Fargate** is used for serverless container deployment
- Deployment is triggered via a **Lambda function**
- ECS service pulls the **latest image** from ECR
- **Rolling update** strategy ensures zero downtime

---

## IAM Roles & Permissions

| Service | Required Permissions |
|---|---|
| Lambda | `StartExecution`, `ECS:UpdateService` |
| Step Functions | `CodeBuild:StartBuild`, `Lambda:InvokeFunction` |
| CodeBuild | `ECR:*`, `S3:*`, `CloudWatch:PutLogEvents` |

---

## Monitoring & Logging

- **CloudWatch Logs** — Lambda and CodeBuild execution logs
- **Step Functions** — Visual execution tracking and history
- **ECS Logs** — Runtime container debugging
- **S3** — Optional audit log storage

---

## Common Issues & Fixes

### Docker Build Failure
- Ensure `Dockerfile` exists in the root of the repository
- Enable **privileged mode** in the CodeBuild project settings

### ECR Push Failure
- Verify the ECR repository URI is correct
- Check IAM permissions for the CodeBuild role

### Lambda Serialization Error
- Convert all `datetime` objects to strings before returning from Lambda

### ECS Exit Code 137
- Increase **memory allocation** in the ECS task definition (OOM kill)

---

## Benefits

| Benefit | Details |
|---|---|
| No Server Management | Fully managed AWS services handle all infrastructure |
| Auto Scaling | Scales to zero when idle; scales up on demand |
| Cost Efficient | Pay only per execution — no idle compute costs |
| Modular Design | Each pipeline stage is independently replaceable |
| Production Ready | Battle-tested AWS services with built-in HA |

---

---

<div align="center">
  Built with using AWS Serverless Services
</div>

