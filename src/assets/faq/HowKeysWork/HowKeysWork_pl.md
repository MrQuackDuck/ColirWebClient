# 🔑 Jak działają klucze?

---

Klucze są kluczowe dla bezpiecznej, **szyfrowanej end-to-end komunikacji** w **Colir**. Oto najważniejsze informacje:

1. **Klucze szyfrowania**:

   - Ustawiasz własny klucz dla pokoju, ale musi on pasować do kluczy innych członków, aby odczytać ich wiadomości i wysyłać wiadomości, które oni mogą odszyfrować.

2. **Algorytm szyfrowania**:

   - Używamy AES-256, silnej i szeroko zaufanej metody szyfrowania.

3. **Przechowywanie po stronie klienta**:

   - Klucze są przechowywane tylko na Twoim urządzeniu, nigdy na naszych serwerach. Oznacza to, że tylko użytkownicy z właściwym kluczem mogą odczytać wiadomości.

4. **Co nie jest szyfrowane**:

   - Nazwy pokoi, nazwy użytkowników, znaczniki czasu i reakcje nie są szyfrowane.

5. **Dystrybucja kluczy**:

   - Udostępniaj klucze bezpiecznie poza Colir, na przykład osobiście lub przez inny zaszyfrowany kanał.

6. **Dostęp do pokoju**:

   - Aby dołączyć do pokoju, potrzebujesz dwóch rzeczy:\
     **a)** GUID pokoju (unikalny identyfikator)\
     **b)** Klucz szyfrowania dla tego pokoju
   - Możesz swobodnie udostępniać GUID, ale zachowaj klucz w tajemnicy!

7. **Proces deszyfrowania**:

   - Gdy wchodzisz do pokoju, wprowadzasz klucz. To deszyfruje przychodzące wiadomości i szyfruje wychodzące na Twoim urządzeniu.
   - Zły klucz? Wiadomości będą wyglądać jak bełkot.

8. **Implikacje bezpieczeństwa**:

   - Nawet jeśli ktoś zdobędzie GUID pokoju, nie może odczytać wiadomości bez właściwego klucza.
   - Nasze serwery widzą tylko zaszyfrowane dane, zachowując prywatność Twoich czatów.

9. **Zarządzanie kluczami**:
   - Jesteś odpowiedzialny za zapamiętanie swoich kluczy. Nie możemy ich dla Ciebie odzyskać, ponieważ ich nie przechowujemy.

Ten system kluczy zapewnia, że Twoje czaty pozostają prywatne i bezpieczne, a cała magia szyfrowania dzieje się bezpośrednio na Twoim urządzeniu.