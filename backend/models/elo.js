function applyElo(currentRating, opponentRating, score, k = 32) {
    const expected = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    const newRating = Math.round(currentRating + k * (score - expected));
    return newRating;
}

module.exports = {applyElo};