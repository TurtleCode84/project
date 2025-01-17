export default function passwordReset(username, key) {
  const email = {
    subject: "Password Reset Requested",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>TrackTask &raquo; Password Reset Requested</title>
    </head>
    <body>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f4f4f4">
            <tr>
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border: 1px solid #dddddd; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);">
                        <tr>
                            <td style="padding: 20px;">
                            <img alt="TrackTask" src="https://tracktask.eu.org/tracktask.png" width="100%"/>
                                <h1>Password Reset Requested</h1>
                                <p>Hello ${username},</p>

                                <p>We&apos;ve received a request to reset your password for your account with TrackTask. Your account&apos;s security is our top priority, and we&apos;re here to help you regain access. If you didn&apos;t request this email, someone may be trying to compromise your account. Please delete this email if you didn&apos;t request it.</p>

                                <p>To reset your password, please follow the steps below:</p>

                                &bull; Click on the following link to open the password reset page: <a href="https://tracktask.eu.org/dashboard/account/reset-password/${key}">Reset Your Password</a><br><br>
                                &bull; Once the page loads, you will be prompted to enter a new password. Please choose a strong, unique password that includes a combination of upper and lower-case letters, numbers, and symbols for added security.<br><br>
                                &bull; After entering your new password, confirm it by typing it again in the provided field.<br><br>
                                &bull; Click the "Reset Password" button.

                                <p>If you did not initiate this password reset request, please disregard this email. Your current password will remain unchanged.</p>

                                <p>Please note that the password reset link is valid for 1 hour from the time of this email. If you don&apos;t complete the reset within this time frame, you may need to request another one.</p>

                                <p>If you encounter any issues or have questions, please don&apos;t hesitate to contact our support team at <a href="mailto:hello@tracktask.eu.org">hello@tracktask.eu.org</a>.</p>

                                <p>Best,</p>
                                <p>The TrackTask Team<br>
                                <a href="https://tracktask.eu.org">Visit the website</a></p>
                                
                                <p><em>Remember to keep your new password safe, don&apos;t share it with anyone!</em></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `,
  };
  return email;
}