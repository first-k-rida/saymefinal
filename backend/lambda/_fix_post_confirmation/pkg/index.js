'use strict';

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Cognito User Pool - Post Confirmation Trigger
 *
 * ⚠️ 운영 핵심 원칙
 * - 이 Lambda에서 throw 하면 회원가입/확정 전체가 실패함
 * - 따라서 어떤 경우에도 throw 하지 않는다
 * - 실패 시 로그만 남기고 event를 그대로 반환
 */
exports.handler = async (event) => {
  console.log("PostConfirmation triggered");
  console.log("userPoolId:", event?.userPoolId);
  console.log("userName:", event?.userName);

  try {
    const attrs = event.request.userAttributes;

    const emailVerified = attrs.email_verified === 'true';
    if (!emailVerified) {
      console.warn("Email not verified yet. Skipping user creation.");
      return event;
    }

    const userId = attrs.sub;
    const email = attrs.email;
    const username = attrs.name || email.split('@')[0];
    const now = new Date().toISOString();

    const userProfile = {
      userId,
      email,
      username,
      createdAt: now,
      lastLoginAt: now,

      paymentStatus: "trial",
      paymentConfirmedAt: null,
      consultationStatus: "pending",
      consultationDate: null,

      preSurveyCompleted: false,
      inputMethod: "text",

      notificationEmail: true,
      dailyReminder: true,
      reminderTime: "21:00",

      consecutiveMonths: 0,
      discountCount: 0,
      totalChallenges: 0,
      completedChallenges: 0,

      name: null,
      phoneNumber: null,
      gender: null,
      birthDate: null,
      birthTime: null,
      birthCity: null,
      birthCountry: null,

      bankAccount: null,
      accountStatus: "active",
      emailVerified: true,
      profileImage: null,

      updatedAt: now
    };

    const command = new PutCommand({
      TableName: "sayme-users",
      Item: userProfile,
      ConditionExpression: "attribute_not_exists(userId)"
    });

    await docClient.send(command);

    console.log("User profile created:", userId);

  } catch (error) {
    // ❗️절대 throw 하지 말 것
    if (error?.name === 'ConditionalCheckFailedException') {
      console.log("User already exists. Skipping creation.");
    } else {
      console.error("PostConfirmation error (swallowed):", error);
    }
  }

  // 가입 플로우를 막지 않기 위해 항상 event 반환
  return event;
};
