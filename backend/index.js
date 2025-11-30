const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
  DeleteItemCommand
} = require("@aws-sdk/client-dynamodb");

const REGION = process.env.AWS_REGION || "us-east-1";
const TABLE_NAME = process.env.TABLE_NAME || "Users";

const client = new DynamoDBClient({ region: REGION });

// Reusable CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

exports.handler = async (event) => {
  console.log("EVENT:", event);

  // Handle OPTIONS (Preflight) — REQUIRED FOR BROWSERS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "CORS preflight OK" })
    };
  }

  try {
    switch (event.httpMethod) {
      case "POST":
        return await createUser(event);
      case "GET":
        return await getUser(event);
      case "PUT":
        return await updateUser(event);
      case "DELETE":
        return await deleteUser(event);
      default:
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: "Unsupported HTTP method" })
        };
    }
  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// Clean DynamoDB format
const cleanItem = (item) => {
  if (!item) return null;
  const obj = {};
  for (let key in item) {
    const val = item[key];
    if ("S" in val) obj[key] = val.S;
    else if ("N" in val) obj[key] = Number(val.N);
    else obj[key] = val;
  }
  return obj;
};

async function createUser(event) {
  const body = JSON.parse(event.body || "{}");

  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: {
      userId: { S: body.userId },
      name: { S: body.name },
      email: { S: body.email },
      age: { N: body.age.toString() }
    }
  });

  await client.send(command);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message: "User added successfully!" })
  };
}

async function getUser(event) {
  const userId = event.queryStringParameters?.userId;

  if (userId) {
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { userId: { S: userId } }
    });

    const result = await client.send(command);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ user: cleanItem(result.Item) })
    };
  } else {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const result = await client.send(command);
    const users = result.Items.map(cleanItem);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ users })
    };
  }
}

async function updateUser(event) {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "userId required for update" })
    };

  const body = JSON.parse(event.body || "{}");

  const command = new UpdateItemCommand({
    TableName: TABLE_NAME,
    Key: { userId: { S: userId } },
    UpdateExpression: "SET #n = :name, email = :email, age = :age",
    ExpressionAttributeNames: { "#n": "name" },
    ExpressionAttributeValues: {
      ":name": { S: body.name },
      ":email": { S: body.email },
      ":age": { N: body.age.toString() }
    },
    ReturnValues: "ALL_NEW"
  });

  const result = await client.send(command);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: "User updated successfully",
      updatedUser: cleanItem(result.Attributes)
    })
  };
}

async function deleteUser(event) {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "userId required for delete" })
    };

  const getCommand = new GetItemCommand({
    TableName: TABLE_NAME,
    Key: { userId: { S: userId } }
  });

  const old = await client.send(getCommand);

  const command = new DeleteItemCommand({
    TableName: TABLE_NAME,
    Key: { userId: { S: userId } },
    ReturnValues: "ALL_OLD"
  });

  await client.send(command);

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      message: "User deleted",
      deletedUser: cleanItem(old.Item)
    })
  };
}
