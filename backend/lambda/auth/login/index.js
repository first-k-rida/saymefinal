// Lambda: sayme-auth-login
// 로그인 API

const { CognitoIdentityProviderClient, InitiateAuthCommand } = require("@aws-sdk/client-cognito-identity-provider");
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
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '이메일과 비밀번호를 입력해주세요.' })
      };
    }

    // SECRET_HASH 계산
    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash
      }
    });

    const response = await client.send(command);

    console.log('✅ Login success:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '로그인 성공',
        tokens: {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = '로그인 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error.name === 'NotAuthorizedException') {
      errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      statusCode = 401;
    } else if (error.name === 'UserNotConfirmedException') {
      errorMessage = '이메일 인증이 필요합니다.';
      statusCode = 401;
    } else if (error.name === 'UserNotFoundException') {
      errorMessage = '존재하지 않는 계정입니다.';
      statusCode = 401;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};