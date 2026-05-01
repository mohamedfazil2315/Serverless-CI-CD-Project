Serverless CI/CD Platform on AWS

Overview:
---------
This project demonstrates a fully serverless CI/CD orchestration platform built using AWS managed services. It eliminates the need for traditional CI/CD tools like Jenkins by leveraging event-driven architecture.

The system automatically builds, tests, containerizes, and deploys applications based on GitHub events.

Architecture Flow :
-----------------
GitHub push triggers webhook
API Gateway receives the request
Lambda function processes webhook
Step Functions orchestrates pipeline
CodeBuild runs tests
CodeBuild builds Docker image and pushes to ECR
Lambda triggers ECS deployment
ECS pulls latest image and redeploys application

Technology Stack :
------------------
AWS Lambda
Amazon API Gateway
AWS Step Functions
AWS CodeBuild
Amazon ECR
Amazon ECS (Fargate)
Amazon CloudWatch
Amazon S3
GitHub Webhooks
Docker

Key Features :
--------------
Fully serverless CI/CD pipeline
Event-driven architecture
Automatic scaling with zero idle cost
Containerized deployment using Docker
Modular and extensible workflow
Integrated logging and monitoring
Project Structure
.
├── app.js
├── package.json
├── Dockerfile
├── buildspec.yml
├── lambda/
│   ├── trigger_lambda.py
│   └── deploy_lambda.py
└── README.md

Workflow Details :
------------------
Webhook Integration
GitHub sends POST request on code push
API Gateway exposes public endpoint
Lambda parses and triggers Step Functions

Step Functions Pipeline :
-------------------------
Step	Service	Description
Run Tests	        CodeBuild	Installs               dependencies and runs tests
Build Image	      CodeBuild	Builds                 Docker image and pushes to ECR
Deploy	          Lambda	                         Triggers ECS service update

CodeBuild Configuration :
-------------------------
Test Stage :
------------
version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 18
  build:
    commands:
      - npm install
      - npm test
      
Build and Push Stage :
----------------------
version: 0.2
phases:
  pre_build:
    commands:
      - aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

  build:
    commands:
      - docker build -t cicd-app .
      - docker tag cicd-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/cicd-app:latest

  post_build:
    commands:
      - docker push <account-id>.dkr.ecr.<region>.amazonaws.com/cicd-app:latest
      
Deployment Strategy :
---------------------
ECS Fargate is used for serverless container deployment
Deployment is triggered using Lambda
ECS service pulls latest image from ECR
Rolling update ensures zero downtime

IAM Roles :
-----------
Service	Permissions
Lambda	                  StartExecution, ECS UpdateService
Step Functions	          CodeBuild StartBuild, Lambda Invoke
CodeBuild	                ECR, S3, CloudWatch Logs

Monitoring and Logging :
------------------------
CloudWatch Logs for Lambda and CodeBuild
Step Functions execution tracking
ECS logs for runtime debugging
Optional S3 storage for audit logs

Issues and Fixes :
------------------
Docker Build Failure
Ensure Dockerfile exists in root
Enable privileged mode in CodeBuild

ECR Push Failure 
Verify repository URI
Check IAM permissions

Lambda Serialization Error
Convert datetime objects to string

ECS Exit Code 137
Increase memory allocation in task definition

Benefits :
----------
No server management required
Scales automatically
Cost-efficient (pay per execution)
Highly modular design
Production-ready architecture
