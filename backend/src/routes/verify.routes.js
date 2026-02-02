const router = require("express").Router();
const { verifyEmail, verifyBulkEmails } = require("../controllers/verify.controller"); 

router.post("/verify", verifyEmail);
router.post("/verify-bulk", verifyBulkEmails);

module.exports = router; 
