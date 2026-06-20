// Vercel Serverless Function to send email via Resend API
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: name, email, and message are required.' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
        console.error("RESEND_API_KEY environment variable is not configured on Vercel.");
        return res.status(500).json({ error: 'Mail server is not configured. Please add RESEND_API_KEY to your environment variables.' });
    }

    // Recipient email (defaults to the person contacting, but you typically send it to your own email)
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'gamboa.khinandrei@gmail.com';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Portfolio Contact <onboarding@resend.dev>', // Resend free tier requires sending from onboarding@resend.dev
                to: recipientEmail,
                reply_to: email, // Allows you to reply directly to the sender's email
                subject: `Portfolio Contact: ${subject || 'New Message from ' + name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #ff5e00; border-bottom: 2px solid #ff5e00; padding-bottom: 10px;">New Portfolio Contact</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 4px; line-height: 1.6;">${message}</p>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Resend API returned error:", data);
            return res.status(response.status).json({ error: data.message || 'Failed to deliver email.' });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Serverless Function exception:", error);
        return res.status(500).json({ error: 'Internal server error occurred while sending email.' });
    }
}
