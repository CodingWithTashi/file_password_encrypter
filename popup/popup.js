var selectedFile;
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
    selectedFile = event.target.files[0];
    console.log(selectedFile);
  };

  //encrypt click listener
  document
    .getElementById("encrypt-file-btn")
    .addEventListener("click", function (e) {
      var fileNameTxt = document.getElementById("rename-file-input").value;
      var pwdTxt = document.getElementById("pwd-input").value;
      //
      var reader = new FileReader();

      reader.onload = () => {
        var wordArray = CryptoJS.lib.WordArray.create(reader.result); // Convert: ArrayBuffer -> WordArray
        if (
          wordArray != undefined &&
          pwdTxt != undefined &&
          pwdTxt.length > 0
        ) {
          var encrypted = CryptoJS.AES.encrypt(wordArray, pwdTxt).toString(); // Encryption: I: WordArray -> O: -> Base64 encoded string (OpenSSL-format)

          var fileEnc = new Blob([encrypted]);
          var url = window.URL.createObjectURL(fileEnc);
          var fileName = "";
          if (fileNameTxt != undefined && fileNameTxt.length > 0) {
            fileName = fileNameTxt + ".enc";
          } else {
            fileName = selectedFile.name + ".enc";
          }
          downloadFile(url, fileName);
        }
      };
      reader.readAsArrayBuffer(selectedFile);

      //
    });

  //decrypt listener
  document
    .getElementById("decrypt-file-btn")
    .addEventListener("click", function () {
      var pwdTxt = document.getElementById("pwd-input").value;
      var fileNameTxt = document.getElementById("rename-file-input").value;
      //
      var reader = new FileReader();
      reader.onload = () => {
        if (pwdTxt != undefined && pwdTxt.length > 0) {
          var decrypted = CryptoJS.AES.decrypt(reader.result, pwdTxt); // Decryption: I: Base64 encoded string (OpenSSL-format) -> O: WordArray
          var typedArray = convertWordArrayToUint8Array(decrypted); // Convert: WordArray -> typed array

          var fileDec = new Blob([typedArray]); // Create blob from typed array

          var url = window.URL.createObjectURL(fileDec);
          var fileName = "";
          if (fileNameTxt != undefined && fileNameTxt.length > 0) {
            fileName = fileNameTxt + ".pdf";
          } else {
            fileName = selectedFile.name.substr(
              0,
              selectedFile.name.length - 4
            );
          }
          downloadFile(url, fileName);
        }
      };
      reader.readAsText(selectedFile);
      //
    });
  function downloadFile(url, fileName) {
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  function convertWordArrayToUint8Array(wordArray) {
    var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
    var length = wordArray.hasOwnProperty("sigBytes")
      ? wordArray.sigBytes
      : arrayOfWords.length * 4;
    var uInt8Array = new Uint8Array(length),
      index = 0,
      word,
      i;
    for (i = 0; i < length; i++) {
      word = arrayOfWords[i];
      uInt8Array[index++] = word >> 24;
      uInt8Array[index++] = (word >> 16) & 0xff;
      uInt8Array[index++] = (word >> 8) & 0xff;
      uInt8Array[index++] = word & 0xff;
    }
    return uInt8Array;
  }
});
