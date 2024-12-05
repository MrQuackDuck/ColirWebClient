# What is the main goal?

---

The main goal of **Colir** is to provide an ability to communicate securely. 

Colir is designed as a fast and secure messaging platform with end-to-end encryption. To achieve this goal, the application implements the following key features:

1. **End-to-end encryption**: Users should discuss a secret key before using the application. This key is used to encrypt and decrypt the data, ensuring secure communication.

2. **Client-side key storage**: The encryption keys for rooms are stored only on the client side and are not sent to the server, maintaining the highest level of security.

3. **Encrypted data transfer**: The API's primary role is to transfer and store the encrypted data, without having access to the decrypted content.

4. **Room-based communication**: Users can create and join rooms using a GUID, but can only decrypt the data if they have the correct encryption key.

5. **Data expiry**: Rooms can be set with an expiry date, after which all data becomes inaccessible and is permanently deleted.

6. **Passwordless authentication**: Users can authenticate anonymously or using third-party providers like GitHub and Google.

By focusing on these features, Colir aims to provide a secure and user-friendly platform for encrypted communication, prioritizing user privacy and data protection.