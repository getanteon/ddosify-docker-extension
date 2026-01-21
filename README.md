<h1 align="center">
    <img src="https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/ddosify-logo-db.svg#gh-dark-mode-only" alt="Ddosify logo dark" width="336px" /><br />
    <img src="https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/ddosify-logo-wb.svg#gh-light-mode-only" alt="Ddosify logo light" width="336px" /><br />
    Ddosify Docker Extension
</h1>

<p align="center">
    <strong>High-performance load testing tool for Docker Desktop</strong>
</p>

<p align="center">
    <a href="https://github.com/ddosify/ddosify" target="_blank"><img src="https://img.shields.io/github/stars/ddosify/ddosify?&style=for-the-badge&logo=github&label=ddosify&color=orange" alt="ddosify load testing tool" /></a>
    <a href="https://hub.docker.com/extensions/ddosify/ddosify-docker-extension" target="_blank"><img src="https://img.shields.io/docker/pulls/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker&color=orange" alt="ddosify docker extension docker pull" /></a>&nbsp;
    <a href="https://hub.docker.com/r/ddosify/ddosify-docker-extension/tags" target="_blank"><img src="https://img.shields.io/docker/image-size/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker" alt="ddosify docker extension image size" /></a>&nbsp;
    <a href="https://github.com/ddosify/ddosify-docker-extension/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/LICENSE-AGPL--3.0-orange?style=for-the-badge&logo=none" alt="ddosify license" /></a>
    <a href="https://discord.com/invite/9KdnrSUZQg" target="_blank"><img src="https://img.shields.io/discord/898523141788287017?style=for-the-badge&logo=discord&label=DISCORD" alt="ddosify discord server" /></a>
    <a href="https://hub.docker.com/r/ddosify/ddosify-docker-extension" target="_blank"><img src="https://img.shields.io/docker/v/ddosify/ddosify-docker-extension?style=for-the-badge&logo=docker&label=docker&sort=semver" alt="ddosify docker extension docker image" /></a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/getanteon/ddosify-docker-extension/refs/heads/main/assets/01_Ddosify_Intro.jpg" alt="Ddosify Docker Extension Screenshot" />
</p>

## Features

| Feature | Description |
|---------|-------------|
| **Open Source Engine** | Powered by [Ddosify](https://github.com/ddosify/ddosify) - a high-performance load testing tool written in Go |
| **Protocol Support** | HTTP and HTTPS with more protocols coming soon |
| **Load Types** | Linear, incremental, and waved load patterns to test different scenarios |
| **Rich Results** | Visual charts for duration breakdown, status code distribution, and test progress |
| **Debug Mode** | Single request with verbose output for troubleshooting |
| **Dynamic Variables** | Parameterization support with variables like `{{_randomInt}}`, `{{_randomString}}` |
| **CLI Command Export** | Copy the equivalent Docker CLI command to run tests outside the extension |
| **PDF Reports** | Download detailed test reports in PDF format |
| **Lightweight** | Extension size under 10MB |

## Installation

### Docker Extensions Marketplace (Recommended)

1. Open **Docker Desktop** (version 4.10 or higher required)
2. Navigate to the **Extensions** tab
3. Click **Add Extensions**
4. Search for **Ddosify** and click **Install**

> **Note:** If you don't see the Extensions tab, go to Settings > Extensions and enable "Docker Extensions".

### Terminal

```bash
# Install from Docker Hub
docker extension install ddosify/ddosify-docker-extension:latest

# Or build and install locally
docker build --tag=ddosify/ddosify-docker-extension:latest .
docker extension install ddosify/ddosify-docker-extension:latest
```

## Usage

### Basic Load Test

1. Enter your target URL (e.g., `httpbingo.org/get`)
2. Select the protocol (HTTP/HTTPS) and HTTP method
3. Configure load parameters:
   - **Request Count**: Total number of requests
   - **Duration**: Test duration in seconds
   - **Load Type**: Linear, Incremental, or Waved
4. Click **Start** to run the test

### Debug Mode

Click **Debug** to send a single request with verbose output - useful for verifying your configuration before running a full load test.

### CLI Command Export

Click the terminal icon to view and copy the equivalent Docker CLI command:

```bash
docker run -it --rm ddosify/ddosify ddosify -t "https://httpbingo.org/get" -n 100 -d 10 -m GET -l linear -T 5
```

### Advanced Options

- **Headers**: Add custom HTTP headers
- **Request Body**: Send JSON or other data with POST/PUT requests
- **Basic Auth**: Add authentication credentials
- **Proxy**: Route requests through a proxy server
- **Timeout**: Set request timeout in seconds

### Dynamic Variables

Use dynamic variables in your URL, headers, or body:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{_randomInt}}` | Random integer | `12345` |
| `{{_randomString}}` | Random string | `abc123` |
| `{{_uuid}}` | UUID v4 | `550e8400-e29b-41d4-a716-446655440000` |
| `{{_timestamp}}` | Unix timestamp | `1699876543` |

Example: `https://api.example.com/users/{{_randomInt}}`

