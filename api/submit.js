export default async function handler(req, res) {
    // Enable CORS for Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        const { phone, description } = req.body;

        if (!phone || !description) {
            return res.status(400).json({ error: 'Липсват телефон или описание.' });
        }

        // 1. Send Telegram Notification
        const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
        const telegramChatId = process.env.TELEGRAM_CHAT_ID || '8625026165';
        
        let telegramPromise = Promise.resolve();
        if (telegramToken && telegramChatId) {
            const telegramText = `🚀 <b>Нова заявка в Премиум Студио!</b>\n\n📱 <b>Телефон:</b> <code>${phone}</code>\n📝 <b>Описание:</b>\n${description}`;

            telegramPromise = fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: telegramText,
                    parse_mode: 'HTML'
                })
            });
        } else {
            console.warn('Missing Telegram credentials in environment.');
        }

        // 2. Normalize Phone & Send Twilio SMS
        const normalizedPhone = normalizePhone(phone);
        let twilioPromise = Promise.resolve();

        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioNumber = process.env.TWILIO_NUMBER || '+16812591453';

        if (normalizedPhone && twilioSid && twilioAuthToken) {
            const smsText = 'Благодарим ви, екипа ни скоро ще разгледа заявката ви и ще се свърже с вас.';

            const basicAuth = btoa(`${twilioSid}:${twilioAuthToken}`);
            const bodyParams = new URLSearchParams();
            bodyParams.append('From', twilioNumber);
            bodyParams.append('To', normalizedPhone);
            bodyParams.append('Body', smsText);

            twilioPromise = fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyParams.toString()
            });
        } else {
            console.warn('Could not send SMS: check normalized phone or missing Twilio credentials in environment.');
        }

        const [tgRes, twilioRes] = await Promise.all([telegramPromise, twilioPromise]);

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Submit API Handler Error:', error);
        return res.status(500).json({ error: 'Възникна вътрешна грешка: ' + error.message });
    }
}

// Normalizer to format phone string to standard E.164 for Twilio
function normalizePhone(phoneStr) {
    if (!phoneStr) return null;
    
    // Keep only numbers and plus signs
    let cleaned = phoneStr.replace(/[^0-9+]/g, '');
    
    // Handle Bulgarian local format starting with 08... -> convert to +3598...
    if (cleaned.startsWith('0') && cleaned.length >= 9) {
        cleaned = '+359' + cleaned.substring(1);
    }
    
    // Handle format starting with 3598... -> convert to +3598...
    if (cleaned.startsWith('359') && !cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
    }
    
    // Handle short format without prefix (e.g. 888123456) -> prepend +359
    if (!cleaned.startsWith('+') && cleaned.length === 9) {
        cleaned = '+359' + cleaned;
    }
    
    // Final check: must have a plus and at least 10 digits
    if (cleaned.startsWith('+') && cleaned.length >= 10) {
        return cleaned;
    }
    
    return null;
}
