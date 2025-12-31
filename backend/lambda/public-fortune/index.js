const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

// DynamoDB 클라이언트 설정
const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'ap-northeast-2' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_FORTUNE_MESSAGES_TABLE || 'sayme-fortune-messages';

/**
 * CORS 헤더
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,OPTIONS'
};

/**
 * 성공 응답 생성
 */
function successResponse(data) {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(data)
  };
}

/**
 * 에러 응답 생성
 */
function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message })
  };
}

/**
 * 오늘 날짜의 MM-DD 형식 반환
 */
function getTodayPattern() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}

/**
 * 특정 날짜 패턴의 운세 메시지 조회
 */
async function getFortuneByDatePattern(datePattern) {
  try {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'DatePatternIndex',
      KeyConditionExpression: 'datePattern = :datePattern',
      ExpressionAttributeValues: {
        ':datePattern': datePattern
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
  } catch (error) {
    console.error('DynamoDB Query Error:', error);
    throw error;
  }
}

/**
 * 카테고리별 운세 메시지 조회 (랜덤 선택용)
 */
async function getFortuneByCategory(category) {
  try {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'CategoryIndex',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    return result.Items || [];
  } catch (error) {
    console.error('DynamoDB Query Error:', error);
    throw error;
  }
}

/**
 * 배열에서 랜덤 선택
 */
function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Lambda Handler
 */
exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // OPTIONS 요청 처리 (CORS Preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  try {
    // 1. 오늘 날짜 패턴 가져오기
    const todayPattern = getTodayPattern();
    console.log('Today Pattern:', todayPattern);

    // 2. 오늘 날짜에 해당하는 운세 메시지 조회
    let fortuneMessages = await getFortuneByDatePattern(todayPattern);
    console.log('Messages for today:', fortuneMessages.length);

    // 3. 오늘 날짜에 해당하는 메시지가 없으면 랜덤 카테고리 선택
    if (fortuneMessages.length === 0) {
      const categories = ['reflection', 'gratitude', 'growth'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      console.log('No message for today, using category:', randomCategory);
      
      fortuneMessages = await getFortuneByCategory(randomCategory);
      console.log('Messages from category:', fortuneMessages.length);
    }

    // 4. 메시지가 여러 개면 랜덤 선택
    if (fortuneMessages.length === 0) {
      return errorResponse(404, '운세 메시지를 찾을 수 없습니다.');
    }

    const selectedFortune = getRandomItem(fortuneMessages);
    console.log('Selected fortune:', selectedFortune.messageId);

    // 5. 필요한 필드만 반환
    const response = {
      fortuneText: selectedFortune.fortuneText,
      questionPrompt: selectedFortune.questionPrompt,
      category: selectedFortune.category,
      date: todayPattern
    };

    return successResponse(response);

  } catch (error) {
    console.error('Error:', error);
    return errorResponse(500, '서버 오류가 발생했습니다.');
  }
};