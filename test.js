function getRelativeDate(targetDay) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const targetDayIndex = daysOfWeek.indexOf(targetDay);
    const daysToAdd = (targetDayIndex - currentDayOfWeek) % 7;
    const relativeDate = new Date(currentDate);
    relativeDate.setDate(currentDate.getDate() + daysToAdd);
    return relativeDate.getDate();
}