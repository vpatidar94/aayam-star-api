const http = require('http');
const https = require('https');

const sendRank = async (user, std, outOf, title, totalPoints) => {
    try {
        const payload = {
            "to": '91' + user.mobileNo,
            "recipient_type": "individual",
            "type": "template",
            "template": {
                "language": {
                    "policy": "deterministic",
                    "code": "en"
                },
                "name": "aayam_star_rank_2",
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": std.rank + '', //rank std.rank
                            },
                            {
                                "type": "text",
                                "text": title + '', //out of outOf
                            },
                            {
                                "type": "text",
                                "text": outOf + '',
                            },
                            {
                                "type": "text",
                                "text": std.points + '', //points > std.points
                            },
                            {
                                "type": "text",
                                "text": totalPoints + '',
                            },
                            {
                                "type": "text",
                                "text": "2000"
                            }
                        ]
                    }
                ]
            }
        }
        // Assuming WPMessageTemplate is a function that sends the WhatsApp message
        return await WPMessageTemplate(payload);
    } catch (error) {
        console.log('Error sending WhatsApp message: ' + error);
        throw error;
    }
};

const sendWpAdminLoginLink = async (number, orgCode, otp) => {
    const decryptOtp = btoa(otp);
    const loginLink = `${number}/${orgCode}?validate=${decryptOtp}`;
    console.log('----------------------------');
    console.log('link', loginLink);
    console.log('otp', decryptOtp, decryptOtp);
    console.log('orgCode', orgCode);
    try {
        const payload ={
            "to": '91'+number,
            "recipient_type": "individual",
            "type": "template",
            "template": {
                "language": {
                    "policy": "deterministic",
                    "code": "en"
                },
                "name": "subadmin",
                "components": [
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": decryptOtp+''
                            },
                            {
                                "type": "text",
                                "text": orgCode+''
                            }
                        ]
                    },
                    {
                        "type": "button",
                        "sub_type": "url",
                        "index": 0,
                        "parameters": [
                            {
                                "type": "text",
                                "text": loginLink
                            }
                        ]
                    }
                ]
            }
        }
        
        return await WPMessageTemplate(payload);
    } catch (error) {
        console.log('err ------------', error);
        throw error;
    }
}

const WPMessageTemplate = async (payload) => {
    const url = process.env.WHATSAPP_API_URL; // Replace with your WhatsApp API URL
    const apiKey = process.env.WHATSAPP_API_KEY; // Replace with your API key

    const headers = {
        'Content-Type': 'application/json',
        'API-KEY': apiKey,
    };

    const requestOptions = {
        method: 'POST',
        headers: headers,
    };

    const req = https.request(url, requestOptions, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                return response;
                // Handle the response as needed
            } catch (error) {
                console.error('Error parsing response:', error);
                return error;
                // throw new Error('Error parsing response:', error);
            }
        });
    });

    // Handle request errors
    req.on('error', (error) => {
        console.log('Error sending WhatsApp message: ' + error);
        return error;
        // throw error;
    });
    console.log('send messages', JSON.stringify(payload));
    // Send the payload
    req.write(JSON.stringify(payload));

    // End the request
    req.end();
};

module.exports = {
    sendRank, sendWpAdminLoginLink
};
