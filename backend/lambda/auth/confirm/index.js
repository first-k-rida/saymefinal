// Lambda: sayme-auth-confirm
// 이메일 인증 코드 확인 API

const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
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
    const body = JSON.parse(event.body);
    const { email, code } = body;

    if (!email || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '이메일과 인증 코드를 입력해주세요.' })
      };
    }

    // SECRET_HASH 계산
    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      SecretHash: secretHash
    });

    await client.send(command);

    console.log('✅ Email confirmed:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '이메일 인증이 완료되었습니다. 로그인해주세요.'
      })
    };

  } catch (error) {
    console.error('Confirm error:', error);
    
    let errorMessage = '인증 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error.name === 'CodeMismatchException') {
      errorMessage = '인증 코드가 일치하지 않습니다.';
      statusCode = 400;
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = '인증 코드가 만료되었습니다. 재발송을 요청해주세요.';
      statusCode = 400;
    } else if (error.name === 'NotAuthorizedException') {
      errorMessage = '이미 인증된 계정입니다.';
      statusCode = 400;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};