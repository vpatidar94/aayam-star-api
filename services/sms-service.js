const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const sendSMS = async (phoneNumber, OTP) => {
    // const apiUrl = process.env.SMS_API_URL;
    // const apiKey = process.env.SMS_API_KEY;

    // const url = `${apiUrl}?APIKey=${apiKey}&senderid=AAYAMC&channel=2&DCS=0&flashsms=0&number=91${phoneNumber}&text=Your OTP is: ${OTP}. Regards AAYAM&route=31&EntityId=1301159531158036635&dlttemplateid=1307161797225449463`;
    const url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=fc0e7fdc-2766-485b-800d-dcdce1ad6728&senderid=AAYAMC&channel=2&DCS=0&flashsms=0&number=${phoneNumber}&text= Your OTP is: ${OTP}.Regards AAYAM&route=31&EntityId=1301159531158036635&dlttemplateid=1307161797225449463`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return error;
    }
};

module.exports = sendSMS;