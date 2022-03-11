import { Twilio } from "twilio";
import dotenv from "dotenv";
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
export const sendMessage = async (body: any, phoneNumber: string) => {
  const client = new Twilio(accountSid, authToken);
  return client.messages.create({
    body,
    messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_ID as string,
    to: `+91${phoneNumber}`,
  });
  // .then(message => console.log(message.sid))
  // .catch(error=> console.log(error))
};
