const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",")
    : ["monu012as@gmail.com", "prakharshahi9935@gmail.com"]
).map((email) => email.trim().toLowerCase());

export const requireAdmin = (req, res, next) => {
  try {
    const userEmail = req.user?.email?.toLowerCase();
    
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    next();
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
