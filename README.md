# Ddosify Docker Extension

- Build and Install
```bash
docker build --tag=ddosify/ddosify-docker-extension:latest .
docker extension install ddosify/ddosify-docker-extension:latest
```



- Debug with Chrome Console
```bash
docker extension dev debug ddosify/ddosify-docker-extension
docker extension dev ui-source ddosify/ddosify-docker-extension http://localhost:3000

cd ui && npm install && npm start
```

- Reset
```bash
docker extension dev reset ddosify/ddosify-docker-extension
```


Logo: https://ddosify.com/assets/img/ddosify-orange-logo.svg
