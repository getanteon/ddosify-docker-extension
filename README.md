
<h1 align="center">
    <img src="https://raw.githubusercontent.com/ddosify/ddosify/master/assets/ddosify-logo.svg" alt="Ddosify logo" width="336px" /><br />
    Ddosify Docker Extension - High-performance, simple-to-use load testing tool written in Golang
</h1>

<p align="center">
    <a href="https://hub.docker.com/extensions/ddosify/ddosify-docker-extension" target="_blank"><img src="https://img.shields.io/docker/pulls/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker&color=orange" alt="ddosify docker extension docker pull" /></a>&nbsp;
    <a href="https://hub.docker.com/r/ddosify/ddosify-docker-extension/tags" target="_blank"><img src="https://img.shields.io/docker/image-size/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker" alt="ddosify docker extension image size" /></a>&nbsp;
    <a href="https://github.com/ddosify/ddosify-docker-extension/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/LICENSE-AGPL--3.0-orange?style=for-the-badge&logo=none" alt="ddosify license" /></a>
    <a href="https://discord.gg/9KdnrSUZQg" target="_blank"><img src="https://img.shields.io/discord/898523141788287017?style=for-the-badge&logo=discord&label=DISCORD" alt="ddosify discord server" /></a>
    <a href="https://hub.docker.com/r/ddosify/ddosify-docker-extension" target="_blank"><img src="https://img.shields.io/docker/v/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker&label=docker&sort=semver" alt="ddosify docker extension docker image" /></a>
</p>

<p align="center">
<img src="https://j.gifs.com/nRjOJY.gif" alt="Ddosify - High-performance load testing tool quick start" />
</p>


## Features
📌 **Protocol Agnostic** - Currently supporting *HTTP, HTTPS*. Other protocols are on the way.

📌 **Different Load Types** - Test your system's limits across different load types.

📌 **Parameterization** - Use dynamic variables just like on Postman.

📌 **Minimal Disk Size** - Ddosify Docker Extension is under 10MB.

## Installation

Ddosify Docker Extension can be install using [Docker Extensions Marketplace](#docker-extensions-marketplace-recommended) and [Terminal](#terminal). For automatic upgrades, the marketplace is recommended. 

### Docker Extensions Marketplace (Recommended)

Ddosify Docker Extension is available via [Docker Extensions Marketplace](https://hub.docker.com/search?q=&type=extension) using Docker Desktop. This requires Docker Desktop `4.10` or higher.

- Open Docker Desktop (4.10+ version required)
- Click `Add Extensions` from the Extensions tab
- Find Ddosify from the extensions marketplace and click `Install`
- Ddosify Docker Extension is installed and can be accessible from the Extensions tab

**Note:** If you do not see the Extensions tab on Docker Desktop, please check your version on the right bottom (4.10+ version required), click the Settings button, and click Extensions. `Enable Docker Extensions` checkbox must be enabled.

### Terminal

You can also install the Ddosify Docker extension using a terminal without Docker Extensions Marketplace. 

Build the Ddosify Docker Extension image and install: 

```bash
docker build --tag=ddosify/ddosify-docker-extension:latest .
docker extension install ddosify/ddosify-docker-extension:latest
```

Remove the Ddosify Docker Extension:

```bash
docker extension rm ddosify/ddosify-docker-extension:latest
```

## Parameterization (Dynamic Variables)

You can use Parameterization feature on Ddosify Docker Extension. See [Ddosify](https://github.com/ddosify/ddosify#parameterization-dynamic-variables). 

## Communication

You can join our [Discord Server](https://discord.gg/9KdnrSUZQg) for issues, feature requests, feedbacks or anything else. 

## More

Ddosify Docker extension uses the single-node version of the Ddosify. For distributed, no-code, and geo-targeted load testing you can use [Ddosify Cloud](https://ddosify.com)

## Disclaimer

Ddosify is created for testing the performance of web applications. Users must be the owner of the target system. Using it for harmful purposes is extremely forbidden. Ddosify team & company is not responsible for its’ usages and consequences.
## License

Licensed under the AGPLv3: https://www.gnu.org/licenses/agpl-3.0.html
