# What is a GUID?

---

In the context of Colir, a GUID plays a crucial role in room identification and access. Here's what you need to know about GUIDs:

1. **Definition**:
   - GUID stands for Globally Unique Identifier.
   - It's a 128-bit number used to identify resources or entities in software systems.

2. **Characteristics**:
   - A GUID is typically represented as a 32-character hexadecimal string.
   - Example: 550e8400-e29b-41d4-a716-446655440000
   - GUIDs are designed to be unique across all computers and networks.

3. **Purpose in Colir**:
   - In Colir, each room is assigned a unique GUID.
   - This GUID serves as the room's identifier and is used to access the room.

4. **Sharing**:
   - Users can share the GUID of a room with others to invite them.
   - Unlike the encryption key, the GUID can be shared freely without compromising security.

5. **Access Control**:
   - Knowing a room's GUID allows a user to attempt to join the room.
   - However, without the correct encryption key, the user won't be able to decrypt any messages.

6. **Privacy**:
   - The GUID itself doesn't reveal any information about the room's content or participants.
   - It's safe to share GUIDs through potentially insecure channels.

7. **Generation**:
   - GUIDs are generated automatically by the system when a new room is created.
   - The uniqueness of GUIDs ensures that no two rooms will ever have the same identifier.

8. **User Interaction**:
   - Users don't need to understand the technical details of GUIDs.
   - They simply need to know that the GUID is the "address" or "code" for accessing a specific room.

In essence, the GUID in Colir acts like a room number or address, allowing users to locate and access specific rooms within the platform while maintaining the security of the encrypted communications within those rooms.