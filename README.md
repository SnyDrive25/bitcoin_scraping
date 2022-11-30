# Bitcoin Scraping

### 1) Récupération des données

Récupération du prix actuel du bitcoin sur [https://markets.businessinsider.com/currencies/btc-usd](https://markets.businessinsider.com/currencies/btc-usd) avec la commande :

```bash
curl https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)
```

### 2) Crontab sur un serveur distant

Connexion en ssh au serveur distant et création d'un script (scrap.sh) est lancé le 'curl' ainsi que l'envoie des données sur Telegram, le stockage des données étant déjà effectué dans le Node JS.

Contenu de scrap.sh permettant l'envoi de notifications sur messenger :

```bash
#! /bin/bash

var="$(curl -s https://markets.businessinsider.com/currencies/btc-usd | grep -oP '(?<=<span class="price-section__current-value">).*(?=</span>)')"

msg="${var:0:9}"

curl -s --data chat_id="5716818874" --data-urlencode "text=Valeur actuelle du Bitcoin : $ $msg " "https://api.telegram.org/bot5711757703:AAEK9nWX--WUyD2kPjpgiGTjRNps0zVErJ8/sendMessage?parse_mode"
```

J'ai ensuite lancé la commande `crontab -e` afin de créer un service en arrière plan qui exécute le script 'scrap.sh' toutes les 15 minutes en écrivant la ligne suivante :

```bash
*/15 * * * * /root/scrap.sh
```

### 3) Création du projet Node JS

Cela m'a permis d'avoir un affichage sur une page web qui donne en premier lieu la valeur actuelle du Bitcoin ainsi que deux listes des précédentes valeurs :
- une liste représentant les valeurs prises toutes les quinze minutes
- une liste représentant les valeurs prises à chaque chargement du site

![image](https://user-images.githubusercontent.com/74963340/204912934-9824494a-859d-41bf-bf35-bf7d8ea2d992.png)

### 4) Envoie des données sur une API

Dans le script du crontab (le fichier scrap.sh), j'envoie aussi les données à une base de données sur Airtable via leur API grâce à ces commandes :

```bash
curl https://api.airtable.com/v0/appJ36ZyaFH4MXA96/Table%201 -H "Authorization: Bearer keyZAgEqSGNdXIWLd"
curl -X POST https://api.airtable.com/v0/appJ36ZyaFH4MXA96/Table%201 -H "Authorization: Bearer keyZAgEqSGNdXIWLd" -H "Content-Type: application/json" --data '{"fields": {"value": "'"$msg"'","date": "'"$mydate"'", "day": "'"$day"'"},"typecast": true}'
```

Cela me permet d'avoir un graphique représentant l'historique des valeurs du bitcoin par intervalles de 15 minutes sur la periode que je souhaite.

![image](https://user-images.githubusercontent.com/74963340/204913888-9e9f73c7-f283-40bd-a9a1-309009001571.png)