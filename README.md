# desmond
A bundled and forked version of [DeSmuME-wasm](https://github.com/44670/desmume-wasm) (a WebAssembly port of DeSmuME, which is a Nintendo DS emulator) that makes it easily embedabble.

# NOTE (READ BEFORE MAKING ISSUE)
If you have an issue with the emulator, please go [here](https://github.com/44670/desmume-wasm) instead. I am not the author of the emulator itself. I just made the project embeddable. If you have an issue with the embedding, make an issue here.

# Installation
```
npm install desmond-emu
```

You can also run this to get Desmond files on Linux, and on Windows with WSL2 and [wingubash](https://npmjs.com/package/wingubash):
```
curl https://raw.githubusercontent.com/js-emulators/desmond/main/installer.sh | sh
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
```
# Enable microphone
To use the microphone, you have to use the "enableMicrophone" function.
Here is an example:
```html
<!doctype html>
<html>
<body>
    <desmond-player id="player"></desmond-player>
    <script src="build/desmond.js"></script>
  <script>
      var player = document.getElementById("player");
      player.loadURL("FILE_HERE.nds", function(){
         player.enableMicrophone();
      })
  </script>
</body>
</html>
</body>

</html>
```
