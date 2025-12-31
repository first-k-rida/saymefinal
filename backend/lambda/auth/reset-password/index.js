// Lambda: sayme-auth-reset-password
// 비밀번호 재설정 (인증 코드 + 새 비밀번호) API

const { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } = require("@aws-sdk/client-cognito-identity-provider");
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
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '모든 필드를 입력해주세요.' })
      };
    }

    // 비밀번호 강도 검증
    if (newPassword.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '비밀번호는 8자 이상이어야 합니다.' })
      };
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(newPassword)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.' })
      };
    }

    // SECRET_HASH 계산
    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash
    });

    await client.send(command);

    console.log('✅ Password reset successful:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '비밀번호가 성공적으로 변경되었습니다.'
      })
    };

  } catch (error) {
    console.error('Reset password error:', error);

    let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.';
    let statusCode = 500;

    if (error.name === 'CodeMismatchException') {
      errorMessage = '인증 코드가 일치하지 않습니다.';
      statusCode = 400;
    } else if (error.name === 'ExpiredCodeException') {
      errorMessage = '인증 코드가 만료되었습니다. 재요청해주세요.';
      statusCode = 400;
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = '비밀번호 형식이 올바르지 않습니다.';
      statusCode = 400;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};