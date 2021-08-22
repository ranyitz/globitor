<h1 align="center">🌐 Globitor</h1>
<p align="center">Interactive glob pattern tester</p>
<p align="center">
  <img src="https://user-images.githubusercontent.com/11733036/111021463-1778d680-83d5-11eb-8f75-5e16419f1277.gif" alt="globitor-example"/>
</p>
<p align="center">
  <a href="https://github.com/ranyitz/globitor/actions/workflows/node.js.yml">
   <img src="https://img.shields.io/github/workflow/status/ranyitz/globitor/Node.js%20CI?style=for-the-badge" alt="Build Status" />
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/globitor">
    <img alt="NPM version" src="https://img.shields.io/npm/v/globitor.svg?style=for-the-badge">
  </a>
  <a aria-label="License" href="https://github.com/ranyitz/globitor/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/npm/l/globitor.svg?style=for-the-badge">
  </a>
</p>

## Why
Testing glob patterns on an actual file-system with interactive UI & fast feedback loop is fun

## Installation
```
npx globitor
```

## CLI
```   
    Usage
      > globitor [pattern]

    Interactive Mode
      > globitor

    Options
      --version, -v       Version number
      --help, -h          Displays this message

      --gitignore         Include files ignored by patterns in '.gitignore'
```

## Development

* See the [Contributing Guide](CONTRIBUTING.md)
* Using [Ink](https://github.com/vadimdemedes/ink) for rendering the interactive UI

## Related Projects
* [Relabel](https://github.com/ranyitz/relabel) - Interactive bulk renaming tool

