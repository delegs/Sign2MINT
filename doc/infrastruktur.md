# Verwendete Technologien

## Frontend

Das Frontend ist in Angular (11.0.5) und Typescript geschrieben. 
Als Paketmanager wird npm verwendet.

## Backend

Das Backend besteht aus einer Spring Boot (2.4.1) Anwendung, welche in Java 11 geschrieben ist. 
Als Paketmanager wird Maven verwendet.  

## Generell

Um die Anwendung leicht auf einem Server zum Laufen zu bekommen, wird docker verwendet. 
Für Frontend und Backend werden jeweils separate Docker-Images gebaut, damit die beiden Teile unabhängig voneinander aktualisiert werden können.

Hinweis: Die unter [sign2mint.de](http://sign2mint.de) gehostete Webseite verwendet zusätzlich noch [Rendertron](https://github.com/GoogleChrome/rendertron), 
um es Crawlern leichter zu machen die Seite zu parsen, damit die Teilen-Funktion (via Whatsapp und Twitter) funktioniert.
Ohne Rendertron nutzen Crawler veralterte Metatags, wodruch falsche Inhalte in der Vorschau dargestellt werden könnten. 
Eine kurze Anleitung zum Einbinden von Rendertron in einem nginx-Webserver ist unter [Deployment auf einem Server](#deployment-auf-einem-server) vorhanden.

# Abhängigkeiten

## Frontend

Die Anwendung ermöglicht es einzelne Lexikoneinträge via [Facebook](https://developers.facebook.com/docs/sharing/webmasters#markup), [Twitter](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/player-card) und [Whatsapp](https://faq.whatsapp.com/iphone/how-to-link-to-whatsapp-from-a-different-app/?lang=en) zu teilen. 
Dafür werden die entsprechenden APIs dieser Dienste verwendet.

Die Icons kommen von [FontAwesome Pro](https://fontawesome.com/). In [frontend/.npmrc](../frontend/.npmrc) muss der Wert `${NPM_AUTH_TOKEN_FONTAWESOME}` gesetzt werden, damit die entsprechenden Icons geladen und das Projekt gebaut werden kann.

Weitere Abhängigkeiten (wie Swiper, ngMocks, uws.) können der [package.json](../frontend/package.json) entnommen werden.

## Backend

Die Daten bezieht das Backend von der `delegseditor`-API (bereitgestellt vom [Delegs Editor](https://github.com/delegs/Delegs-Editor)), welche das Backend mit allen Daten für die Lexikoneinträge versorgt. 
Die Daten werden dann in einem Cache gespeichert, um das Starten der Anwendung zu beschleunigen und dann in den Arbeitsspeicher geladen.
In den gespeicherten Lexikoneinträgen sind für die Videos nur Links an die `delegseditormedia`-API hinterlegt, welche dann das
entsprechende Video liefert.

Die Lexikoneinträge enthalten unter anderem auch Referenzen auf [Wiktionary-Einträge](https://de.wiktionary.org/), aus welchen mithilfe
der [Wiktionary-API](https://en.wiktionary.org/w/api.php?action=help&modules=parse) die entsprechenden Definitionen
ausgelesen und ebenfalls im Arbeitsspeicher gespeichert werden. 

# Konfiguration

In [application.yaml](../backend/src/main/resources/application.yaml) muss der Pfad für `api_url` gesetzt werden.
```
api_url: <DELEGSEDITOR_PFAD>/formular?deepLink=<URL_ZUM_ORDNER_MIT_LEXIKONEINTRAEGEN>
```

# Lokales Setup

## Frontend

Lokal kann das Frontend auf folgende Weise gestartet werden:

```
cd frontend
npm install
npm run test # Optional, um vorher erst alle Tests laufen zu lassen
npm run start
```

## Backend

Für das Backend sehen die entsprechenden Befehle folgendermaßen aus:

```
cd backend
mvn clean package # Testet das Projekt direkt mit, Tests können über -DskipTests übersprungen werden
java -jar target/sign2MintServer-0.0.1-SNAPSHOT.jar
```

Alternativ können Frontend und Backend auch über geeignete IDEs gestartet werden. 

# Starten der Anwendung über Docker Compose

Um die komplette Anwendung (Frontend und Backend) mittels Docker Compose zu starten, reicht ein `docker-compose up` im Hauptverzeichnis.

# Deployment auf einem Server

1. Docker-Container für Frontend bauen und starten
2. Docker-Container für Backend bauen und starten
3. Docker-Container für Rendertron bauen und starten, siehe [rendertron#deploying-using-docker](https://github.com/GoogleChrome/rendertron#deploying-using-docker)

Beispiel nginx Konfiguration mit Rendertron (ohne HTTPS, um das Beispiel kurzzuhalten):

```
# Frontend
server {
    server_name <url1> <url2> <...>;
    location / {
    if ($http_user_agent ~* "googlebot|yahoo|bingbot|baiduspider|yandex|yeti|yodaobot|gigabot|ia_archiver|facebookexternalhit|twitterbot|whatsapp|developers\.google\.com")
    {
        rewrite .* /render/https://$host$request_uri? break;
        proxy_pass http://localhost:3000;
    }
        proxy_pass http://localhost:81;
    }
    location ^~ /api/ {
        proxy_pass http://localhost:8080/;
    }
}

# Backend
server {
    server_name <url1> <url2> <...>;
    location / {
        proxy_pass http://localhost:8080;
    }
}

```
