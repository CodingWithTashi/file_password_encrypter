var uint8Array;
document.addEventListener("DOMContentLoaded", function (event) {
  //Used Port\Long Lived Connection for communicating with background page for fetching results
  //   var port = chrome.runtime.connect({
  //     name: "Sample Communication",
  //   });
  //   port.postMessage("Request Modified Value");

  //   port.onMessage.addListener(function (msg) {
  //     if (msg != null && msg.method != undefined) {
  //       switch (msg.method) {
  //         case "wordMeaning":
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   });

  //file picker listener
  document.getElementById("file_picker").onchange = function (event) {
    var file = event.target.files[0];
    console.log(file);
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.addEventListener("load", (loadEvent) => {
      var buffer = loadEvent.target.result;
      uint8Array = new Uint8Array(buffer);
      console.log(uint8Array);
    });
  };

  //encrypt click listener
  document
    .getElementById("encrypt-file-btn")
    .addEventListener("click", function (e) {
      var fileNameTxt = document.getElementById("rename-file-input").value;
      var pwdTxt = document.getElementById("pwd-input").value;
      //
      if (uint8Array != undefined) {
        (async () => {
          const message = await openpgp.createMessage({ binary: uint8Array });
          const encrypted = await openpgp.encrypt({
            message, // input as Message object
            passwords: [pwdTxt], // multiple passwords possible
            format: "binary", // don't ASCII armor (for Uint8Array output)
          });
          console.log(encrypted); // Uint8Array

          downloadBlob(encrypted, fileNameTxt + ".enc", "application/pdf");
        })();
      }

      //
    });

  //decrypt listener
  document
    .getElementById("decrypt-file-btn")
    .addEventListener("click", function () {
      var pwdTxt = document.getElementById("pwd-input").value;
      var fileNameTxt = document.getElementById("rename-file-input").value;

      //
      if (uint8Array != undefined) {
        (async () => {
          const encryptedMessage = await openpgp.readMessage({
            binaryMessage: uint8Array, // parse encrypted bytes
          });
          const { data: decrypted } = await openpgp.decrypt({
            message: encryptedMessage,
            passwords: [pwdTxt], // decrypt with password
            format: "binary", // output as Uint8Array
          });
          console.log(decrypted); // Uint8Array([0x01, 0x01, 0x01])
          downloadBlob(decrypted, fileNameTxt + ".pdf", "application/pdf");
        })();
      }

      //
    });

  //download blob
  function downloadBlob(data, fileName, mimeType) {
    var blob, url;
    blob = new Blob([data], {
      type: mimeType,
    });
    url = window.URL.createObjectURL(blob);
    downloadURL(url, fileName);
    setTimeout(function () {
      return window.URL.revokeObjectURL(url);
    }, 1000);
  }

  //doenload url
  function downloadURL(data, fileName) {
    var a;
    a = document.createElement("a");
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = "display: none";
    a.click();
    a.remove();
  }
});
