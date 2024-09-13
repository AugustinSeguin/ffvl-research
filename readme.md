# FFVL - POC refonte page recherche

Voici un POC de la fonctionnalité recherche sur tous les sites de la FFVL.

## L'outil est dockerisé.

- Lancer la commande pour créer les containers :
`docker-compose up -d`

### Container npm

Environnement NodeJs 

### Container mongodb

Environnement MongoDb. 
BDD noSQL car traitement de beaucoup de données avec une seule table (= collection).

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
