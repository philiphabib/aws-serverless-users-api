🚀 AWS Serverless Users CRUD API

A fully serverless CRUD (Create, Read, Update, Delete) application built with AWS Lambda, API Gateway, DynamoDB, and an optional HTML frontend.

Perfect for production APIs, and cloud engineering demonstrations.

📌 Project Overview

This project demonstrates a complete backend API using AWS Serverless services.

It includes:

AWS Lambda — business logic in Node.js

Amazon API Gateway — REST API endpoint

Amazon DynamoDB — NoSQL database for storing users

CORS-enabled endpoints — ready for frontend integration

Frontend CRUD test page — simple HTML UI

Postman collection — fully test your API

Test automation script — bash-based CRUD test tool

This project is designed to demonstrate your cloud architecture & serverless skills in your portfolio.

🧱 Architecture Diagram
Frontend (HTML/JavaScript) → API Gateway → Lambda → DynamoDB

✨ Features
🔸 Create User
🔸 Get Single User
🔸 Get All Users
🔸 Update User
🔸 Delete User

All operations use DynamoDB and return clean, formatted JSON responses.

🛠️ Technologies Used
Component	Technology
Compute	AWS Lambda
API Layer	Amazon API Gateway (REST)
Database	DynamoDB
Runtime	Node.js (AWS SDK v3)
Frontend	HTML, CSS, JavaScript
Testing	Postman & Bash script

🚀 Deployment Notes

Create a DynamoDB table:

Table Name: Users
Primary Key: userId (String)


Deploy index.js as a Lambda function.

Configure API Gateway:

Create a REST API

Add resource: /users

Add methods: GET, POST, PUT, DELETE

Enable Lambda Proxy

Enable CORS (IMPORTANT)

Add environment variables:

AWS_REGION = us-east-1
TABLE_NAME = Users


Redeploy API.

🌐 API Endpoints

Assume base URL:

https://i9wm4w38r9.execute-api.us-east-1.amazonaws.com/prod/users

➤ POST /users

Create a new user
Body:

{
  "userId": "101",
  "name": "Alice",
  "email": "alice@example.com",
  "age": 25
}

➤ GET /users?userId=101

Fetch a single user.

➤ GET /users

Fetch all users.

➤ PUT /users?userId=101

Body:

{
  "name": "Alice Updated",
  "email": "alice_new@example.com",
  "age": 26
}

➤ DELETE /users?userId=101

Deletes the user.

🧪 Testing
✔ Postman

Import the collection:

postman/users-api.postman_collection.json

✔ Bash Automation

Run:

chmod +x test/test.sh
./test/test.sh

🎨 Optional Frontend UI

Open:

frontend/index.html


This page communicates with your live API Gateway endpoint to perform full CRUD.

📦 Installing Dependencies

Important when editing Lambda locally:

cd backend
npm install @aws-sdk/client-dynamodb

📜 License

This project is free to use for learning, portfolio, and commercial use.
