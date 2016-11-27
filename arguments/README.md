# Command line arguments and remote module

## Run

```
electron main.js apple banana coconut
```

## Notes

The value of `process.argv` value inside a renderer process will not contain the command
line arguments sent by the user. To access the actual command line arguments, you need
to use `remote.process.argv`.

In order to use jQuery and other scripts, you'll need this snippet in your HTML file:

```html
<script>
// Allows jQuery and other scripts to work.
if (typeof module === 'object') {
  window.module = module
  module = undefined
}
</script>
```

## Sources

- http://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined
- http://electron.atom.io/docs/api/remote/
