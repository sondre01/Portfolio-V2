import pg from 'pg';
const { Pool } = pg;

// Helper to initialize connection pool dynamically
let pool;
function getPool() {
    if (!pool) {
        const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error("Database connection string (DATABASE_URL or POSTGRES_URL) is missing.");
        }
        pool = new Pool({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false // Required for secure cloud DB hosts (like Vercel Postgres or Supabase)
            }
        });
    }
    return pool;
}

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

    const { name, email, phone, subject, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields: Name, Email, and Message are required.' });
    }

    // Check database config
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("Database connection string is missing in environment variables.");
        return res.status(500).json({ 
            error: 'Database configuration missing. Please add the DATABASE_URL environment variable in your Vercel settings.' 
        });
    }

    try {
        const db = getPool();

        // 1. Log the inquiry into the PostgreSQL database table
        const queryText = `
            INSERT INTO public.portfolio_messages (full_name, email_address, contact_number, subject, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const queryValues = [name, email, phone || null, subject || null, message];
        await db.query(queryText, queryValues);

        // 2. Dispatch Email Alert via Resend if credentials exist
        const resendApiKey = process.env.RESEND_API_KEY;
        const recipientEmail = process.env.RECIPIENT_EMAIL || 'gamboa.khinandrei@gmail.com';

        if (resendApiKey) {
            try {
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${resendApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Portfolio Contact <onboarding@resend.dev>', // Resend free tier
                        to: recipientEmail,
                        reply_to: email, // Direct reply path
                        subject: `Portfolio Inquiry: ${subject || 'New Message from ' + name}`,
                        html: `
                            <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; text-align: center;">
                                <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); overflow: hidden; text-align: left;">
                                    <!-- Header Accent Line (Brand Orange) -->
                                    <div style="height: 6px; background-color: #ff5e00;"></div>
                                    
                                    <!-- Main Content Padding -->
                                    <div style="padding: 40px 35px;">
                                        <!-- Header Indicator -->
                                        <div style="display: flex; align-items: center; margin-bottom: 25px;">
                                            <div style="width: 8px; height: 8px; background-color: #ff5e00; border-radius: 50%; margin-right: 8px;"></div>
                                            <span style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #ff5e00; font-family: monospace;">Telemetry: Message Saved & Dispatched</span>
                                        </div>
                                        
                                        <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 25px 0; letter-spacing: -0.5px; line-height: 1.25;">
                                            New message from ${name}
                                        </h1>
                                        
                                        <!-- Meta Data Grid -->
                                        <div style="background-color: #f8fafc; border-radius: 12px; padding: 22px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
                                            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 120px; vertical-align: top;">Sender Name</td>
                                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Email Address</td>
                                                    <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #ff5e00; text-decoration: none; font-weight: 700;">${email}</a></td>
                                                </tr>
                                                ${phone ? `
                                                <tr>
                                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Contact No.</td>
                                                    <td style="padding: 8px 0; color: #0f172a; font-weight: 700; font-family: monospace; letter-spacing: 0.5px;">${phone}</td>
                                                </tr>
                                                ` : ''}
                                                <tr>
                                                    <td style="padding: 8px 0; color: #64748b; font-weight: 600; vertical-align: top;">Subject</td>
                                                    <td style="padding: 8px 0; color: #334155; font-weight: 700;">${subject || 'N/A'}</td>
                                                </tr>
                                            </table>
                                        </div>
                                        
                                        <!-- Message Body -->
                                        <div style="margin-bottom: 35px;">
                                            <p style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin: 0 0 10px 0;">Message Content</p>
                                            <div style="background-color: #ffffff; border-left: 3px solid #ff5e00; padding: 15px 20px; font-size: 0.95rem; line-height: 1.6; color: #334155; margin: 0; white-space: pre-wrap; font-family: inherit; font-style: italic;">
                                                "${message}"
                                            </div>
                                        </div>
                                        
                                        <!-- Footer Meta -->
                                        <div style="border-top: 1px solid #f1f5f9; padding-top: 25px; text-align: center;">
                                            <p style="font-size: 0.75rem; color: #94a3b8; margin: 0 0 6px 0;">Logged to PostgreSQL & Sent via Resend</p>
                                            <p style="font-size: 0.7rem; color: #cbd5e1; margin: 0; font-family: monospace;">Timestamp: ${new Date().toISOString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    })
                });
            } catch (emailErr) {
                console.error("Email forwarding failed, but DB record was created:", emailErr);
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Serverless Function DB insert failed:", error);
        return res.status(500).json({ 
            error: `Internal server error: ${error.message || 'Could not save message to database.'}` 
        });
    }
}
