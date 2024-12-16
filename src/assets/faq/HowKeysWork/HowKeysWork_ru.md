# 🔑 Как работают ключи?

---

Ключи имеют решающее значение для безопасной, **сквозной зашифрованной связи** в **Colir**. Вот основная информация:

1. **Ключи шифрования**:

   - Вы устанавливаете свой собственный ключ для комнаты, но он должен совпадать с ключами других участников, чтобы читать их сообщения и отправлять сообщения, которые они могут расшифровать.

2. **Алгоритм шифрования**:

   - Мы используем AES-256, сильный и широко доверяемый метод шифрования.

3. **Хранение на стороне клиента**:

   - Ключи хранятся только на вашем устройстве, никогда на наших серверах. Это означает, что только пользователи с правильным ключом могут читать сообщения.

4. **Что не зашифровано**:

   - Названия комнат, имена пользователей, временные метки и реакции не зашифрованы.

5. **Распространение ключей**:

   - Делитесь ключами безопасно вне Colir, например, лично или через другой зашифрованный канал.

6. **Доступ к комнате**:

   - Чтобы присоединиться к комнате, вам нужны две вещи:\
     **a)** GUID комнаты (уникальный идентификатор)\
     **b)** Ключ шифрования для этой комнаты
   - Вы можете свободно делиться GUID, но держите ключ в секрете!

7. **Процесс расшифровки**:

   - Когда вы входите в комнату, вы вводите ключ. Это расшифровывает входящие сообщения и зашифровывает исходящие на вашем устройстве.
   - Неправильный ключ? Сообщения будут выглядеть как тарабарщина.

8. **Последствия для безопасности**:

   - Даже если кто-то получит GUID комнаты, он не сможет прочитать сообщения без правильного ключа.
   - Наши серверы видят только зашифрованные данные, сохраняя ваши чаты приватными.

9. **Управление ключами**:
   - Вы несете ответственность за запоминание своих ключей. Мы не можем восстановить их для вас, так как мы их не храним.

Эта система ключей обеспечивает приватность и безопасность ваших чатов, причем вся магия шифрования происходит прямо на вашем устройстве.