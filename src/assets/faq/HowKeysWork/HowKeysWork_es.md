# 🔑 ¿Cómo funcionan las claves?

---

Las claves son cruciales para la comunicación segura y **cifrada de extremo a extremo** en **Colir**. Aquí está la información esencial:

1. **Claves de cifrado**:

   - Estableces tu propia clave para una sala, pero debe coincidir con la de otros miembros para leer sus mensajes y enviar mensajes que puedan descifrar.

2. **Algoritmo de cifrado**:

   - Utilizamos AES-256, un método de cifrado fuerte y ampliamente confiable.

3. **Almacenamiento del lado del cliente**:

   - Las claves se almacenan solo en tu dispositivo, nunca en nuestros servidores. Esto significa que solo los usuarios con la clave correcta pueden leer los mensajes.

4. **Lo que no está cifrado**:

   - Los nombres de las salas, nombres de usuario, marcas de tiempo y reacciones no están cifrados.

5. **Distribución de claves**:

   - Comparte las claves de forma segura fuera de Colir, como en persona o a través de otro canal cifrado.

6. **Acceso a la sala**:

   - Para unirte a una sala, necesitas dos cosas:\
     **a)** El GUID de la sala (un identificador único)\
     **b)** La clave de cifrado para esa sala
   - ¡Puedes compartir el GUID libremente, pero mantén la clave en secreto!

7. **Proceso de descifrado**:

   - Cuando entras en una sala, ingresas la clave. Esto descifra los mensajes entrantes y cifra los salientes en tu dispositivo.
   - ¿Clave incorrecta? Los mensajes parecerán galimatías.

8. **Implicaciones de seguridad**:

   - Incluso si alguien obtiene el GUID de la sala, no podrá leer los mensajes sin la clave correcta.
   - Nuestros servidores solo ven datos cifrados, manteniendo tus chats privados.

9. **Gestión de claves**:
   - Eres responsable de recordar tus claves. No podemos recuperarlas por ti ya que no las almacenamos.

Este sistema de claves asegura que tus chats permanezcan privados y seguros, con toda la magia del cifrado ocurriendo directamente en tu dispositivo.