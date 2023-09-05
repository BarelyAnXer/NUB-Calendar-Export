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
        // const uid = `${event.subjectCode}-${event.section}-${event.times[0].starttime}-${event.times[0].endtime}-${new Date().toISOString()}`;
        // try if this uid is reliable

        // pwede magka undefined dito ata?? pero na delet keona ata yng undefined entry
        const summary = event.subjectName;


        for (let i = 0; i < event.dates.length; i++) {
            const day = event.dates[i];
            const uid = generateUUID();
            const startTime = formatTime(event.times[i].starttime);
            const endTime = formatTime(event.times[i].endtime);

            console.log(day, getDayCode(day), "Flag")

            const dtStart = `${new Date().getFullYear()}09${getDayCode(day)}T${startTime}Z`;
            const dtEnd = `${new Date().getFullYear()}09${getDayCode(day)}T${endTime}Z`;

            icsData += "BEGIN:VEVENT\r\n";
            icsData += `UID:${uid}\r\n`;
            icsData += `SUMMARY:${summary}\r\n`;
            icsData += `DTSTART:${dtStart}\r\n`;
            icsData += `DTEND:${dtEnd}\r\n`;
            // icsData += "RRULE:FREQ=WEEKLY;UNTIL=20231231T235959Z\r\n";
            icsData += "END:VEVENT\r\n";
        }
    });

    icsData += "END:VCALENDAR\r\n";
    return icsData;
}

function getDayCode(targetDay) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const targetDayIndex = daysOfWeek.indexOf(targetDay);
    const daysToAdd = (targetDayIndex - currentDayOfWeek) % 7;
    const relativeDate = new Date(currentDate);
    relativeDate.setDate(currentDate.getDate() + daysToAdd);
    return relativeDate.getDate();
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
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'schedule' + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}