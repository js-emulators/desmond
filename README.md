# desmond
Embed a Nintendo DS emulator easily. (Embeddable version of DeSmuME-wasm)

# Installation
```
npm install desmond-emu
```

You can also run this to get Desmond files on Linux, and on Windows with WSL2 and [wingubash](https://npmjs.com/package/wingubash):
```
curl https://raw.githubusercontent.com/js-emulators/desmond/main/installer.sh | sh
```

Or you can use through CDN:
```html
<script src="https://cdn.jsdelivr.net/gh/Unzor/desmond/cdn/desmond.min.js"></script>
```
Make sure to put the script below all elements in body but on top of the script you will use to initiate Desmond (like [this](#usage)).
# Usage
```html
<html>
  <body>
    <desmond-player id="player"></desmond-player>
    <script src="path/to/desmond.min.js"></script>
    <script>
    document.getElementById("player").loadURL("path-to-game.nds");
    </script>
  </body>
</html>
```
# Run function after load
To run a function after the file loads, you may attach a function as the second argument. You can also enable microphone using it.

# Enable microphone
To use the microphone, you have to use the "enableMicrophone" function inside of the callback function.
Here is an example:
```html
<!doctype html>
<html>
<body>
    <desmond-player id="player"></desmond-player>
    <script src="path/to/desmond.min.js"></script>
  <script>
      var player = document.getElementById("player");
      player.loadURL("FILE_HERE.nds", function(){
         player.enableMicrophone();
      })
  </script>
</body>

</html>
```
