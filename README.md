# desmond
A bundled and forked version of DeSmuME-wasm (a WebAssembly port of DeSmuME, which is a Nintendo DS emulator) that makes it easily embedabble.

# Installation
```
npm install desmond-emu
```

You can also run this to get Desmond files on Linux, and on Windows with WSL2:
```
curl https://raw.githubusercontent.com/Unzor/desmond/main/installer.sh | sh
```

# Usage
```html
<html>
  <body>
    <desmond-player id="player"></desmond-player>
    <script src="node_modules/desmond-emu/desmond.min.js"></script>
    <script>
     window.onload = function(){
    document.getElementById("player").loadURL("path-to-game.nds");
     }
    </script>
  </body>
</html>
