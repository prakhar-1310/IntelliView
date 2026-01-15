// Admin user configuration
const ADMIN_EMAILS = ['monu012as@gmail.com','prakharshahi9935@gmail.com']; // Add admin emails here

export const isAdmin = (user) => {
  return user?.emailAddresses?.[0]?.emailAddress && 
         ADMIN_EMAILS.includes(user.emailAddresses[0].emailAddress);
};