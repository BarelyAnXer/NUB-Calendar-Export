document.querySelector('#convertButton').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { type: 'getschedule' });
    });
});

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "content-script");
    port.onMessage.addListener(function (msg) {
        // Handle messages from content scripts here
        console.timeLog("123123")
        if (msg.type === "receiveschedule") {
            console.timeLog("asd")
        }
    });
});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const alertBox = document.querySelector("#display-box");
    let newTag = document.querySelector(".display-text");

    // console.log(request.schedule)

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
    // icsData += "X-WR-TIMEZONE:Asia/Manila\r\n"


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
            // console.log(event.times[i].starttime, event.times[i].endtime)

            // console.log(day, getDayCode(day), "Flag")

            const dtStart = `${new Date().getFullYear()}09${getDayCode(day)}T${startTime}Z`;
            const dtEnd = `${new Date().getFullYear()}09${getDayCode(day)}T${endTime}Z`;

            icsData += "BEGIN:VEVENT\r\n";
            icsData += `UID:${uid}\r\n`;
            icsData += `SUMMARY:${summary}\r\n`;
            icsData += `DTSTART;TZID=Asia/Manila:${dtStart}\r\n`;
            icsData += `DTEND;TZID=Asia/Manila:${dtEnd}\r\n`;
            icsData += "RRULE:FREQ=WEEKLY;UNTIL=20231231T235959Z\r\n";
            icsData += "END:VEVENT\r\n";
        }
    });
    // 01:00PM 03:00PM
    // 11:00AM 01:00PM

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
    return relativeDate.getDate().toString().padStart(2, '0');
}


function formatTime(timeString) {
    // Split the input time string into hours and minutes
    const timeParts = timeString.match(/(\d{2}):(\d{2})([APM]{2})/);

    if (timeParts && timeParts.length === 4) {
        let hours = parseInt(timeParts[1], 10);
        const minutes = timeParts[2];
        const period = timeParts[3];

        // Adjust hours for PM times
        if (period === "PM" && hours !== 12) {
            hours += 12;
        }

        // Convert hours to a 2-digit string
        hours = hours.toString().padStart(2, '0');

        // Build the Google Calendar time format
        return `${hours}${minutes}00`;
    } else {
        // Invalid input format
        return "Invalid time format";
    }
}


// function formatTime(time) {
//     return time.replace(/(\d+):(\d+)([APM]+)$/, function (match, hh, mm, ampm) {
//         if (ampm === "PM" && hh !== "12") {
//             hh = (parseInt(hh) + 12).toString();
//         }
//         return `${hh}${mm}00`;
//     });
// }

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