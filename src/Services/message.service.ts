import { Twilio } from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
export const sendMessage = async (body: any, phoneNumber: string) => {
  const client = new Twilio(accountSid, authToken);
  return client.messages.create({
    body,
    messagingServiceSid: "MG6481ac5da00f72f6d8dbd58587d6f52b",
    to: `+91${phoneNumber}`,
  })
  // .then(message => console.log(message.sid))
  // .catch(error=> console.log(error))
};
