# PIPA - site pret a mettre en ligne

Ce dossier contient le site PIPA complet.

## Pour ajouter un produit

Ouvre `products.js` et ajoute un bloc comme celui-ci dans la liste :

```js
{
  id: "nom-simple-sans-espace",
  name: "Nom du produit",
  category: "sandales",
  mood: "Italian summer",
  price: 39.99,
  image: "assets/mon-image.png",
  colors: ["#f873a8", "#ffd84f", "#315f8a"],
  description: "Description courte et desirable du produit.",
  status: "available",
}
```

Categories possibles :

- `sandales`
- `birks`
- `cowgirl`
- `ballerines`

Statuts possibles :

- `available`
- `coming-soon`

## Pour ajouter une image

1. Mets l'image dans le dossier `assets`.
2. Dans `products.js`, indique le chemin : `assets/nom-image.png`.

## Pour mettre le site en ligne

Option simple :

1. Va sur Netlify ou Vercel.
2. Cree un nouveau site.
3. Depose tout le dossier `pipa-landing`.
4. Le fichier d'accueil est `index.html`.

## Pour vendre vraiment

Le panier est pret visuellement pour une demo. Pour encaisser des paiements, il faudra connecter :

- Shopify si tu veux une vraie boutique facile a gerer.
- Stripe Payment Links si tu veux rester tres simple au depart.
- WooCommerce si tu pars sur WordPress.

Pour un lancement rapide, le plus simple est Shopify ou Stripe Payment Links.
