# How do **keys** work?

---

Keys in Colir play a crucial role in ensuring secure, end-to-end encrypted communication. Here's how they work:

1. **Encryption Keys**:
   - Each room has its own unique encryption key.
   - The key is chosen by the user who creates the room.
   - It's used to encrypt and decrypt all messages within that room.
   - The same key must be used by all participants to successfully decrypt messages.

2. **Client-Side Storage**:
   - Encryption keys are stored exclusively on the client side.
   - They are never sent to or stored on the server.
   - This ensures that only users with the correct key can read the messages.

3. **Key Distribution**:
   - Users must share the encryption key securely outside of the Colir platform.
   - This could be through a secure channel like an in-person meeting or another encrypted communication method.

4. **Room Access**:
   - To join a room, users need two pieces of information:
     a) The room's GUID (globally unique identifier)
     b) The encryption key for that room
   - The GUID can be shared freely, but the encryption key should be kept secret among intended participants.

5. **Decryption Process**:
   - When a user enters a room, they input the encryption key.
   - This key is used locally to decrypt incoming messages and encrypt outgoing ones.
   - If an incorrect key is used, the messages will appear as gibberish.

6. **Security Implications**:
   - Even if someone gains access to the room's GUID, they can't read the messages without the correct encryption key.
   - The server only sees and stores encrypted data, maintaining user privacy.

7. **Key Management**:
   - Users are responsible for managing and remembering their encryption keys.
   - There's no key recovery process, as keys are not stored on the server.

By using this key system, Colir ensures that your communications remain private and secure, with encryption and decryption happening entirely on your device.