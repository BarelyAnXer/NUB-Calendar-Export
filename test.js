// Define the UTC datetime values
const dtStartUtc = new Date('2023-09-04T13:00:00.000Z');
const dtEndUtc = new Date('2023-09-04T15:00:00.000Z');

// Convert to Philippine Time (UTC+8)
const philippineTimeOffset = 8 * 60 * 60 * 1000; // UTC+8 is 8 hours ahead of UTC (in milliseconds)
const dtStartPhilippines = new Date(dtStartUtc.getTime() + philippineTimeOffset);
const dtEndPhilippines = new Date(dtEndUtc.getTime() + philippineTimeOffset);

// Format the datetime objects for output in Google Calendar ICS format
const formattedStart = dtStartPhilippines.toISOString().replace(/[-:.]/g, '').slice(0, -1);
const formattedEnd = dtEndPhilippines.toISOString().replace(/[-:.]/g, '').slice(0, -1);

console.log(`DTSTART:${formattedStart}`);
console.log(`DTEND:${formattedEnd}`);
