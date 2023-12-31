chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);

    // Check if the current active webpage is the target page
    const isTargetPage = window.location.href === 'https://onlineapp.nu-baliwag.edu.ph/projectnuis/modules/students/schedule/viewer.php';

    if (!isTargetPage) {
        // Redirect to the target page
        window.location.href = 'https://onlineapp.nu-baliwag.edu.ph/projectnuis/modules/students/schedule/viewer.php';
    }

    const tableData = document.querySelector('#list > div > table');
    const rows = tableData.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    const scheduleEntries = [];

    for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getElementsByTagName('td')


        const parsedDates = data[3]?.textContent.trim().match(new RegExp(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].join('|'), 'g'))
        const parsedRooms = data[5]?.textContent.trim().match(/.{3}/g)


        let pairs = data[4]?.textContent.trim().match(/(\d{2}:\d{2}[APM]{2} - \d{2}:\d{2}[APM]{2})/g);
        let parsedTimes = []

        if (!pairs) {
            console.log("No time ranges found.");
        } else {
            parsedTimes = pairs.map((timeStr) => {
                const [start, end] = timeStr.split(" - ");
                return { starttime: start, endtime: end };
            });
        }

        const entry = {
            subjectCode: data[0].textContent.trim(),
            subjectName: data[1].textContent.trim(),
            section: data[2]?.textContent.trim(),
            dates: parsedDates,
            times: parsedTimes,
            rooms: parsedRooms,
            professor: data[6]?.textContent.trim(),
        }
        scheduleEntries.push(entry);
    }

    // remove the extra data that we don't need
    scheduleEntries.pop();

    chrome.runtime.sendMessage({
        type: "receiveschedule",
        schedule: scheduleEntries
    });
});
