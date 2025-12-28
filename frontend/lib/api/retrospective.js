const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function saveRetrospective(userId, answers) {
  try {
    const response = await fetch(`${API_URL}/retrospective/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        answers
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to save retrospective:', error);
    throw error;
  }
}

export async function getRetrospective(userId) {
  try {
    const response = await fetch(
      `${API_URL}/retrospective/current?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get retrospective:', error);
    throw error;
  }
}