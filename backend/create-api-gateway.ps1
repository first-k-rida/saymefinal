# ====================================
# Sayme API Gateway 자동 구축 스크립트
# ====================================

$ErrorActionPreference = "Stop"
$Region = "ap-northeast-2"
$AccountId = "119778517834"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Sayme API Gateway 구축 시작" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# ====================================
# Step 1: REST API 생성
# ====================================
Write-Host "[Step 1] REST API 생성 중..." -ForegroundColor Yellow

$apiResponse = aws apigateway create-rest-api `
  --name "sayme-api" `
  --description "Sayme Service REST API" `
  --endpoint-configuration types=REGIONAL `
  --region $Region | ConvertFrom-Json

$API_ID = $apiResponse.id

Write-Host "✅ REST API 생성 완료" -ForegroundColor Green
Write-Host "   API ID: $API_ID" -ForegroundColor White
Write-Host "   API Name: $($apiResponse.name)" -ForegroundColor White
Write-Host ""

# ====================================
# Step 2: 루트 리소스 ID 가져오기
# ====================================
Write-Host "[Step 2] 루트 리소스 확인 중..." -ForegroundColor Yellow

$resourcesResponse = aws apigateway get-resources `
  --rest-api-id $API_ID `
  --region $Region | ConvertFrom-Json

$ROOT_ID = $resourcesResponse.items[0].id

Write-Host "✅ 루트 리소스 확인 완료" -ForegroundColor Green
Write-Host "   Root Resource ID: $ROOT_ID" -ForegroundColor White
Write-Host ""

# ====================================
# Step 3: /auth 리소스 생성
# ====================================
Write-Host "[Step 3] /auth 리소스 생성 중..." -ForegroundColor Yellow

$authResponse = aws apigateway create-resource `
  --rest-api-id $API_ID `
  --parent-id $ROOT_ID `
  --path-part "auth" `
  --region $Region | ConvertFrom-Json

$AUTH_ID = $authResponse.id

Write-Host "✅ /auth 리소스 생성 완료" -ForegroundColor Green
Write-Host "   Auth Resource ID: $AUTH_ID" -ForegroundColor White
Write-Host ""

# ====================================
# Step 4: Auth 엔드포인트 생성 함수
# ====================================

function Create-AuthEndpoint {
    param(
        [string]$PathPart,
        [string]$LambdaFunctionName,
        [string]$HttpMethod = "POST"
    )
    
    Write-Host "[Step] /auth/$PathPart 엔드포인트 생성 중..." -ForegroundColor Yellow
    
    # 리소스 생성
    $resourceResponse = aws apigateway create-resource `
        --rest-api-id $API_ID `
        --parent-id $AUTH_ID `
        --path-part $PathPart `
        --region $Region | ConvertFrom-Json
    
    $RESOURCE_ID = $resourceResponse.id
    
    # 메서드 생성
    aws apigateway put-method `
        --rest-api-id $API_ID `
        --resource-id $RESOURCE_ID `
        --http-method $HttpMethod `
        --authorization-type NONE `
        --region $Region | Out-Null
    
    # Lambda 통합
    $lambdaArn = "arn:aws:lambda:${Region}:${AccountId}:function:$LambdaFunctionName"
    $integrationUri = "arn:aws:apigateway:${Region}:lambda:path/2015-03-31/functions/$lambdaArn/invocations"
    
    aws apigateway put-integration `
        --rest-api-id $API_ID `
        --resource-id $RESOURCE_ID `
        --http-method $HttpMethod `
        --type AWS_PROXY `
        --integration-http-method POST `
        --uri $integrationUri `
        --region $Region | Out-Null
    
    # Lambda 권한 부여
    $statementId = "apigateway-$PathPart-$(Get-Random)"
    $sourceArn = "arn:aws:execute-api:${Region}:${AccountId}:${API_ID}/*/${HttpMethod}/auth/$PathPart"
    
    try {
        aws lambda add-permission `
            --function-name $LambdaFunctionName `
            --statement-id $statementId `
            --action lambda:InvokeFunction `
            --principal apigateway.amazonaws.com `
            --source-arn $sourceArn `
            --region $Region 2>$null | Out-Null
    } catch {
        Write-Host "   ⚠️  Lambda 권한 이미 존재 (무시)" -ForegroundColor DarkYellow
    }
    
    Write-Host "✅ /auth/$PathPart ($HttpMethod) 엔드포인트 생성 완료" -ForegroundColor Green
    Write-Host "   Resource ID: $RESOURCE_ID" -ForegroundColor White
    Write-Host "   Lambda: $LambdaFunctionName" -ForegroundColor White
    Write-Host ""
}

# ====================================
# Step 5: Auth 엔드포인트 생성
# ====================================

Create-AuthEndpoint -PathPart "signup" -LambdaFunctionName "sayme-auth-signup" -HttpMethod "POST"
Create-AuthEndpoint -PathPart "confirm" -LambdaFunctionName "sayme-auth-confirm" -HttpMethod "POST"
Create-AuthEndpoint -PathPart "login" -LambdaFunctionName "sayme-auth-login" -HttpMethod "POST"
Create-AuthEndpoint -PathPart "me" -LambdaFunctionName "sayme-auth-me" -HttpMethod "GET"
Create-AuthEndpoint -PathPart "logout" -LambdaFunctionName "sayme-auth-logout" -HttpMethod "POST"

# ====================================
# Step 6: API 배포
# ====================================
Write-Host "[Step 6] API 배포 중 (dev 스테이지)..." -ForegroundColor Yellow

$deployResponse = aws apigateway create-deployment `
    --rest-api-id $API_ID `
    --stage-name dev `
    --stage-description "Development Stage" `
    --description "Initial deployment" `
    --region $Region | ConvertFrom-Json

Write-Host "✅ API 배포 완료" -ForegroundColor Green
Write-Host ""

# ====================================
# Step 7: 결과 출력
# ====================================
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "API Gateway 구축 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 API 정보:" -ForegroundColor White
Write-Host "   API ID: $API_ID" -ForegroundColor White
Write-Host "   Base URL: https://$API_ID.execute-api.$Region.amazonaws.com/dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "📍 엔드포인트:" -ForegroundColor White
Write-Host "   POST https://$API_ID.execute-api.$Region.amazonaws.com/dev/auth/signup" -ForegroundColor Gray
Write-Host "   POST https://$API_ID.execute-api.$Region.amazonaws.com/dev/auth/confirm" -ForegroundColor Gray
Write-Host "   POST https://$API_ID.execute-api.$Region.amazonaws.com/dev/auth/login" -ForegroundColor Gray
Write-Host "   GET  https://$API_ID.execute-api.$Region.amazonaws.com/dev/auth/me" -ForegroundColor Gray
Write-Host "   POST https://$API_ID.execute-api.$Region.amazonaws.com/dev/auth/logout" -ForegroundColor Gray
Write-Host ""

# API 정보 저장
$apiEndpoints = @{
    signup = "POST /auth/signup"
    confirm = "POST /auth/confirm"
    login = "POST /auth/login"
    me = "GET /auth/me"
    logout = "POST /auth/logout"
}

$apiInfo = @{
    apiId = $API_ID
    region = $Region
    baseUrl = "https://$API_ID.execute-api.$Region.amazonaws.com/dev"
    endpoints = $apiEndpoints
}

$apiInfo | ConvertTo-Json -Depth 10 | Out-File -FilePath "api-gateway-info.json" -Encoding UTF8

Write-Host "✅ API 정보가 'api-gateway-info.json' 파일에 저장되었습니다." -ForegroundColor Green
Write-Host ""