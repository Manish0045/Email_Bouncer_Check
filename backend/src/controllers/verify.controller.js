const isValidSyntax = require("../services/syntax.services");
const hasMX = require("../services/mx.services"); // the improved version
const isRisky = require("../services/risk.services");
const sgMail = require("../config/sendgrid");

// Single email verification function
const verifySingleEmail = async (email) => {
    const domain = email.split("@")[1];

    // 1️⃣ Syntax check
    if (!isValidSyntax(email)) return { email, status: "undeliverable" };

    // 2️⃣ MX check
    const mxValid = await hasMX(domain);
    if (!mxValid) return { email, status: "undeliverable" };

    // 3️⃣ Risky check
    if (isRisky(email)) return { email, status: "risky" };

    // 4️⃣ Attempt sending (optional: you can skip for bulk)
    try {
        await sgMail.send({
            to: email,
            from: process.env.FROM_EMAIL,
            subject: "Email Verification",
            text: "This is a test verification email."
        });
        return { email, status: "deliverable" };
    } catch (error) {
        console.error(`SendGrid failed for ${email}:`, error.response ? error.response.body : error);
        return { email, status: "unknown" };
    }
};

// Single email endpoint
exports.verifyEmail = async (req, res) => {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: "Email is required" });

    const result = await verifySingleEmail(email);
    return res.status(200).json(result);
};

// Bulk emails endpoint
exports.verifyBulkEmails = async (req, res) => {
    const { emails } = req.body || {};
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return res.status(400).json({ error: "Emails array is required" });
    }

    try {
        // Process all emails in parallel
        const results = await Promise.all(
            emails.map(email => verifySingleEmail(email))
        );

        return res.status(200).json(results);
    } catch (error) {
        console.error("Bulk verification error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};
