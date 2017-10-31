<img src="https://upload.wikimedia.org/wikipedia/en/a/af/Discourse_logo.png" />

# Discourse Forum Client

A desktop-only client for managing different discourse communities. Quickly change between your favorite communities. Alternatively you can just use this template as a way to favorite important sites.

The code is **rough**. If free time allows, I'll go back and update the code to match React best practices.

Built with React and Electron.

<a href="http://downloads.ngcademy.com/discourse-forum-client-1.0.0-mac.zip">
    <img width="200px" src="https://user-images.githubusercontent.com/13732623/32207141-69d4b7ce-bdd0-11e7-96a1-584e0bd26751.png"></a>

Don't feel comfortable downloading? No problem. Build instructions are below to package the app yourself.

## Screenshots

![Demo](https://i.gyazo.com/c7962bdca831ad31eb3f1e473dd7b967.gif)

![Demo](https://i.gyazo.com/d46e138c41a553df28a50ad2d4850666.gif)

![Demo](https://i.gyazo.com/bfecd1c5c248b7b593d9525f8c4e7a0e.gif)

# Development

## Run

Run these two commands __simultaneously__ in different console tabs.

```bash
$ npm run hot-server
$ npm run start-hot
```

or run two servers with one command

```bash
$ npm run dev
```

## Packaging

To package apps for the local platform:

```bash
$ npm run package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) for dependencies.

Then,
```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

## Further commands

To run the application without packaging run

```bash
$ npm run build
$ npm start
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

## Contributors

[<img alt="Sean perkins" src="https://avatars1.githubusercontent.com/u/13732623?v=3&s=117" width="117">](https://github.com/sean-perkins) |
:---:
|[Sean Perkins](https://github.com/sean-perkins)|


## License
MIT © [Sean Perkins](https://github.com/sean-perkins)
