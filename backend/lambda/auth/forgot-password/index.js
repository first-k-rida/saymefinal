// Lambda: sayme-auth-forgot-password
// 비밀번호 재설정 인증 코드 요청 API

const { CognitoIdentityProviderClient, ForgotPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
const crypto = require('crypto');

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION
});

// SECRET_HASH 계산 함수
function calculateSecretHash(username, clientId, clientSecret) {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { email } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '이메일을 입력해주세요.' })
      };
    }

    // SECRET_HASH 계산
    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: secretHash
    });

    await client.send(command);

    console.log('✅ Forgot password code sent:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '비밀번호 재설정 코드가 이메일로 전송되었습니다.'
      })
    };

  } catch (error) {
    console.error('Forgot password error:', error);

    let errorMessage = '비밀번호 재설정 요청 중 오류가 발생했습니다.';
    let statusCode = 500;

    if (error.name === 'UserNotFoundException') {
      errorMessage = '등록되지 않은 이메일입니다.';
      statusCode = 404;
    } else if (error.name === 'LimitExceededException') {
      errorMessage = '요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.';
      statusCode = 429;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};