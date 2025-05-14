const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const playerRating = require('../models/playerRating');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await playerRating.deleteMany({});
});

describe('PlayerRating Model', () => {

    it('Should bootstrap a new rating for a user', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const ratingDoc = await playerRating.bootstrapForUser(fakeUserId);

        expect(ratingDoc.user).toEqual(fakeUserId);
        expect(ratingDoc.rating).toBe(1200);
        expect(ratingDoc.rd).toBe(350);
        expect(ratingDoc.gamesPlayed).toBe(0);
        expect(ratingDoc.updatedAt).toBeInstanceOf(Date);
    });

    it('should correctly apply Elo updates on win', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const player = await playerRating.bootstrapForUser(fakeUserId);

        const newRating = player.applyElo(1250, 1); // win against stronger opponent

        expect(typeof newRating).toBe('number');
        expect(newRating).toBeGreaterThan(1200); // rating should go up
        expect(player.gamesPlayed).toBe(1);
        expect(player.updatedAt).toBeInstanceOf(Date);
    });

    it('should correctly apply Elo updates on loss', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const player = await playerRating.bootstrapForUser(fakeUserId);

        const newRating = player.applyElo(1100, 0); // loss against weaker opponent

        expect(newRating).toBeLessThan(1200); // rating should go down
        expect(player.gamesPlayed).toBe(1);
    });

    it('should applyElo with custom K-factor', async () => {
        const fakeUserId = new mongoose.Types.ObjectId();
        const player = await playerRating.bootstrapForUser(fakeUserId);

        const rating1 = player.applyElo(1200, 1, 16); // smaller K, smaller jump
        expect(rating1).toBeGreaterThan(1200);
        expect(rating1).toBeLessThan(1216); // Max it could go is 1216
    });

});
