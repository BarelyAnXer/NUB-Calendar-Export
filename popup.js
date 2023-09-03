document.querySelector('#convertButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];


        chrome.tabs.sendMessage(currentTab.id, { type: 'getschedule' });



    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const alertBox = document.querySelector("#display-box");
    let newTag = document.querySelector(".display-text");

    console.log(request.schedule)

    // const output = separateSchedules(request.schedule);
    // const iCalData = jsonToICal(output);

    let iCalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//Your Website//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH`

    // BEGIN:VEVENT
    // UID:9876543210
    // DTSTAMP:20230903T120000Z
    // DTSTART:20230903T160000Z
    // DTEND:20230903T180000Z
    // SUMMARY:Random Event
    // DESCRIPTION:This is a randomly generated event description.
    // LOCATION:Virtual Meeting
    // ORGANIZER:John Doe
    // ATTENDEE:Jane Doe
    // END:VEVENT
    // END:VCALENDAR

//     iCalData = iCalData + `BEGIN:VEVENT
// UID:${uid}
// SUMMARY:${event.subject}
// DTSTART:${formatICalDate(startDate)}
// DTEND:${formatICalDate(endDate)}
// RRULE:FREQ=WEEKLY;UNTIL=${formatICalDate(endRecurringDate)}
// END:VEVENT\n`;


    iCalData += 'END:VCALENDAR';

    downloadICS(iCalData, "schedule");

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

function scheduleToEvents(schedule) {

}

function constructICS() {

}

function downloadICS(content) {
    const filename = "schedule"
    console.log("asdk")
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}