Per l'esecuzione in locale all'interno di un ambiente Docker bisogna seguire questi passi.

1. Clonare i progetti all'interno della stessa cartella così da ottenere una struttura come questa:
    ```
    cartella-progetti/
    ├── progetto-transazioni-backend/
    ├── progetto-transazioni-frontend/
        └── docker-compose.yml
    ```
2. Aprire un terminale dentro la cartella `progetto-transazioni-frontend` ed eseguire il comando `docker compose up -d`.
3. Aprire il browser ai seguenti indirizzi:
    * Frontend: [http://localhost:5173](http://localhost:5173)
    * Backend: [http://localhost:8080](http://localhost:8080)
