# 🔑 How do keys work?

---

Keys are crucial for secure, **end-to-end encrypted communication** in **Colir**. Here's the lowdown:

1. **Encryption Keys**:

   - You set your own key for a room, but it needs to match with other members to read their messages and send ones they can decrypt.

2. **Encryption Algorithm**:

   - We use AES-256, a strong and widely trusted encryption method.

3. **Client-Side Storage**:

   - Keys are stored only on your device, never on our servers. This means only users with the right key can read messages.

4. **What's Not Encrypted**:

   - Room names, user names, timestamps, and reactions aren't encrypted.

5. **Key Distribution**:

   - Share keys securely outside Colir, like in person or through another encrypted channel.

6. **Room Access**:

   - To join a room, you need two things:
     a) The room's GUID (a unique identifier)
     b) The encryption key for that room
   - You can share the GUID freely, but keep the key secret!

7. **Decryption Process**:

   - When you enter a room, you input the key. This decrypts incoming messages and encrypts outgoing ones on your device.
   - Wrong key? Messages will look like gibberish.

8. **Security Implications**:

   - Even if someone gets the room's GUID, they can't read messages without the right key.
   - Our servers only see encrypted data, keeping your chats private.

9. **Key Management**:
   - You're responsible for remembering your keys. We can't recover them for you since we don't store them.

This key system ensures your chats stay private and secure, with all the encryption magic happening right on your device.
