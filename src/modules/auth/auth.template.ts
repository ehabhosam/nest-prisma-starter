// forgot password HTML template

export const getEmailHTML = (url: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Forgot Password</h1>
      <p style="color: #333;">
        You are receiving this email because you (or someone else) have requested the reset of the password for your account.
      </p>
      <p style="color: #333;">
        Please click the following link to complete the process:
      </p>
      <a href="${url}" style="color: #fff; background-color: #007bff; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
      <p style="color: #333;">
        If you did not request this, please ignore this email and your password will remain unchanged.
      </p>
    </div>
  `;
};
