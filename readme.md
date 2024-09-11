# FFVL - POC refonte page recherche

Voici un POC de la fonctionnalité recherche sur tous les sites de la FFVL.

## L'outil est dockerisé.

Lancer la commande pour créer les containers :
`docker-compose up -d`

## Arborescence

> le dossier puppeteer/ fait un scrapping des sites de la FFVL et renvoit sous format JSON :
- titres
- url
- html
- keywords 
- les 3 mots les plus présent sur la page web
- Si l'url correspond à un document
- Le nom du document si s'en ai un

> le dossier app/ créé une BDD MongoDB avec une collection reprenant les données renvoyés par puppeteer

## TODO
A compléter en fonction de l'évolution du projet avant le rendu du livrable.

