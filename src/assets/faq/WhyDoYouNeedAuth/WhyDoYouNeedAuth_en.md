# Why do you need auth?

---

Authentication in **Colir** serves several important purposes:

1. **User Identification**: Auth provides each user with a unique "Colir ID", a 6-symbol hexadecimal number. This allows users to be identified within the system, which is crucial for features like joining rooms and participating in conversations.

2. **Persistent Access**: While Colir offers anonymous authentication, it's a one-time option. Using third-party authentication providers like GitHub or Google allows users to access their account repeatedly, maintaining continuity in their use of the platform.

3. **Security**: Authentication helps protect user data and ensures that only authorized individuals can access certain features or rooms within the application.

4. **Personalization**: With authenticated accounts, users can potentially save preferences, manage their rooms, or access their message history (in encrypted form) across sessions.

5. **Account Recovery**: For users authenticated via GitHub or Google, there's a possibility of account recovery if needed, which is not possible with anonymous authentication.

6. **Abuse Prevention**: Authentication can help prevent or mitigate abuse of the platform by allowing the system to track and manage user behavior.

7. **Feature Access**: Some features might be limited to authenticated users to ensure the quality and security of the service.

It's important to note that while authentication is necessary for these reasons, Colir maintains its commitment to privacy and security. The authentication process doesn't compromise the end-to-end encryption of messages, as encryption **keys are managed client-side** and are not shared with the server.