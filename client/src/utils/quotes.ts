const quotes = [
    "The best way to predict the future is to create it. — Alan Kay",
    "Small steps lead to big algorithms.",
    "Don’t limit your challenges — challenge your limits.",
    "Think, build, break, repeat — that’s how innovation happens.",
    "Learn. Apply. Innovate.",
    "From logic to creativity — we build the bridge.",
    "The computer was born to solve problems that did not exist before. — Bill Gates",
    "Start where you are. Use what you have. Code what you can."
];

export const getRandomQuote = () => {
    const MAX = quotes.length - 1;
    const index = Math.floor(Math.random() * MAX);
    return quotes[index];
};
