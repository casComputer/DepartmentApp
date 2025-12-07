
export const getRandomSubmitMessage =() =>{
    const submitMessages = [
  "Great job! Assignment submitted on time 🎉",
  "Nice! You're right on schedule 😊",
  "Submission successful—keep up the good work 📚",
  "Awesome! You submitted right on time 🚀",
  "Perfect timing! Assignment received ✔️",
  "You're doing great! Submitted without delay 💯",
  "Well done! On-time submission logged 🕒",
  "Fantastic! Thanks for submitting promptly 🙌",
  "Smooth and on time—submission complete 🔥",
  "Excellent! Your punctuality is impressive 😄"
];
  return submitMessages[Math.floor(Math.random() * submitMessages.length)];
}