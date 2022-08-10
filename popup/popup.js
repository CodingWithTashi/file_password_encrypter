document.addEventListener("DOMContentLoaded", function (event) {
    //Used Port\Long Lived Connection for communicating with background page for fetching results
    var port = chrome.runtime.connect({
        name: "Sample Communication",
    });
    port.postMessage("Request Modified Value");

    port.onMessage.addListener(function (msg) {
        if (msg != null && msg.method != undefined) {
            switch (msg.method) {
                case "wordMeaning":


                    break;
                default:
                    break;
            }
        }
    });



    document.getElementById("file_picker").onchange = function (event) {
        var file = event.target.files[0];

    }
    document
        .getElementById("encrypt_file_btn")
        .addEventListener("click", function (e) {
            var fileNameTxt = document.getElementById("rename_file_input").value;
            var pwdTxt = document.getElementById("pwd_input").value;
            console.log(fileNameTxt);
            console.log(pwdTxt);
            // 


            // 
        });


    // document
    //   .getElementById("search_word_input_btn")
    //   .addEventListener("click", getWordMeaning);
    // document
    //   .getElementById("search_word_input")
    //   .addEventListener("keypress", function (e) {
    //     if (e.key === "Enter") getWordMeaning();
    //   });

    // function getWordMeaning() {
    //   var enterText = document.getElementById("search_word_input").value;
    //   if (enterText) {
    //     let firstWord = enterText.split(" ")[0];
    //     var data = {
    //       method: "searchWord",
    //       data: firstWord,
    //     };
    //     port.postMessage(data);
    //   }
    // }
});