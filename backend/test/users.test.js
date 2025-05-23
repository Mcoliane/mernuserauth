const request = require("supertest");
const express = require("express");

// Mock Firebase Admin database
jest.mock("../config/firebaseAdmin", () => {
    return {
        db: {
            ref: jest.fn(),
        },
    };
});

// Mock playerRating module
jest.mock("../models/playerRating", () => ({
    updatePlayerRating: jest.fn(),
}));

const { db } = require("../config/firebaseAdmin");
const { updatePlayerRating } = require("../models/playerRating");

const usersRouter = require("../models/users");

const app = express();
app.use(express.json());
app.use("/api/users", usersRouter);

describe("Users API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /users/register", () => {
        it("registers a new user with unique username", async () => {
            // Mock db.ref().orderByChild().equalTo().once() chain to simulate username existence check
            const usersRefMock = {
                orderByChild: jest.fn().mockReturnThis(),
                equalTo: jest.fn().mockReturnThis(),
                once: jest.fn().mockResolvedValue({ exists: () => false }),
            };

            db.ref.mockImplementation((path) => {
                if (path === "users") return usersRefMock;
                return {
                    set: jest.fn().mockResolvedValue(),
                };
            });

            const payload = {
                uid: "user1",
                email: "user1@example.com",
                username: "coolguy",
            };

            const res = await request(app)
                .post("/api/users/register")
                .send(payload);

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("User registered with initial rating");
            expect(db.ref).toHaveBeenCalledWith("users");
            expect(usersRefMock.orderByChild).toHaveBeenCalledWith("username");
            expect(usersRefMock.equalTo).toHaveBeenCalledWith("coolguy");
        });

    });

    describe("POST /users/update-bio", () => {
        it("updates the user bio successfully", async () => {
            const updateMock = jest.fn().mockResolvedValue();

            db.ref.mockImplementation((path) => {
                expect(path).toBe("users/user1");  // FIXED here
                return { update: updateMock };
            });

            const res = await request(app)
                .post("/api/users/update-bio")
                .send({ uid: "user1", bio: "New bio here" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Bio updated successfully");
            expect(updateMock).toHaveBeenCalledWith({ bio: "New bio here" });
        });

        it("returns 400 if uid or bio missing", async () => {
            const res = await request(app).post("/api/users/update-bio").send({ uid: "user1" });
            expect(res.status).toBe(400);
            expect(res.body.error).toBe("uid and bio are required");
        });
    });


    describe("POST /users/update-elo", () => {
        it("updates elo rating when opponent exists", async () => {
            const opponentStats = {
                rating: 1300,
            };

            const onceMock = jest.fn().mockResolvedValue({
                exists: () => true,
                val: () => opponentStats,
            });

            const updateMock = jest.fn().mockResolvedValue();

            db.ref.mockImplementation((path) => {
                if (path === "users/opponent1/stats") {
                    return { once: onceMock };
                }
                if (path === "api/users/user1/stats") {
                    return { once: jest.fn().mockResolvedValue({ exists: () => true, val: () => ({ rating: 1200, gamesPlayed: 5 }) }),
                        update: updateMock };
                }
            });

            const res = await request(app)
                .post("/api/users/update-elo")
                .send({ uid: "user1", opponentUid: "opponent1", result: 1 });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Elo updated");
            expect(updatePlayerRating).toHaveBeenCalledWith("user1", 1300, 1);
        });

        it("returns 404 if opponent not found", async () => {
            const onceMock = jest.fn().mockResolvedValue({ exists: () => false });

            db.ref.mockImplementation((path) => {
                if (path === "users/opponent1/stats") {
                    return { once: onceMock };
                }
                return { once: jest.fn() };
            });

            const res = await request(app)
                .post("/api/users/update-elo")
                .send({ uid: "user1", opponentUid: "opponent1", result: 1 });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe("Opponent not found");
        });
    });
});
