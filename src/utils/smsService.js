const OTP_API_URL = "https://www.fast2sms.com/dev/bulkV2";

async function sendSmsOtp(mobile, code) {
  const params = new URLSearchParams({
    authorization: process.env.FAST2SMS_API_KEY,
    route: "otp",
    variables_values: code,
    numbers: mobile,
  });

  const response = await fetch(`${OTP_API_URL}?${params.toString()}`);
  const data = await response.json();

  if (!data.return) {
    throw new Error(data.message?.[0] || "Failed to send OTP SMS");
  }
  return data;
}

module.exports = { sendSmsOtp };
