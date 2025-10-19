# backend

Welcome to the official repository for the Okidoki2 backend!


## Overview

Here is the Okidoki2 backend server and application. The main functionality and the purpose is saving user data, securing it and exchanging it with frontend server.
## Testing
Servers address is okidoki2.hopto.org or the ip - 193.40.156.59  
All the requests to the backend server are made with the address plus /api  
for example okidoki2.hopto.org/api or 193.40.156.59/api  
### Local Testing - Installation
Using Intellij:
1. Download Intellij
2. Clone the repository with https
3. In Intellij: get with vcs and put the link there
4. In Intellij - Setup JDK, Load Gradle
5. All should now be ready - run OkidokiApplication.java in src/main/java/com/example/okidoki.
Also when testing locally you need to install Docker Desktop for the database  
Create a docker container in Docker Desktop and add it in Intellij  
Upper right corner is a button called database, there on the plus sign Data Source and PostgreSQL  
Host is localhost, port is 5432 and test connection and apply.  
Testing locally the address is http://localhost:8080/



