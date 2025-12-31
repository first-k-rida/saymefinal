# ====================================
# Sayme DynamoDB 테이블 전체 생성 스크립트
# ====================================

$ErrorActionPreference = "Stop"
$Region = "ap-northeast-2"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Sayme DynamoDB 테이블 생성 시작" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# ====================================
# 테이블 생성 함수
# ====================================
function Create-DynamoDBTable {
    param(
        [string]$TableName,
        [string]$PartitionKey,
        [string]$PartitionKeyType = "S",
        [string]$SortKey = $null,
        [string]$SortKeyType = "S",
        [array]$GlobalSecondaryIndexes = @()
    )
    
    Write-Host "[생성] $TableName 테이블 생성 중..." -ForegroundColor Yellow
    
    # 테이블 존재 여부 확인
    try {
        aws dynamodb describe-table --table-name $TableName --region $Region 2>$null | Out-Null
        Write-Host "   ⚠️  $TableName 테이블이 이미 존재합니다. 스킵합니다." -ForegroundColor DarkYellow
        return
    } catch {
        # 테이블이 없으면 생성 진행
    }
    
    # Key Schema 구성
    $keySchema = "[{`"AttributeName`":`"$PartitionKey`",`"KeyType`":`"HASH`"}"
    
    if ($SortKey) {
        $keySchema += ",{`"AttributeName`":`"$SortKey`",`"KeyType`":`"RANGE`"}"
    }
    
    $keySchema += "]"
    
    # Attribute Definitions 구성
    $attributeDefinitions = "[{`"AttributeName`":`"$PartitionKey`",`"AttributeType`":`"$PartitionKeyType`"}"
    
    if ($SortKey) {
        $attributeDefinitions += ",{`"AttributeName`":`"$SortKey`",`"AttributeType`":`"$SortKeyType`"}"
    }
    
    # GSI 속성 추가
    foreach ($gsi in $GlobalSecondaryIndexes) {
        $attributeDefinitions += ",{`"AttributeName`":`"$($gsi.PartitionKey)`",`"AttributeType`":`"$($gsi.PartitionKeyType)`"}"
        if ($gsi.SortKey) {
            $attributeDefinitions += ",{`"AttributeName`":`"$($gsi.SortKey)`",`"AttributeType`":`"$($gsi.SortKeyType)`"}"
        }
    }
    
    $attributeDefinitions += "]"
    
    # GSI 구성
    $gsiParam = ""
    if ($GlobalSecondaryIndexes.Count -gt 0) {
        $gsiJson = "["
        foreach ($gsi in $GlobalSecondaryIndexes) {
            if ($gsiJson -ne "[") { $gsiJson += "," }
            
            $gsiKeySchema = "[{`"AttributeName`":`"$($gsi.PartitionKey)`",`"KeyType`":`"HASH`"}"
            if ($gsi.SortKey) {
                $gsiKeySchema += ",{`"AttributeName`":`"$($gsi.SortKey)`",`"KeyType`":`"RANGE`"}"
            }
            $gsiKeySchema += "]"
            
            $gsiJson += "{`"IndexName`":`"$($gsi.IndexName)`",`"KeySchema`":$gsiKeySchema,`"Projection`":{`"ProjectionType`":`"ALL`"}}"
        }
        $gsiJson += "]"
        $gsiParam = "--global-secondary-indexes '$gsiJson'"
    }
    
    # 테이블 생성 명령어 실행
    $cmd = "aws dynamodb create-table --table-name $TableName --attribute-definitions '$attributeDefinitions' --key-schema '$keySchema' --billing-mode PAY_PER_REQUEST $gsiParam --region $Region"
    
    Invoke-Expression $cmd | Out-Null
    
    Write-Host "   ✅ $TableName 테이블 생성 완료" -ForegroundColor Green
}

# ====================================
# 테이블 생성 시작
# ====================================

# 1. Users 테이블 (이미 존재하지만 확인)
Create-DynamoDBTable `
    -TableName "sayme-users" `
    -PartitionKey "userId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "EmailIndex"
            PartitionKey = "email"
            PartitionKeyType = "S"
        }
    )

# 2. Payments 테이블
Create-DynamoDBTable `
    -TableName "sayme-payments" `
    -PartitionKey "paymentId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "createdAt"
            SortKeyType = "S"
        },
        @{
            IndexName = "StatusIndex"
            PartitionKey = "status"
            PartitionKeyType = "S"
            SortKey = "createdAt"
            SortKeyType = "S"
        }
    )

