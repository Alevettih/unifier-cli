# Afflux CLI

`afflux-cli` is a front-end tool, that created for unifying all configs, structure, and share base codebase within different [Requestum](https://requestum.com/) projects.
 
 With this tool you can create **four** types of project:
 - Angular
 - React
 - Vue
 - Plain JS

## Getting Started

### Built with

Node JS, Typescript

### Prerequisites

For use this package you need to pre-install the [NodeJS](https://nodejs.org/uk/) and [npm](https://www.npmjs.com/) to your computer.

### Installing

You can use it with `npm`:
```bash
npm i -g https://github.com/Alevettih/afflux-cli.git --recursive
```

Or with `npx`:
```bash
npx https://github.com/Alevettih/afflux-cli.git
```

### Using

For creating a new project:

```bash
afflux
```

Then the command line prompt should ask some questions about your project, and generate it in the current directory after you answer on questions.

You also can use command line arguments, like:

```
afflux <project name>
```

Also you can use additional arguments:
- `--type` - tells to CLI that it should create project with that type. Get `angular`, `react`, `vue` or `plain-js` value.



## Development

For development purposes you must clone this repo and run `npm i` or `npm install` command.

### Dev mode
Rebuild code on every `.ts` file change

```bash
npm run dev
```

### Build
Compile `.ts` files into `.js` and copy all git submodules

```bash
npm run build
```

### Tests

Explain how to run the automated tests for this system

#### Unit tests
For running tests

```bash
npm run test
```

For checking tests coverage

```bash
npm run coverage
```

### Linter
Lint your `.ts` files

```bash
npm run lint
```

## Team

* **Alex Tykhonenko** - *Master*
* **Kate Shcherbak** - *PM*
