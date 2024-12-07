const e=`# 🎯 What is the main goal?

---

**Colir**'s main goal is to provide secure communication through a fast messaging platform with end-to-end encryption. Here's how we achieve this:

1. **End-to-end encryption**: Users agree on a secret key before using the app. This key encrypts and decrypts data, ensuring secure communication.

2. **Client-side key storage**: Encryption keys for rooms are stored only on your device, not on our servers, maximizing security.

3. **Encrypted data transfer**: Our API only handles encrypted data, without access to the actual content.

4. **Room-based communication**: Create or join rooms using a GUID, but you'll need the right encryption key to read messages.

5. **Data expiry**: Set an expiry date for rooms, after which all data becomes inaccessible and is deleted.

6. **Passwordless authentication**: Sign in anonymously or use third-party providers like GitHub and Google.

By focusing on these features, **Colir** aims to give you a user-friendly platform for private, encrypted chats while keeping your data safe.
`;export{e as default};
