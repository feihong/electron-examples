# Command line arguments

## Run

```
electron main.js apple banana coconut
```

## Notes

The value of `process.argv` value inside a renderer process will not contain the command
line arguments sent by the user.

## Sources

- http://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
- http://electron.atom.io/docs/api/remote/
