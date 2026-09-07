import { getMessaging } from 'firebase-admin/messaging';
import { db } from '../db/index.ts';
import { citizenDevices } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { getApps } from 'firebase-admin/app';

/**
 * Sends an FCM notification to a specific citizen by their citizenId (from Postgres).
 * @param citizenId The Postgres ID of the citizen
 * @param title Notification title
 * @param body Notification body
 * @param data Optional payload data
 */
export async function sendCitizenNotification(
  citizenId: number,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  if (!getApps().length) {
    console.warn('Firebase admin not initialized, skipping notification.');
    return;
  }

  try {
    const devices = await db
      .select({ token: citizenDevices.fcmToken })
      .from(citizenDevices)
      .where(eq(citizenDevices.citizenId, citizenId));

    if (!devices || devices.length === 0) {
      console.log(`No registered devices found for citizen ${citizenId}.`);
      return;
    }

    const messaging = getMessaging();
    const tokens = devices.map(d => d.token);

    // Send multicast message
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data,
    });

    console.log(`Sent notifications to citizen ${citizenId}. Success: ${response.successCount}, Failures: ${response.failureCount}`);
    
    // Optionally clean up failed tokens (e.g., if token is not registered anymore)
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success && resp.error) {
          console.error(`Failed to send to token ${tokens[idx]}:`, resp.error.message);
          // In a real app, if the error is "messaging/registration-token-not-registered",
          // we would delete the token from the database.
        }
      });
    }

  } catch (error) {
    console.error('Error sending notification:', error);
  }
}
