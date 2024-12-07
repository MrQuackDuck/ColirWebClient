# 🔑 Wie funktionieren die Schlüssel?

---

Schlüssel sind entscheidend für die sichere, **Ende-zu-Ende verschlüsselte Kommunikation** in **Colir**. Hier sind die wichtigsten Informationen:

1. **Verschlüsselungsschlüssel**:

   - Sie legen Ihren eigenen Schlüssel für einen Raum fest, aber er muss mit dem anderer Mitglieder übereinstimmen, um deren Nachrichten zu lesen und Nachrichten zu senden, die sie entschlüsseln können.

2. **Verschlüsselungsalgorithmus**:

   - Wir verwenden AES-256, eine starke und weithin vertrauenswürdige Verschlüsselungsmethode.

3. **Clientseitige Speicherung**:

   - Schlüssel werden nur auf Ihrem Gerät gespeichert, nie auf unseren Servern. Das bedeutet, dass nur Benutzer mit dem richtigen Schlüssel Nachrichten lesen können.

4. **Was nicht verschlüsselt ist**:

   - Raumnamen, Benutzernamen, Zeitstempel und Reaktionen sind nicht verschlüsselt.

5. **Schlüsselverteilung**:

   - Teilen Sie Schlüssel sicher außerhalb von Colir, zum Beispiel persönlich oder über einen anderen verschlüsselten Kanal.

6. **Raumzugang**:

   - Um einem Raum beizutreten, benötigen Sie zwei Dinge:
     a) Die GUID des Raums (eine eindeutige Kennung)
     b) Den Verschlüsselungsschlüssel für diesen Raum
   - Sie können die GUID frei teilen, aber halten Sie den Schlüssel geheim!

7. **Entschlüsselungsprozess**:

   - Wenn Sie einen Raum betreten, geben Sie den Schlüssel ein. Dies entschlüsselt eingehende Nachrichten und verschlüsselt ausgehende Nachrichten auf Ihrem Gerät.
   - Falscher Schlüssel? Nachrichten werden wie Kauderwelsch aussehen.

8. **Sicherheitsimplikationen**:

   - Selbst wenn jemand die GUID des Raums erhält, kann er ohne den richtigen Schlüssel keine Nachrichten lesen.
   - Unsere Server sehen nur verschlüsselte Daten, wodurch Ihre Chats privat bleiben.

9. **Schlüsselverwaltung**:
   - Sie sind dafür verantwortlich, sich Ihre Schlüssel zu merken. Wir können sie nicht für Sie wiederherstellen, da wir sie nicht speichern.

Dieses Schlüsselsystem stellt sicher, dass Ihre Chats privat und sicher bleiben, wobei die gesamte Verschlüsselung direkt auf Ihrem Gerät stattfindet.