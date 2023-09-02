chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // (() => {
    console.log(request)

    const tableData = document.querySelector('#list > div > table')
    const rows = tableData.getElementsByTagName("tbody")[0].getElementsByTagName("tr")
    const scheduleEntries = [];

    for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getElementsByTagName('td')

        const entry = {
            subjectCode: data[0].textContent.trim(),
            subjectName: data[1].textContent.trim(),
            section: data[2]?.textContent.trim(),
            dates: data[3]?.textContent.trim(),
            times: data[4]?.textContent.trim(),
            rooms: data[5]?.textContent.trim(),
            professor: data[6]?.textContent.trim(),
        }
        scheduleEntries.push(entry);
    }
    chrome.runtime.sendMessage({
        type: "receiveschedule",
        schedule: scheduleEntries
    });

});
// })();


