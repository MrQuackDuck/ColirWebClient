# What is a room?

---

In Colir, a room is a fundamental concept that serves as the primary space for secure communication. Here's what you need to know about rooms:

1. **Definition**:
   - A room is a dedicated space where encrypted communication takes place.
   - It's the virtual equivalent of a private meeting area.

2. **Creation**:
   - Any user can create a room.
   - When creating a room, the user sets an encryption key for that room.

3. **Identification**:
   - Each room is assigned a unique GUID (Globally Unique Identifier).
   - This GUID is used to identify and access the room.

4. **Access**:
   - To join a room, a user needs two pieces of information:
     a) The room's GUID
     b) The correct encryption key
   - Anyone with the GUID can attempt to join, but only those with the correct key can decrypt messages.

5. **Encryption**:
   - All communication within a room is end-to-end encrypted.
   - The encryption key is set during room creation and must be shared securely outside of Colir.

6. **Features**:
   - Each room has one voice channel for audio communication.
   - Text messages can be exchanged within the room.

7. **Expiry**:
   - Rooms can be created with an expiry date.
   - When the expiry date is reached, all data in the room becomes inaccessible and is permanently deleted.

8. **Privacy**:
   - The server only stores and transfers encrypted data.
   - Without the correct encryption key, the data in a room is unreadable, even if someone gains unauthorized access.

9. **Flexibility**:
   - Rooms can be used for various purposes, such as private conversations, group discussions, or temporary information sharing.

Rooms in Colir provide a secure, flexible, and controlled environment for encrypted communication, ensuring that your conversations remain private and protected.