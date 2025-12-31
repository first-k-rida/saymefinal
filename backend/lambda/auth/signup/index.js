// Lambda: sayme-auth-signup (with SECRET_HASH + nickname)
// 회원가입 API

const { CognitoIdentityProviderClient, SignUpCommand } = require("@aws-sdk/client-cognito-identity-provider");
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
  console.log('Event:', JSON.stringify(event));

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
    const { email, password, username } = body;

    if (!email || !password || !username) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '모든 필드를 입력해주세요.' })
      };
    }

    // SECRET_HASH 계산
    const secretHash = calculateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    );

    const command = new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: secretHash,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: username },
        { Name: 'nickname', Value: username }  // nickname 추가
      ]
    });

    const response = await client.send(command);

    console.log('✅ Signup success:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '인증 코드가 이메일로 발송되었습니다.',
        userId: response.UserSub,
        email: email
      })
    };

  } catch (error) {
    console.error('Signup error:', error);
    
    let errorMessage = '회원가입 중 오류가 발생했습니다.';
    let statusCode = 500;
    
    if (error.name === 'UsernameExistsException') {
      errorMessage = '이미 가입된 이메일입니다.';
      statusCode = 400;
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = '비밀번호는 8자 이상, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.';
      statusCode = 400;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({ error: errorMessage })
    };
  }
};