const e=`# 🎯 Quel est l'objectif principal ?

---

L'objectif principal de **Colir** est de fournir une communication sécurisée via une plateforme de messagerie rapide avec un chiffrement de bout en bout. Voici comment nous y parvenons :

1. **Chiffrement de bout en bout** : Les utilisateurs conviennent d'une clé secrète avant d'utiliser l'application. Cette clé chiffre et déchiffre les données, assurant une communication sécurisée.

2. **Stockage des clés côté client** : Les clés de chiffrement pour les salles sont stockées uniquement sur votre appareil, pas sur nos serveurs, maximisant ainsi la sécurité.

3. **Transfert de données chiffrées** : Notre API ne traite que des données chiffrées, sans accès au contenu réel.

4. **Communication basée sur des salles** : Créez ou rejoignez des salles en utilisant un GUID, mais vous aurez besoin de la bonne clé de chiffrement pour lire les messages.

5. **Expiration des données** : Définissez une date d'expiration pour les salles, après laquelle toutes les données deviennent inaccessibles et sont supprimées.

6. **Authentification sans mot de passe** : Connectez-vous de manière anonyme ou utilisez des fournisseurs tiers comme GitHub et Google.

En se concentrant sur ces fonctionnalités, **Colir** vise à vous offrir une plateforme conviviale pour des discussions privées et chiffrées tout en gardant vos données en sécurité.
`;export{e as default};
