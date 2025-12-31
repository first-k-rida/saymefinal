// Lambda: sayme-auth-me
// 현재 로그인한 사용자 정보 조회

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.COGNITO_CLIENT_ID,
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: '로그인이 필요합니다.' })
      };
    }

    const token = authHeader.replace('Bearer ', '');

    // JWT 토큰 검증
    const payload = await verifier.verify(token);
    const userId = payload.sub;

    console.log('Fetching user:', userId);

    // DynamoDB에서 사용자 정보 조회
    const command = new GetCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE,
      Key: { userId }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: '사용자 정보를 찾을 수 없습니다.' })
      };
    }

    // 민감한 정보 제외
    const { bankAccount, ...userInfo } = result.Item;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: userInfo
      })
    };

  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'JwtExpiredError') {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: '로그인이 만료되었습니다. 다시 로그인해주세요.' })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '사용자 정보 조회 중 오류가 발생했습니다.' })
    };
  }
};