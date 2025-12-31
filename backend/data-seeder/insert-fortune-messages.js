const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { randomUUID } = require('crypto');

// DynamoDB 클라이언트 설정
const client = new DynamoDBClient({ region: 'ap-northeast-2' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'sayme-fortune-messages';

// 샘플 운세 메시지 데이터 (30일치)
const fortuneMessages = [
  {
    datePattern: '12-24',
    fortuneText: '오늘은 과거의 나를 돌아보기 좋은 날입니다. 한 해를 마무리하며, 내가 걸어온 길을 천천히 되짚어보는 시간을 가져보세요.',
    questionPrompt: '올해 가장 감사했던 순간은 언제인가요?',
    category: 'reflection'
  },
  {
    datePattern: '12-25',
    fortuneText: '새로운 시작을 준비하는 시간입니다. 내년에 이루고 싶은 작은 목표를 생각해보세요.',
    questionPrompt: '내년 이맘때, 나는 어떤 모습이길 바라나요?',
    category: 'growth'
  },
  {
    datePattern: '12-26',
    fortuneText: '주변 사람들에게 감사를 표현하기 좋은 날입니다. 소중한 이들과의 연결을 되새겨보세요.',
    questionPrompt: '올해 나에게 가장 큰 힘이 되어준 사람은 누구인가요?',
    category: 'gratitude'
  },
  {
    datePattern: '12-27',
    fortuneText: '내면의 소리에 귀 기울이기 좋은 날입니다. 나 자신과의 대화가 필요한 시간입니다.',
    questionPrompt: '지금 내 마음이 진짜 원하는 것은 무엇인가요?',
    category: 'reflection'
  },
  {
    datePattern: '12-28',
    fortuneText: '작은 성취들을 돌아보는 시간입니다. 완벽하지 않아도 괜찮습니다.',
    questionPrompt: '올해 나를 가장 자랑스럽게 만든 일은 무엇인가요?',
    category: 'growth'
  },
  {
    datePattern: '12-29',
    fortuneText: '마음의 짐을 내려놓기 좋은 날입니다. 용서와 화해의 시간을 가져보세요.',
    questionPrompt: '올해 놓아주고 싶은 것은 무엇인가요?',
    category: 'reflection'
  },
  {
    datePattern: '12-30',
    fortuneText: '변화와 성장을 축하하는 날입니다. 내가 얼마나 성장했는지 돌아보세요.',
    questionPrompt: '작년의 나와 비교했을 때, 가장 크게 달라진 점은?',
    category: 'growth'
  },
  {
    datePattern: '12-31',
    fortuneText: '한 해의 마지막 날, 감사와 기대로 마음을 채우세요. 모든 경험이 나를 만들었습니다.',
    questionPrompt: '올해의 나에게 전하고 싶은 한 마디는?',
    category: 'gratitude'
  },
  {
    datePattern: '01-01',
    fortuneText: '새로운 시작의 에너지가 가득한 날입니다. 설레는 마음으로 한 걸음 내딛어보세요.',
    questionPrompt: '올해 가장 먼저 시작하고 싶은 일은 무엇인가요?',
    category: 'growth'
  },
  {
    datePattern: '01-02',
    fortuneText: '차분히 계획을 세우기 좋은 날입니다. 현실적이면서도 의미 있는 목표를 생각해보세요.',
    questionPrompt: '올해 나는 어떤 사람이 되고 싶나요?',
    category: 'reflection'
  },
  {
    datePattern: '01-03',
    fortuneText: '작은 실천이 큰 변화를 만듭니다. 오늘 할 수 있는 한 가지를 정해보세요.',
    questionPrompt: '오늘부터 시작할 수 있는 작은 습관은?',
    category: 'growth'
  },
  {
    datePattern: '01-04',
    fortuneText: '내 주변의 좋은 에너지를 느끼는 날입니다. 긍정적인 관계에 집중해보세요.',
    questionPrompt: '함께 성장하고 싶은 사람은 누구인가요?',
    category: 'gratitude'
  },
  {
    datePattern: '01-05',
    fortuneText: '자기 자신에게 친절해지는 연습이 필요한 날입니다. 완벽함을 내려놓으세요.',
    questionPrompt: '나 자신에게 해주고 싶은 칭찬은?',
    category: 'reflection'
  },
  {
    datePattern: '01-06',
    fortuneText: '새로운 도전을 준비하기 좋은 날입니다. 두려움보다 기대가 앞서는 일을 찾아보세요.',
    questionPrompt: '올해 꼭 도전해보고 싶은 것은?',
    category: 'growth'
  },
  {
    datePattern: '01-07',
    fortuneText: '지난 일주일을 돌아보며 감사를 느끼는 시간입니다.',
    questionPrompt: '이번 주 가장 기억에 남는 순간은?',
    category: 'gratitude'
  },
  {
    datePattern: '01-08',
    fortuneText: '내면의 강인함을 발견하는 날입니다. 어려움을 극복한 경험을 떠올려보세요.',
    questionPrompt: '힘들었지만 이겨낸 순간을 기억하나요?',
    category: 'reflection'
  },
  {
    datePattern: '01-09',
    fortuneText: '배움과 성장에 열려있는 마음이 필요한 날입니다.',
    questionPrompt: '지금 배우고 싶은 것은 무엇인가요?',
    category: 'growth'
  },
  {
    datePattern: '01-10',
    fortuneText: '소소한 행복에 집중하기 좋은 날입니다. 일상 속 감사를 찾아보세요.',
    questionPrompt: '오늘 나를 미소 짓게 한 것은?',
    category: 'gratitude'
  },
  {
    datePattern: '01-11',
    fortuneText: '자기 이해의 시간이 필요합니다. 내가 진짜 원하는 것을 찾아보세요.',
    questionPrompt: '나를 행복하게 만드는 것은 무엇인가요?',
    category: 'reflection'
  },
  {
    datePattern: '01-12',
    fortuneText: '변화를 만들기 위한 용기가 필요한 날입니다.',
    questionPrompt: '바꾸고 싶은 습관이나 패턴이 있나요?',
    category: 'growth'
  },
  {
    datePattern: '01-13',
    fortuneText: '주변 사람들의 소중함을 느끼는 날입니다.',
    questionPrompt: '요즘 고마운 사람에게 전하고 싶은 말은?',
    category: 'gratitude'
  },
  {
    datePattern: '01-14',
    fortuneText: '자기 돌봄의 중요성을 인식하는 날입니다.',
    questionPrompt: '나를 위해 오늘 할 수 있는 일은?',
    category: 'reflection'
  },
  {
    datePattern: '01-15',
    fortuneText: '새로운 관점으로 세상을 바라보는 연습이 필요합니다.',
    questionPrompt: '최근 생각이 바뀐 부분이 있나요?',
    category: 'growth'
  },
  {
    datePattern: '01-16',
    fortuneText: '감사의 마음을 표현하기 좋은 날입니다.',
    questionPrompt: '당연하게 여겼지만 사실 감사한 것은?',
    category: 'gratitude'
  },
  {
    datePattern: '01-17',
    fortuneText: '내면의 평화를 찾는 시간이 필요합니다.',
    questionPrompt: '나에게 평온함을 주는 것은 무엇인가요?',
    category: 'reflection'
  },
  {
    datePattern: '01-18',
    fortuneText: '성장의 기회를 포착하기 좋은 날입니다.',
    questionPrompt: '지금 나에게 필요한 성장은?',
    category: 'growth'
  },
  {
    datePattern: '01-19',
    fortuneText: '작은 기쁨들을 모으는 날입니다.',
    questionPrompt: '이번 주 나를 즐겁게 한 작은 일들은?',
    category: 'gratitude'
  },
  {
    datePattern: '01-20',
    fortuneText: '자기 성찰의 시간을 갖기 좋은 날입니다.',
    questionPrompt: '최근 나 자신에 대해 새롭게 알게 된 점은?',
    category: 'reflection'
  },
  {
    datePattern: '01-21',
    fortuneText: '앞으로 나아갈 방향을 생각해보는 날입니다.',
    questionPrompt: '다음 달 나는 어떤 변화를 만들고 싶나요?',
    category: 'growth'
  },
  {
    datePattern: '01-22',
    fortuneText: '감사와 만족의 에너지를 느끼는 날입니다.',
    questionPrompt: '지금 내 삶에서 가장 감사한 부분은?',
    category: 'gratitude'
  }
];

// 데이터 삽입 함수
async function insertFortuneMessages() {
  console.log('🚀 FortuneMessages 데이터 삽입 시작...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const message of fortuneMessages) {
    try {
      const item = {
        messageId: randomUUID(),
        datePattern: message.datePattern,
        fortuneText: message.fortuneText,
        questionPrompt: message.questionPrompt,
        category: message.category,
        createdBy: 'system',
        createdAt: new Date().toISOString()
      };

      await docClient.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      }));

      console.log(`✅ [${message.datePattern}] ${message.category} - 삽입 성공`);
      successCount++;
    } catch (error) {
      console.error(`❌ [${message.datePattern}] 삽입 실패:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 완료: 성공 ${successCount}개, 실패 ${errorCount}개`);
}

// 실행
insertFortuneMessages()
  .then(() => {
    console.log('\n✨ 모든 운세 메시지가 성공적으로 삽입되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 오류 발생:', error);
    process.exit(1);
  });