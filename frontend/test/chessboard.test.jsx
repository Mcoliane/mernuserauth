import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChessBoard from "../Components/Chess";

// Mock useNavigate from react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom");
    return {
        ...originalModule,
        useNavigate: () => mockNavigate,
    };
});

// Mock ChessGameMode globally BEFORE imports (jest hoisting)
jest.mock("../Components/ChessGameMode", () => {
    const React = require("react");
    return {
        __esModule: true,
        default: React.forwardRef((props, ref) => {
            React.useImperativeHandle(ref, () => ({
                resetGame: jest.fn(),
            }));
            return (
                <div>
                    ChessGameMode Component
                    <button onClick={() => ref?.current?.resetGame?.()}>Reset Game</button>
                </div>
            );
        }),
    };
});

beforeEach(() => {
    let store = {};
    jest.spyOn(window.sessionStorage.__proto__, "getItem").mockImplementation((key) => store[key] || null);
    jest.spyOn(window.sessionStorage.__proto__, "setItem").mockImplementation((key, value) => {
        store[key] = value.toString();
    });
    jest.spyOn(window.sessionStorage.__proto__, "removeItem").mockImplementation((key) => {
        delete store[key];
    });
    mockNavigate.mockClear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("ChessBoard Component", () => {
    test("renders mode selector by default", () => {
        render(
            <MemoryRouter>
                <ChessBoard />
            </MemoryRouter>
        );
        expect(screen.getByText(/Chess Master/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Play vs AI/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Player vs Player/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Online Multiplayer/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Ranked Match/i })).toBeInTheDocument();
    });

    test("selecting a mode sets mode state, updates sessionStorage, and navigates", async () => {
        render(
            <MemoryRouter>
                <ChessBoard />
            </MemoryRouter>
        );

        const aiButton = screen.getByRole("button", { name: /Play vs AI/i });
        fireEvent.click(aiButton);

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: /Play vs AI/i })).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/AI Opponent/i)).toBeInTheDocument();
        });

        const sessionKey = window.sessionStorage.getItem("sessionKey");
        expect(window.sessionStorage.getItem(`${sessionKey}-mode`)).toBe("AI");
        expect(mockNavigate).toHaveBeenCalledWith("/chess?mode=AI");
    });


    test("back button clears mode, sessionStorage, confirms, and navigates", async () => {
        render(
            <MemoryRouter>
                <ChessBoard />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /Play vs AI/i }));

        // wait for transition to AI mode
        await waitFor(() => {
            expect(screen.getByText(/AI Opponent/i)).toBeInTheDocument();
        });

        // Mock confirm
        jest.spyOn(window, "confirm").mockImplementation(() => true);

        const backButton = screen.getByRole("button", { name: /Back/i });
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Play vs AI/i })).toBeInTheDocument();
        });

        const sessionKey = window.sessionStorage.getItem("sessionKey");
        expect(window.sessionStorage.getItem(`${sessionKey}-mode`)).toBe(null);
        expect(mockNavigate).toHaveBeenCalledWith("/chess");
    });

    test("beforeunload event added and removed with proper handler", () => {
        const addEventListenerSpy = jest.spyOn(window, "addEventListener");
        const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

        const { unmount } = render(
            <MemoryRouter>
                <ChessBoard />
            </MemoryRouter>
        );

        expect(addEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });
});
