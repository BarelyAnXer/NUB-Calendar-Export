// Get the current date
const currentDate = new Date();
console.log(currentDate.getDate())

// Define the name of the day you want to offset to (e.g., "Wednesday")
const targetDayName = "Wednesday";

// Define an object to map day names to their corresponding numerical values
const dayNameToValue = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

// Get the numerical value of the target day
const targetDayValue = dayNameToValue[targetDayName];

// Calculate the offset in days
const offset = (targetDayValue - currentDate.getDay() + 7) % 7;

// Create a new Date object with the offset applied
const offsetDate = new Date(currentDate);
offsetDate.setDate(currentDate.getDate() + offset);

// Format the offsetDate as a string (e.g., "Wednesday, September 6, 2023")
const formattedOffsetDate = offsetDate.toLocaleDateString(undefined, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

console.log(formattedOffsetDate);
