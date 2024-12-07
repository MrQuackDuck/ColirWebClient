# 🎯 ¿Cuál es el objetivo principal?

---

El objetivo principal de **Colir** es proporcionar comunicación segura a través de una plataforma de mensajería rápida con cifrado de extremo a extremo. Así es como lo logramos:

1. **Cifrado de extremo a extremo**: Los usuarios acuerdan una clave secreta antes de usar la aplicación. Esta clave cifra y descifra los datos, asegurando una comunicación segura.

2. **Almacenamiento de claves del lado del cliente**: Las claves de cifrado para las salas se almacenan solo en su dispositivo, no en nuestros servidores, maximizando la seguridad.

3. **Transferencia de datos cifrados**: Nuestra API solo maneja datos cifrados, sin acceso al contenido real.

4. **Comunicación basada en salas**: Cree o únase a salas usando un GUID, pero necesitará la clave de cifrado correcta para leer los mensajes.

5. **Caducidad de datos**: Establezca una fecha de caducidad para las salas, después de la cual todos los datos se vuelven inaccesibles y se eliminan.

6. **Autenticación sin contraseña**: Inicie sesión de forma anónima o use proveedores de terceros como GitHub y Google.

Al centrarse en estas características, **Colir** tiene como objetivo brindarle una plataforma fácil de usar para chats privados y cifrados mientras mantiene sus datos seguros.
