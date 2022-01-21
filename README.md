# desmond
A bundled and forked version of DeSmuME-wasm (a WebAssembly port of DeSmuME, which is a Nintendo DS emulator) that makes it easily embedabble.

# Usage
```html
<html>
  <body>
    <desmond-player id="player"></desmond-player>
    <script src="desmond.min.js"></script>
    <script>
     window.onload = function(){
    document.getElementById("player").loadURL("path-to-game.nds");
     }
    </script>
  </body>
</html>
