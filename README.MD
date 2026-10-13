# Slowed & Reverbed Song Generator

[<img src="public/favicon.png" alt="Slowed & Reverbed Song Generator" width="72">](https://sr.mirket.dev/)

This library generates slowed and reverbed versions of songs using tonejs library. All the operations are done in the browser, so no server is required.

## Live Demo

You can try out the live demo: [https://sr.mirket.dev/](https://sr.mirket.dev)

## Podman deployment

Podman with `podman-compose` is the supported local container workflow:

```sh
podman-compose up --build -d
podman-compose ps
curl --fail http://127.0.0.1:9333/
podman-compose down
```

Set `SLOWED_REVERBED_PORT` to use another loopback port.

## Author

- Instagram [@codemirket](https://instagram.com/codemirket)
