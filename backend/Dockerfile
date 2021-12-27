FROM adoptopenjdk/openjdk11:jre-11.0.9.1_1-alpine
EXPOSE 8080
COPY AirtableCache.json /AirtableCache.json
COPY target/sign2MintServer*.jar /s2mServer.jar
ENTRYPOINT ["java","-jar","-Xms512M","-Xmx1G","/s2mServer.jar"]
