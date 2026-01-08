// Admin user configuration
const ADMIN_EMAILS = ['prakharshahi9935@gmail.com']; // Add admin emails here

export const isAdmin = (user) => {
  return user?.emailAddresses?.[0]?.emailAddress && 
         ADMIN_EMAILS.includes(user.emailAddresses[0].emailAddress);
};