document.querySelector('#convertButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];


        chrome.tabs.sendMessage(currentTab.id, { type: 'getschedule' });



    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const alertBox = document.querySelector("#display-box");
    let newTag = document.querySelector(".display-text");

    if (!newTag) {
        const displayText = document.createElement("p");
        displayText.className = "display-text";
        alertBox.appendChild(displayText);
        newTag = displayText;
    }

    // if (request.type === "receiveschedule") {
    //   if (request.schedule.length < 1) {
    newTag.textContent = "Empty schedule found";
    newTag.classList.add("display-text-error");
    //   }

    //   else {
    //     const output = separateSchedules(request.schedule);
    //     const iCalData = jsonToICal(output);
    //     downloadICS(iCalData, "schedule");

    newTag.textContent = "ICalendar file (.ics) downloaded!";
    //   }
    alertBox.appendChild(newTag);
    // }
});
