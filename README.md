
# Electron Examples

## Installation

```
mkvirtualenv -p python3 electron
pip install Invoke
npm install -g electron webpack
```

## Build

To build the helloworld-react example, run:

```
inv build
```

## Run example

cd into an example directory and run:

```
electron main.js
```

If `package.json` is present, then `electron .` will work as well.
