---
layout: tutorial
title: HTTP, HTML, CSS
---

## L'IDE Cloud9

Dans ce cours nous allons utiliser un environnement de développement
(IDE) *dans le cloud*. Même si ce TD pourrait être développé
entièrement en local (il suffit d'un browser et d'un éditeur de
texte), nous allons en profiter pour nous familiariser d'avance avec
Cloud9, notre IDE.

Dirigez votre browser sur <http://c9.io/>, créez un compte si ce n'est
pas déjà fait, et connectez-vous à votre espace personnel. Si vous
possédez déjà un compte [Github](http://github.com/) ou
[Bitbucket](http://bitbucket.org), il est possible de l'utiliser pour
une identification sur C9 sans besoin de créer de nouveau compte ;
ceci a l'avantage ajouté de vous permettre d'importer vos projets
Github et Bitbucket en un seul click.

Votre compte contient un projet nommé `demo-project`, ouvrez-le avec
un click. Après un peu de temps de chargement, vous êtes dans un IDE
comme Eclipse ou Netbeans : navigation des fichiers à gauche, éditeur
de fichiers au milieu, et (mieux que Eclipse ou Netbeans !) terminal
Linux en bas.

1. Commencez par créer un nouveau fichier HTML dans la racine du
   projet.

2. En partant de ce squelette
   
   ~~~
   <!DOCTYPE html>
   <html>
     <head>
       <title>TD 1</title>
     </head>
     <body>
       <!-- Votre contenu ici -->
     </body>
   </html>
   ~~~
   
   éditez le fichier pour en faire un semblant de votre CV. Utilisez
   notamment :
   
   - des entêtes (`<h1>`, `<h2>`, etc.),
   - des paragraphes (`<p>`),
   - des listes (`<ul>`, `<ol>`, `<dl>`),
   - des liens (`<a>`),
   - des images (`<img>`),
   - des tableaux (`<table>`, `<tr>`, `<td>`, etc.).
   
   Vous pouvez utiliser la
   [référence de w3schools](http://www.w3schools.com/tags/default.asp)
   pour savoir comment utiliser les balises.

3. Visualisez le résultat dans le browser.
   
   Puisqu'il s'agit d'un projet public (les utilisateurs non payants
   n'ont pas d'espace privé), tout le contenu est disponible
   *statiquement* à l'URL
   
   > <https://c9.io/[nom-d'utilisateur]/demo-project/workspace>
   
   (remplacez votre nom d'utilisateur dans l'URL), et les pages HTML
   sont servies comme telles. Il vous suffit de naviguer vers la page
   que vous venez de créer pour voir le résultat.
   
   Vous pouvez obtenir le même résultat, directement dans l'IDE, avec
   le bouton *Preview* (l'URL ouvert correspond au fichier couramment
   ouvert dans l'éditeur).

