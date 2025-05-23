
const fakeDb = {
    users: {
        user1: { stats: { rating: 1500 } },
        user2: { stats: { rating: 1400 } },
    }
};

async function getUserRating(uid) {
    return fakeDb.users[uid].stats.rating;
}

async function updatePlayerRating(uid, opponentRating, result) {
    const oldRating = await getUserRating(uid);
    const expected = 1 / (1 + Math.pow(10, (opponentRating - oldRating) / 400));
    const k = 10;
    const newRating = Math.round(oldRating + k * (result - expected));
    fakeDb.users[uid].stats.rating = newRating;
    return newRating;
}

// Mock socket class for testing
class MockSocket {
    constructor() {
        this.handlers = {};
        this.emittedEvents = [];
    }

    on(event, callback) {
        this.handlers[event] = callback;
    }

    emit(event, data) {
        this.emittedEvents.push({ event, data });
    }

    to(room) {
        return this; // For chaining .to().emit()
    }

    // Helper to simulate receiving an event
    trigger(event, data) {
        if (this.handlers[event]) {
            return this.handlers[event](data);
        }
    }
}

describe("Elo update on ranked-game-over event", () => {
    let socket1, socket2;
    const room = "test-room";

    beforeEach(() => {
        // Reset ratings before each test
        fakeDb.users.user1.stats.rating = 1500;
        fakeDb.users.user2.stats.rating = 1400;

        socket1 = new MockSocket();
        socket2 = new MockSocket();

        // Attach event handlers (simulate your actual socket logic)
        [socket1, socket2].forEach((socket) => {
            socket.on("ranked-game-over", async ({ winnerUid, loserUid }) => {
                socket.to(room).emit("ranked-game-over", { winnerUid });

                const winnerRating = await getUserRating(winnerUid);
                const loserRating = await getUserRating(loserUid);

                await updatePlayerRating(winnerUid, loserRating, 1);
                await updatePlayerRating(loserUid, winnerRating, 0);
            });
        });
    });

    test("should update ratings correctly when user1 wins", async () => {
        await socket1.trigger("ranked-game-over", { winnerUid: "user1", loserUid: "user2" });

        // Check if the event was emitted
        expect(socket1.emittedEvents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ event: "ranked-game-over", data: { winnerUid: "user1" } }),
            ])
        );

        // Check updated ratings
        expect(fakeDb.users.user1.stats.rating).toBeGreaterThan(1500);
        expect(fakeDb.users.user2.stats.rating).toBeLessThan(1400);
    });

    test("should update ratings correctly when user2 wins", async () => {
        await socket2.trigger("ranked-game-over", { winnerUid: "user2", loserUid: "user1" });

        expect(socket2.emittedEvents).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ event: "ranked-game-over", data: { winnerUid: "user2" } }),
            ])
        );

        expect(fakeDb.users.user2.stats.rating).toBeGreaterThan(1400);
        expect(fakeDb.users.user1.stats.rating).toBeLessThan(1500);
    });
});