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

    //     let iCalData = `BEGIN:VCALENDAR
    // VERSION:2.0
    // PRODID:-//Your Organization//Your Website//EN
    // CALSCALE:GREGORIAN
    // METHOD:PUBLISH`


    //     iCalData = iCalData + `BEGIN:VEVENT
    // UID:${uid}
    // SUMMARY:${event.subject}
    // DTSTART:${formatICalDate(startDate)}
    // DTEND:${formatICalDate(endDate)}
    // RRULE:FREQ=WEEKLY;UNTIL=${formatICalDate(endRecurringDate)}
    // END:VEVENT\n`;


    //     iCalData += 'END:VCALENDAR';




    const icsContent = convertToICS(request.schedule);

    downloadICS(icsContent, "schedule");

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

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function convertToICS(data) {
    let icsData = "BEGIN:VCALENDAR\r\n";
    icsData += "VERSION:2.0\r\n";

    data.forEach(event => {
        // pwede magka undefined dito
        const summary = event.subjectName;
        
        event.dates.forEach(day => {
            event.times.forEach(time => {
                const uid = generateUUID();
                const dtStart = `202309${getDayCode(day)}T${formatTime(time.starttime)}`;
                const dtEnd = `202309${getDayCode(day)}T${formatTime(time.endtime)}`;

                icsData += "BEGIN:VEVENT\r\n";
                icsData += `UID:${uid}\r\n`;
                icsData += `SUMMARY:${summary}\r\n`;
                icsData += `DTSTART:${dtStart}\r\n`;
                icsData += `DTEND:${dtEnd}\r\n`;
                icsData += "RRULE:FREQ=WEEKLY;UNTIL=20231231T235959Z\r\n";
                icsData += "END:VEVENT\r\n";
            });
        });
    });

    icsData += "END:VCALENDAR\r\n";
    return icsData;
}

function getDayCode(day) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return (days.indexOf(day) + 1).toString().padStart(2, '0');
}

function formatTime(time) {
    return time.replace(/(\d+):(\d+)([APM]+)$/, function (match, hh, mm, ampm) {
        if (ampm === "PM" && hh !== "12") {
            hh = (parseInt(hh) + 12).toString();
        }
        return `${hh}${mm}00`;
    });
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