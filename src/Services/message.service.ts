import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
export const sendMessage = async (body: any, phoneNumber: string) => {
  const client = new Twilio(accountSid, authToken);
  return client.messages.create({
    body,
    messagingServiceSid: "MGc3fa1b1bb213ef12045067e46202e44b",
    to: `+91${phoneNumber}`,
  });
  // .then((message) => console.log(message.sid));
};
