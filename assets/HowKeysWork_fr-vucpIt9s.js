const e=`# 🔑 Comment fonctionnent les clés ?

---

Les clés sont cruciales pour une communication sécurisée et **chiffrée de bout en bout** dans **Colir**. Voici l'essentiel :

1. **Clés de chiffrement** :

   - Vous définissez votre propre clé pour une salle, mais elle doit correspondre à celle des autres membres pour lire leurs messages et envoyer des messages qu'ils peuvent déchiffrer.

2. **Algorithme de chiffrement** :

   - Nous utilisons AES-256, une méthode de chiffrement forte et largement fiable.

3. **Stockage côté client** :

   - Les clés sont stockées uniquement sur votre appareil, jamais sur nos serveurs. Cela signifie que seuls les utilisateurs avec la bonne clé peuvent lire les messages.

4. **Ce qui n'est pas chiffré** :

   - Les noms des salles, les noms d'utilisateur, les horodatages et les réactions ne sont pas chiffrés.

5. **Distribution des clés** :

   - Partagez les clés en toute sécurité en dehors de Colir, comme en personne ou via un autre canal chiffré.

6. **Accès à la salle** :

   - Pour rejoindre une salle, vous avez besoin de deux choses :\\
     **a)** Le GUID de la salle (un identifiant unique)\\
     **b)** La clé de chiffrement pour cette salle
   - Vous pouvez partager le GUID librement, mais gardez la clé secrète !

7. **Processus de déchiffrement** :

   - Lorsque vous entrez dans une salle, vous saisissez la clé. Cela déchiffre les messages entrants et chiffre les messages sortants sur votre appareil.
   - Mauvaise clé ? Les messages ressembleront à du charabia.

8. **Implications de sécurité** :

   - Même si quelqu'un obtient le GUID de la salle, il ne peut pas lire les messages sans la bonne clé.
   - Nos serveurs ne voient que des données chiffrées, gardant vos discussions privées.

9. **Gestion des clés** :
   - Vous êtes responsable de vous souvenir de vos clés. Nous ne pouvons pas les récupérer pour vous car nous ne les stockons pas.

Ce système de clés garantit que vos discussions restent privées et sécurisées, avec toute la magie du chiffrement se produisant directement sur votre appareil.`;export{e as default};
