import axios from 'axios';

const mailslurpApiKey = '6fed2282d8501f04d1120667c1294beeef4d845a8706bc5e1a74e2437a9a082a';
export const mailslurp = axios.create({
  baseURL: 'https://api.mailslurp.com',
  headers: { 'x-api-key': mailslurpApiKey },
});

// Helper to create a new inbox
export async function createInbox() {
  const response = await mailslurp.post('/inboxes');
  return response.data;
}

// Helper to fetch the full email content by email ID
async function getEmailContent(emailId: string) {
  const response = await mailslurp.get(`/emails/${emailId}`);
  return response.data;
}

// Helper to wait for an email to arrive
export async function waitForEmail(inboxId: string, timeout = 30000) {
  const endTime = Date.now() + timeout;

  while (Date.now() < endTime) {
    const response = await mailslurp.get(`/inboxes/${inboxId}/emails`);
    const emails = response.data;

    if (emails.length > 0) {
      const emailId = emails[0].id;
      return await getEmailContent(emailId); // Fetch full email content
    }

    await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
  }

  throw new Error('Email not received within the timeout period');
}
