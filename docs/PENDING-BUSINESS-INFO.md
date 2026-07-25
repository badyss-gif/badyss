# Informations à confirmer avant la mise en production

Ce document liste **tout ce que BADYSS doit encore confirmer** avant le lancement réel du site.
Rien de ce qui suit n'a été inventé dans le code ou le contenu du site — chaque point ci-dessous
est soit laissé vide (fonctionnalité désactivée jusqu'à configuration), soit marqué visuellement
« À confirmer » directement sur la page concernée.

Mettre à jour ce fichier au fur et à mesure que chaque point est confirmé.

## 1. Identité légale de l'entreprise

Utilisé sur : Mentions légales, Politique de confidentialité, CGV.

- [ ] Raison sociale et forme juridique (SARL, auto-entrepreneur, etc.)
- [ ] Numéro RC (Registre de Commerce)
- [ ] ICE (Identifiant Commun de l'Entreprise)
- [ ] Adresse du siège social
- [ ] Nom du directeur de la publication
- [ ] Hébergeur du site (nom, adresse, contact) — actuellement Vercel/Next.js par défaut de déploiement, à confirmer officiellement
- [ ] Adresse e-mail de contact officielle (aucune trouvée sur le site actuel)
- [ ] Coordonnées de l'autorité de contrôle compétente en matière de protection des données (CNDP au Maroc, le cas échéant)

## 2. Communication client

- [ ] **Numéro WhatsApp Business réel** — `NEXT_PUBLIC_WHATSAPP_NUMBER` dans `.env.local`.
      Le bouton flottant WhatsApp et tous les liens WhatsApp du site sont entièrement développés
      et testés ; ils restent simplement invisibles tant que cette variable n'est pas renseignée.
- [ ] Horaires de disponibilité du service client (page Contact)
- [ ] Adresse physique / existence d'un point de vente (page Contact — actuellement présenté comme
      boutique 100% en ligne)

## 3. Commande, paiement et livraison

- [ ] Liste définitive des moyens de paiement acceptés (CGV, page Commande)
- [ ] Zones de livraison couvertes
- [ ] Délais de livraison moyens par zone
- [ ] Grille tarifaire de livraison
- [ ] **Seuil de livraison gratuite** (le cas échéant) — `siteConfig.shipping.freeShippingThreshold`
      dans `src/config/site.ts`. La barre de progression de livraison gratuite dans le panier est
      entièrement développée et s'active automatiquement dès qu'un montant réel est renseigné ici.
- [ ] Délai de rétractation / retour exact
- [ ] Conditions et frais de retour ou d'échange

## 4. Produits

- [ ] Mensurations réelles par taille (tableau de correspondance détaillé — Guide des tailles)
- [ ] Photographies produit réelles (le catalogue actuel utilise des produits d'exemple sans image,
      voir §5 du présent dossier de documentation ou `src/lib/mock-data/products.ts`)

## 5. Avis clients

- [ ] Aucun avis client réel n'existe à ce jour. La section « Ce que nos clients disent de BADYSS »
      utilise 5 témoignages explicitement labellisés « Avis client — exemple », rédigés comme
      exemples de mise en forme, pas comme de vrais retours clients. À remplacer par de vrais avis
      vérifiés dès qu'ils existent.

## 6. Intégration WooCommerce

- [ ] `WORDPRESS_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET` dans `.env.local`
      (voir `.env.example`). Le site fonctionne aujourd'hui sur un catalogue fictif clairement
      labellisé ; il basculera automatiquement sur les vraies données dès que ces identifiants
      seront renseignés (aucun changement de code nécessaire côté pages).

---

*Dernière mise à jour de ce document : à faire correspondre à la date du dernier commit le
modifiant — ce fichier n'a pas de date auto-générée, contrairement aux pages légales du site.*
