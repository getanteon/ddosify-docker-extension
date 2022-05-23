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


## Submission

-> Problems Solved: What pain points does your extension solve for developers?

Ddosify is a high-performance, open-source and simple load testing tool written in Golang. The mission of the Ddosify project is to create generic, no code and the most powerful load testing experience for developers, quality assurance engineers, and even non-technical people. Load tests should be done regularly to avoid being caught unprepared for high traffic. With Ddosify, developers find out the maximum service capacity of their web/api system.

-> System Requirements

Since Ddosify is written in Golang, it is very lightweight. On any computer that can run Docker, the Ddosify extension will also run.

Docker Desktop > 4.8.0
RAM: 2GB or higher


-> Issues Reporting: How can users report an issue with your extension?

https://github.com/ddosify/ddosify/issues

