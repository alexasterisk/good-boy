const weightedWords: Record<string, number> = {
    bark: 100,
    woof: 100,
    ruff: 100,
    arf: 100,
    'bow wow': 100,
    bork: 50,
    yip: 10,
    yap: 10,
    yelp: 10,
    yowl: 10,
    meow: 1,
    purr: 1,
    hiss: 20
};

export function makeRandomMessage() {
    let message = '';
    const words = Object.keys(weightedWords);
    const weights = Object.values(weightedWords);

    const randomLength = Math.floor(Math.random() * 125) + 75;
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    for (let i = 0; i < randomLength; i++) {
        const randomWeight = Math.floor(Math.random() * totalWeight);
        let weightSum = 0;

        for (let j = 0; j < words.length; j++) {
            weightSum += weights[j];
            if (randomWeight <= weightSum) {
                message += `${words[j]} `;
                break;
            }
        }
    }

    return message;
}
