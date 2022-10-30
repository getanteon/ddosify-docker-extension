FROM ddosify/ddosify:v0.8.2 AS builder

FROM --platform=$BUILDPLATFORM node:17.7-alpine3.14 AS client-builder
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

FROM alpine:3.16.2

ARG EXTENSION_NAME='Ddosify'
ARG DESCRIPTION='High-performance, open-source and simple load testing tool, written in Golang.'
ARG DESCRIPTION_LONG="<h1>Ddosify - High-performance load testing tool</h1><h2>⚡️ Features</h2><ul><li>Open-source: <a href='https://github.com/ddosify/ddosify'>https://github.com/ddosify/ddosify</a></li><li>Protocol Agnostic - Currently supporting HTTP, HTTPS. Other protocols are on the way</li><li>Different Load Types - Test your system's limits across different load types<ul><li>Linear</li><li>Incremental</li><li>Waved</li></ul></li><li>Dynamic Variables (Parameterization) Support: Just like the Postman, Ddosify supports dynamic variables. <a href='https://docs.ddosify.com/extra/dynamic-variables-parameterization'>Learn More.</a></li></ul><br>For no-code, distributed and geo-targeted load testing you can use Ddosify Cloud - <a href='https://ddosify.com'>https://ddosify.com</a> 🚀"
ARG VENDOR='Ddosify Inc.'
ARG LICENSE='AGPL-3.0'
ARG ICON_URL='https://d2uj9largygsoq.cloudfront.net/ddosify-icon.svg'
ARG SCREENSHOTS_URLS='[ { "alt": "Ddosify Intro", "url": "https://d2uj9largygsoq.cloudfront.net/01_ddosify_intro.png" }, { "alt": "Ddosify Load Test View", "url": "https://d2uj9largygsoq.cloudfront.net/02_ddosify_load_test.png" }, { "alt": "Ddosify Advanced View", "url": "https://d2uj9largygsoq.cloudfront.net/03_ddosify_advanced.png" } ]'
ARG PUBLISHER_URL='https://ddosify.com/'
ARG ADDITIONAL_URLS='[ { "title": "Ddosify Cloud", "url": "https://ddosify.com" }, { "title": "GitHub", "url": "https://github.com/ddosify/ddosify" }, { "title": "Support", "url": "https://github.com/ddosify/ddosify/discussions" }, { "title": "Discord", "url": "https://discord.gg/9KdnrSUZQg" }, { "title": "Documentation", "url": "https://docs.ddosify.com/" }, { "title": "Terms of Service", "url": "https://ddosify.com/terms" }, { "title": "Privacy policy", "url": "https://ddosify.com/privacy" }]'
ARG CHANGELOG='<p>Extension changelog:</p> <ul> <li>Change Ddosify version to v0.8.2</li> </ul>'
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
COPY ddosify-icon.svg .
COPY --from=client-builder /ui/build ui
CMD [ "sleep", "infinity" ]
