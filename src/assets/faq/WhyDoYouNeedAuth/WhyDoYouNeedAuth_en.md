# 🔒 Why do you need auth?

---

Authentication in **Colir** serves several important purposes:

1. **User Identification**: You get a unique "Colir ID" - a 6-symbol hex number. This helps identify you within the system for joining rooms and chatting.

2. **Persistent Access**: While we offer anonymous sign-in, it's one-time only. Your session will expire, making it impossible to access the account later. Using **GitHub** or **Google** lets you log in repeatedly.

3. **Security**: Auth helps protect your data and ensures that only you can access your account. It also helps prevent unauthorized access to your account.

4. **Account Recovery**: If you use **GitHub** or **Google**, you might be able to recover your account if needed. This isn't possible with anonymous auth.

5. **Colir ID**: When you choose to sign in with **GitHub** or **Google**, you get to pick a **Colir ID**. This ID is consistent across logins and helps others identify you in rooms.

Remember, even with auth, we still prioritize your privacy. The authentication process doesn't affect the end-to-end encryption of your messages, as encryption keys are managed on your device and aren't shared with our servers.