See [Ddosify documentation](https://github.com/ddosify/ddosify#parameterization-dynamic-variables) for the full list of dynamic variables.

### Tips

- Use `host.docker.internal` instead of `localhost` to test services running on your host machine
- Start with Debug mode to verify your configuration
- Use the PDF report feature to save and share test results

## Development

### Setup

```bash
cd ui
npm install
npm run dev
```

### Debug with Hot Reload

```bash
docker extension dev debug ddosify/ddosify-docker-extension
docker extension dev ui-source ddosify/ddosify-docker-extension http://localhost:3000
```

### Build

```bash
npm run build
docker build --tag=ddosify/ddosify-docker-extension:dev .
docker extension install ddosify/ddosify-docker-extension:dev
```

### Reset Configuration

```bash
docker extension dev reset ddosify/ddosify-docker-extension
```

### Uninstall

```bash
docker extension rm ddosify/ddosify-docker-extension:latest
```

## Publishing to Marketplace

To publish a new version to the [Docker Extensions Marketplace](https://hub.docker.com/extensions/ddosify/ddosify-docker-extension):

### 1. Update Version

Update the `TAG` in the `Makefile`:

```makefile
TAG?=0.3.0
```

### 2. Build and Push Multi-arch Image

```bash
make push-extension
```

This builds and pushes images for both `linux/amd64` and `linux/arm64` platforms.

### 4. Automatic Publishing

Extensions now go through an **automated validation process**. If all checks pass, the extension is published within a few hours. No manual review is required.

### Notes

- The marketplace caches extensions for 12 hours. Restart Docker Desktop to force refresh.
- Only extensions listed in the marketplace can be installed by default (changeable in Docker Desktop settings).
- Extension updates are automatically downloaded and installed for users.

For more details, see the [Docker Extensions Publishing Guide](https://docs.docker.com/extensions/extensions-sdk/extensions/publish/).

## Community

- Join our [Discord Server](https://discord.com/invite/9KdnrSUZQg) for support, feature requests, and discussions
- Star the [Ddosify repository](https://github.com/ddosify/ddosify) on GitHub
- Report issues on [GitHub Issues](https://github.com/ddosify/ddosify-docker-extension/issues)

## More

This extension uses the single-node version of Ddosify. For distributed, no-code, and geo-targeted load testing, check out [Ddosify Cloud](https://ddosify.com).

## Disclaimer

Ddosify is created for testing the performance of web applications. Users must be the owner of the target system. Using it for harmful purposes is strictly prohibited. The Ddosify team & company is not responsible for misuse or its consequences.

## Note

Ddosify has been renamed to [Anteon](https://github.com/getanteon/anteon). The load testing engine remains open source and continues to be maintained.

## License

Licensed under the [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html)
