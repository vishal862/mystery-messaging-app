import twilio from "twilio";

export async function sendOtpToUser(phoneNumber: string, otp: string) {
    console.log(phoneNumber);
    
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    client.messages
      .create({
        body: otp,
        from: "+16067281172",
        to: phoneNumber,
      })
      .catch((error) => {
        console.log(error);
      });

    return { success: true, message: "otp has been sent" };
  } catch (error) {
    console.log("error occured while sending the otp", error);
    return { success: false, message: "Failed to send otp" };
  }
}
