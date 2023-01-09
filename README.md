# Membres du groupes
Pierre ZACHARY
Nicolas LOISON
Eoghann VEAUTE

# Installation
Pour geoserver, rien de plus simple : 
pull le repo contenant geoserver et postgis : https://github.com/Pierre-ZACHARY/geoserver 
taper la commande docker-compose up à la racine du repo 
normalement tout est config et prêt à être utiliser ! ( admin:geoserver )

Pour l’appli react, assurez d’avoir nodejs d’installer : 
pull ce repo : https://github.com/Pierre-ZACHARY/florlesbancs 
npm install puis npm start devraient faire l’affaire

Pour l’appli android : 
vous devez commencer par build : npm run build
puis sync les données avec l’app android : npx cap sync
puis vous pouvez ouvrir l’app dans android studio ( via npx cap open android )  ou juste run l’app ( npx cap run android ) 

L’application n’a pas été testé sur ios, cependant elle devrait fonctionner aussi bien que sur android, pour plus d’informations, voir : https://capacitorjs.com/docs/ios 


# TODO :
✅Vous devez réaliser une application mobile sur les équipements de mobilier urbain d'Orléans.
✅Chaque type d'équipement devra disposer d'une sémiologie différente (pas la même couleur, voire pas le même symbole).
✅Pour les points d'apport volontaire, on utilise une couleur différente s'ils sont ouverts ou fermés (en fonction de l'heure).
✅On doit pouvoir sélectionner le(s) type(s) d'équipement(s) visualisé(s).
✅On doit pouvoir localiser le banc le plus proche. ✅ Dans l'idéal, on indique le trajet.
✅On doit pouvoir suggérer via une API des installations supplémentaires de mobilier (type, coordonnées saisies à partir de la position courante ou d'un clic sur la carte).
✅On doit pouvoir signaler une dégradation (mobilier concerné, date, nature de la dégradation).
✅On doit fournir une version de l'appli à destination du service de la métropole pour localiser les dégradations et les marquer comme réparées. ✅ Dans cette version on peut aussi visualiser les suggestions d'installations (en cliquant sur une suggestion on a accès à sa description textuelle; idem pour les dégradations).
