FROM ddosify/ddosify:v1.0.6 AS builder

FROM --platform=$BUILDPLATFORM node:24-alpine AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine

ARG EXTENSION_NAME='Ddosify'
ARG DESCRIPTION='High-performance, open-source and simple load testing tool, written in Golang.'
ARG DESCRIPTION_LONG="<h1>Ddosify - High-performance load testing tool</h1><h2>⚡️ Features</h2><ul><li>Open-source: <a href='https://github.com/getanteon/anteon/tree/master/ddosify_engine'>https://github.com/getanteon/anteon</a></li><li>Protocol Agnostic - Currently supporting HTTP, HTTPS. Other protocols are on the way</li><li>Different Load Types - Test your system's limits across different load types<ul><li>Linear</li><li>Incremental</li><li>Waved</li></ul></li><li>Dynamic Variables (Parameterization) Support: Just like the Postman, Ddosify supports dynamic variables. <a href='https://getanteon.com/docs/performance-testing/dynamic-variables-parametrization'>Learn More.</a></li><li>Save load testing result as PDF</li></ul>"
ARG VENDOR='Ddosify Inc.'
ARG LICENSE='AGPL-3.0'

ARG ICON_URL='https://d2uj9largygsoq.cloudfront.net/docker/ddosify-square-icon-db.svg'
ARG SCREENSHOTS_URLS='[ { "alt": "Ddosify Intro", "url": "https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/01_Ddosify_Intro.jpg" }, { "alt": "Ddosify Load Test Report", "url": "https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/02_Ddosify_Report.jpg" }, { "alt": "Ddosify Advanced View", "url": "https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/03_Ddosify_Advanced.jpg" } ]'
ARG PUBLISHER_URL='https://getanteon.com/'
ARG ADDITIONAL_URLS='[ { "title": "GitHub", "url": "https://github.com/getanteon/anteon/tree/master/ddosify_engine" }, { "title": "Support", "url": "https://github.com/getanteon/anteon/discussions" }, { "title": "Discord", "url": "https://discord.com/invite/9KdnrSUZQg" }, { "title": "Documentation", "url": "https://getanteon.com/docs/performance-testing/" } ]'
ARG CHANGELOG='<p>Extension changelog:</p> <ul> <li>Change Ddosify version to v0.15.3</li> <li>Update icon</li> </ul>'
ARG DD_VERSION='>=0.2.3'

LABEL org.opencontainers.image.title="${EXTENSION_NAME}" \
    org.opencontainers.image.description="${DESCRIPTION}"\
    org.opencontainers.image.vendor="${VENDOR}" \
    org.opencontainers.image.licenses="${LICENSE}" \
    com.docker.desktop.extension.icon="${ICON_URL}" \
    com.docker.desktop.extension.api.version="${DD_VERSION}" \
    com.docker.extension.screenshots="${SCREENSHOTS_URLS}" \
    com.docker.extension.detailed-description="${DESCRIPTION_LONG}" \
    com.docker.extension.publisher-url="${PUBLISHER_URL}" \
    com.docker.extension.additional-urls="${ADDITIONAL_URLS}" \
    com.docker.extension.changelog="${CHANGELOG}"


COPY --from=builder /bin/ddosify /
COPY docker-compose.yaml .
COPY metadata.json .
COPY ddosify.svg .
COPY --from=client-builder /ui/build ui
CMD [ "sleep", "infinity" ]
