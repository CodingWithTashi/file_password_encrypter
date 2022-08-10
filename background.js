// Added Event Listeners for Content.js and popup.js using onMessage() and onConnect() Listeners
var selectedText;
var database = null;
let databaseName = "dictionaryDb";
let fstore = "dictionaryTable";

//event listener from popup js
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function (message) {
        if (message == "Request Modified Value") {
            port.postMessage(selectedText);
        } else if (message.method == "searchWord") {

            var param = {
                method: "wordMeaning",
                data: "infos",
            };
            //send data back to popup js
            port.postMessage(param);
        }
    });
});

//on extension install listener
chrome.runtime.onInstalled.addListener(async function (details) {
    if (details.reason == "install") {
        //call a function to handle a first install
        console.log("install for first time");
    } else if (details.reason == "update") {
        //call a function to handle an update
    }
});
