// sayme-review2025-complete (JWT 인증 + 동적 CORS)
// 2025 돌아보기 완료 처리 - 토큰에서 userId 추출

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'sayme-review2025';
const USERS_TABLE = 'sayme-users';

// Cognito JWT Verifier 설정
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'ap-northeast-2_egqvLgHX0',
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID || '4e5k8vs12cuudmka7m4mnjdkum'
});

// CORS 헤더 - 동적으로 Origin 처리
function getCorsHeaders(origin) {
  const allowedOrigins = [
    'https://app.spirit-lab.me',
    'https://spirit-lab.me',
    'http://localhost:3000'
  ];
  
  const allowOrigin = allowedOrigins.includes(origin) ? origin : '*';
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };
}

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
  
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const headers = getCorsHeaders(origin);

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

    // 2. 요청 body 파싱
    const body = JSON.parse(event.body);
    const { sessionId, answers, selectedWeekdays } = body;

    console.log('🎉 완료 처리:', { userId, sessionId });

    // 3. 필수 필드 검증
    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'sessionId는 필수입니다.'
        })
      };
    }

    const completedAt = new Date().toISOString();

    // 4. review2025 테이블에 완료 상태 저장 (토큰에서 추출한 userId 사용)
    const reviewParams = {
      TableName: TABLE_NAME,
      Item: {
        userId, // 토큰에서 추출한 userId
        sessionId,
        answers: answers || {},
        selectedWeekdays: selectedWeekdays || [],
        status: 'completed',
        completedAt,
        updatedAt: completedAt
      }
    };

    await dynamodb.send(new PutCommand(reviewParams));
    console.log('✅ Review2025 완료 저장 성공');

    // 5. Users 테이블에 완료 플래그 업데이트 (토큰에서 추출한 userId 사용)
    const userParams = {
      TableName: USERS_TABLE,
      Key: { userId }, // 토큰에서 추출한 userId
      UpdateExpression: 'SET review2025Completed = :completed, review2025CompletedAt = :completedAt, review2025SelectedWeekdays = :weekdays',
      ExpressionAttributeValues: {
        ':completed': true,
        ':completedAt': completedAt,
        ':weekdays': selectedWeekdays || []
      }
    };

    await dynamodb.send(new UpdateCommand(userParams));
    console.log('✅ Users 테이블 업데이트 성공');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '2025 돌아보기를 완료했습니다! 🎉',
        data: {
          userId, // 토큰에서 추출한 userId 반환
          sessionId,
          completedAt
        }
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
        message: '완료 처리 중 오류가 발생했습니다.',
        error: error.message
      })
    };
  }
};