# 3. Consultations 테이블
Create-DynamoDBTable `
    -TableName "sayme-consultations" `
    -PartitionKey "consultationId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
        },
        @{
            IndexName = "StatusIndex"
            PartitionKey = "status"
            PartitionKeyType = "S"
            SortKey = "createdAt"
            SortKeyType = "S"
        }
    )

# 4. PreConsultationQuestionnaire 테이블
Create-DynamoDBTable `
    -TableName "sayme-pre-questionnaire" `
    -PartitionKey "questionnaireId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdMonthIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "month"
            SortKeyType = "S"
        }
    )

# 5. CustomQuestions 테이블
Create-DynamoDBTable `
    -TableName "sayme-custom-questions" `
    -PartitionKey "questionSetId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdMonthIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "month"
            SortKeyType = "S"
        }
    )

# 6. Answers 테이블
Create-DynamoDBTable `
    -TableName "sayme-answers" `
    -PartitionKey "answerId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdMonthIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "month"
            SortKeyType = "S"
        },
        @{
            IndexName = "UserIdDayIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "dayNumber"
            SortKeyType = "N"
        }
    )

# 7. Summaries 테이블
Create-DynamoDBTable `
    -TableName "sayme-summaries" `
    -PartitionKey "summaryId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "month"
            SortKeyType = "S"
        },
        @{
            IndexName = "TierIndex"
            PartitionKey = "tier"
            PartitionKeyType = "S"
            SortKey = "createdAt"
            SortKeyType = "S"
        }
    )

# 8. Rewards 테이블
Create-DynamoDBTable `
    -TableName "sayme-rewards" `
    -PartitionKey "rewardId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "UserIdIndex"
            PartitionKey = "userId"
            PartitionKeyType = "S"
            SortKey = "month"
            SortKeyType = "S"
        },
        @{
            IndexName = "RefundStatusIndex"
            PartitionKey = "refundStatus"
            PartitionKeyType = "S"
        }
    )

# 9. Encouragements 테이블
Create-DynamoDBTable `
    -TableName "sayme-encouragements" `
    -PartitionKey "encouragementId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "ReceiverIdIndex"
            PartitionKey = "receiverId"
            PartitionKeyType = "S"
            SortKey = "date"
            SortKeyType = "S"
        },
        @{
            IndexName = "SenderIdIndex"
            PartitionKey = "senderId"
            PartitionKeyType = "S"
            SortKey = "date"
            SortKeyType = "S"
        }
    )

# 10. FortuneMessages 테이블
Create-DynamoDBTable `
    -TableName "sayme-fortune-messages" `
    -PartitionKey "messageId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "DatePatternIndex"
            PartitionKey = "datePattern"
            PartitionKeyType = "S"
        },
        @{
            IndexName = "CategoryIndex"
            PartitionKey = "category"
            PartitionKeyType = "S"
        }
    )

# 11. AdminUsers 테이블
Create-DynamoDBTable `
    -TableName "sayme-admin-users" `
    -PartitionKey "adminId" `
    -GlobalSecondaryIndexes @(
        @{
            IndexName = "EmailIndex"
            PartitionKey = "email"
            PartitionKeyType = "S"
        }
    )

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "테이블 생성 완료!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# ====================================
# 생성된 테이블 목록 확인
# ====================================
Write-Host "📋 생성된 테이블 목록:" -ForegroundColor White
Write-Host ""

$tables = aws dynamodb list-tables --region $Region | ConvertFrom-Json

foreach ($table in $tables.TableNames | Where-Object { $_ -like "sayme-*" }) {
    $tableInfo = aws dynamodb describe-table --table-name $table --region $Region | ConvertFrom-Json
    $itemCount = $tableInfo.Table.ItemCount
    $status = $tableInfo.Table.TableStatus
    
    Write-Host "   ✅ $table" -ForegroundColor Green
    Write-Host "      Status: $status, Items: $itemCount" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 다음 단계:" -ForegroundColor White
Write-Host "   1. CloudFront 설정 수정 (SPA 라우팅)" -ForegroundColor Gray
Write-Host "   2. Admin 인프라 구축 (admin.spirit-lab.me)" -ForegroundColor Gray
Write-Host "   3. Phase 2 개발 시작 (무료회원 체험 기능)" -ForegroundColor Gray
Write-Host ""

# 테이블 목록 저장
$tableList = @{
    region = $Region
    tables = $tables.TableNames | Where-Object { $_ -like "sayme-*" }
    createdAt = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

$tableList | ConvertTo-Json | Out-File -FilePath "dynamodb-tables-info.json" -Encoding UTF8

Write-Host "✅ 테이블 정보가 'dynamodb-tables-info.json' 파일에 저장되었습니다." -ForegroundColor Green
Write-Host ""
