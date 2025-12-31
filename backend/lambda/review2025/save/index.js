// sayme-review2025-save (JWT 인증 포함)
// 2025 돌아보기 진행 상황 저장 - 토큰에서 userId 추출

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
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
  'Access-Control-Allow-Methods': 'PUT,OPTIONS',
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

  // OPTIONS 요청 처리 (CORS preflight)
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
    const { sessionId, answers, currentStep, status } = body;

    console.log('💾 저장 요청:', { userId, sessionId, currentStep, status });

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

    // 4. DynamoDB에 저장 (토큰에서 추출한 userId 사용)
    const params = {
      TableName: TABLE_NAME,
      Item: {
        userId, // 토큰에서 추출한 userId
        sessionId,
        answers: answers || {},
        currentStep: currentStep || 0,
        status: status || 'in_progress',
        updatedAt: new Date().toISOString()
      }
    };

    await dynamodb.send(new PutCommand(params));

    console.log('✅ 저장 성공!');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '저장되었습니다.',
        data: {
          userId, // 토큰에서 추출한 userId 반환
          sessionId,
          status
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
        message: '저장 중 오류가 발생했습니다.',
        error: error.message
      })
    };
  }
};