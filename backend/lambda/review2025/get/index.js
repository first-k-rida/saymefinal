// sayme-review2025-get (JWT 인증 포함)
// 2025 돌아보기 진행 상황 조회 - 토큰에서 userId 추출

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'sayme-review2025';

// Cognito JWT Verifier 설정
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'ap-northeast-2_egqvLgHX0',
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID || '4e5k8vs12cuudmka7m4mnjdkum'
});

// CORS 헤더
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Content-Type': 'application/json'
};

// JWT 토큰에서 userId 추출
async function getUserIdFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization 헤더가 없거나 형식이 잘못되었습니다.');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = await verifier.verify(token);
    console.log('✅ 토큰 검증 성공:', payload.sub);
    return payload.sub; // userId (Cognito sub)
  } catch (error) {
    console.error('❌ 토큰 검증 실패:', error);
    throw new Error('유효하지 않은 토큰입니다.');
  }
}

exports.handler = async (event) => {
  console.log('📥 Event:', JSON.stringify(event, null, 2));

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // 1. Authorization 헤더에서 userId 추출
    const authHeader = event.headers?.Authorization || event.headers?.authorization;
    const userId = await getUserIdFromToken(authHeader);
    
    console.log('🔐 인증된 userId:', userId);
    console.log('📖 조회 요청:', { userId });

    // 2. DynamoDB에서 조회 (가장 최근 세션)
    // 토큰에서 추출한 userId로만 조회 (본인 데이터만 접근 가능)
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId // 토큰에서 추출한 userId 사용
      },
      ScanIndexForward: false, // 최신순 정렬
      Limit: 1
    };

    const result = await dynamodb.send(new QueryCommand(params));

    console.log('📊 조회 결과:', result.Items?.length || 0, '개');

    if (!result.Items || result.Items.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: '이전 기록이 없습니다.',
          data: null
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result.Items[0]
      })
    };

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    
    // 인증 오류인 경우
    if (error.message.includes('토큰') || error.message.includes('Authorization')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          message: '인증이 필요합니다.',
          error: error.message
        })
      };
    }
    
    // 일반 오류
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: '조회 중 오류가 발생했습니다.',
        error: error.message
      })
    };
  }
};