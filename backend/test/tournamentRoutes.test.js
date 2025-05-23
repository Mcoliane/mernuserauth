const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.setTimeout(10000);

const request = require('supertest');
const express = require('express');

let app;
let mockSet, mockOnce, mockUpdate, mockRef;

beforeAll(async () => {
    // Step 1: Define all your mocks
    mockSet = jest.fn().mockResolvedValue(true);
    mockOnce = jest.fn().mockResolvedValue({ val: () => null, exists: () => false });
    mockUpdate = jest.fn().mockResolvedValue(true);

    mockRef = jest.fn(() => ({
        ref: mockRef,
        set: mockSet,
        once: mockOnce,
        update: mockUpdate
    }));

    // Step 2: Use doMock BEFORE loading tournamentRoutes
    jest.doMock('../config/firebaseAdmin.js', () => ({
        db: {
            ref: mockRef
        }
    }));

    // Step 3: Dynamically import tournamentRoutes AFTER mock is registered
    const tournamentRoutes = require('../routes/tournamentRoutes');

    // Step 4: Setup app
    app = express();
    app.use(express.json());
    app.use('/api/tournaments', tournamentRoutes);
});

describe('POST /api/tournaments/join/:tournamentId', () => {
    beforeEach(() => {
        mockSet.mockClear();
        mockOnce.mockClear();
        mockUpdate.mockClear();
        mockRef.mockClear();
    });

    it('registers a user successfully', async () => {
        const res = await request(app)
            .post('/api/tournaments/join/test_open')
            .send({ uid: 'user123', username: 'Mark' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Successfully registered." });
        expect(mockSet).toHaveBeenCalled();
    });
});
