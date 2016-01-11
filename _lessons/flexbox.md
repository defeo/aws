---
layout: lesson
title: Flexbox
---

<section>

## *Layout* (Mise en page)

### Problématique

- Distribuer le contenu dans la page.
- S'adapter à des modes d'affichage différents (écran, mobile,
  impression, ...).
- Permettre un certain degré de *non-linéarité*.

### Modèles de *layout* (voir les approfondissements)

- [*Box model*](boxmodel) (le plus ancien),

- [*Positionnement absolu*](boxmodel) (le petit frère du *box model*),

- [*Flexbox*](flexbox) (le nouvel arrivant),

- *Grille* (encore dans les cartons...)

</section>
<section>

## Flexbox

### Limitations du [*box model*](box model)

- Centrer verticalement.
- Layout en colonnes (traditionnellement simulé avec `float`,
  `display`, `position`, dimensions fixes, etc., voire même avec
  `<table>`).
- Adaptation à la taille de l'écran.
- *Non-linéarité*.

### Flexbox

- Un modèle de boîtes *agnostique par rapport à la direction*.
- Basé sur un *conteneur* et ses *éléments*.
- Algorithmes de calcul de taille et espacement.
- *Non-linéaire*

</section>
<section>

## Les propriétés CSS de flexbox

#### Propriétés principales du *conteneur*

- `display: flex` déclare un *conteneur* flexible.
- `flex-flow: row nowrap` déclare la *direction* et le mode de retour
  à la ligne.

#### Propriétés principales des *éléments*

- `flex: 0 1 auto` déclare l'*élasticité* d'un *élément*.
- `order: 1` permet de réaliser un affichage *non-linéaire*.

#### Autres propriétés

- Conteneur : `flex-direction`, `flex-wrap`, `justify-content`,
  `align-items`, `align-content`.

- Éléments : `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`.

</section>
<section>

{% include codepen.md pen='LEzZQo' tab='css' alt='Démonstration de Flexbox' %}

</section>
