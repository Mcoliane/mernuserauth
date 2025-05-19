import React, { useState, useEffect } from "react";
import Logo from '../assets/icon.png';
import LogoutButton from "./LogoutButton";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from "@heroui/react";

export default function NavComp() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({
                    displayName: currentUser.displayName || "Anonymous",
                    email: currentUser.email || "",
                    photoURL: currentUser.photoURL || "https://i.pravatar.cc/150?u=default",
                });

            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <Navbar isBordered className="backdrop-blur-md bg-white/80 shadow-sm text-black relative">
            {/* Top bar */}
            <NavbarContent justify="start">
                <button className="sm:hidden p-2 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className="space-y-1">
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                    </div>
                </button>
                <NavbarBrand>
                    <img src={Logo} alt="Chess++ Logo" className="h-9 w-auto" />
                    <p className="font-bold text-xl text-primary ml-2">
                        <Link href="/">Chess++</Link>
                    </p>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Menu */}
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem><Link href="/" className="hover:text-yellow-600 transition-colors duration-300 font-medium">Home</Link></NavbarItem>

                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button disableRipple className="p-0 bg-transparent text-black hover:text-yellow-600 transition-colors duration-300 font-medium" radius="sm" variant="light">
                                Games
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu aria-label="Game features" className="bg-white border border-gray-200 shadow-lg rounded-lg p-2">
                        <DropdownItem key="chess"><Link href="/chess">Chess</Link></DropdownItem>
                        <DropdownItem key="game2"><Link>Coming Soon</Link></DropdownItem>
                        <DropdownItem key="game3">Coming Soon</DropdownItem>
                        <DropdownItem key="game4">Coming Soon</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <NavbarItem><Link href="/howToPlay" className="hover:text-yellow-600 transition-colors duration-300 font-medium">Game Rules</Link></NavbarItem>
                <NavbarItem><Link href="/tournaments" className="hover:text-yellow-600 transition-colors duration-300 font-medium">Tournaments</Link></NavbarItem>
                <NavbarItem><Link href="/friends" className="hover:text-yellow-600 transition-colors duration-300 font-medium">Friends</Link></NavbarItem>
                {!user && (
                    <NavbarItem className="hidden lg:flex">
                        <Link href="/login" className="hover:text-yellow-600 transition-colors duration-300 font-medium">
                            Login
                        </Link>
                    </NavbarItem>
                )}

            </NavbarContent>

            {/* Profile Avatar */}
            <NavbarContent as="div" justify="end">
                {user && (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                color="green"
                                as="button"
                                radius="full"
                                className="w-10 h-10 p-1"
                                name={user.displayName}
                                src={user.photoURL}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat" className="bg-white border border-gray-200 shadow-lg rounded-lg p-2">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as {user.email}</p>
                            </DropdownItem>
                            <DropdownItem key="settings"><Link href="/profile">My Profile</Link></DropdownItem>
                            <DropdownItem key="logout" color="danger"><LogoutButton /></DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </NavbarContent>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col sm:hidden z-50">
                    <Link href="/" className="block px-6 py-4 text-black hover:bg-yellow-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link href="/chess" className="block px-6 py-4 text-black hover:bg-yellow-100" onClick={() => setIsMenuOpen(false)}>Chess</Link>
                    <Link href="#" className="block px-6 py-4 text-black hover:bg-yellow-100" onClick={() => setIsMenuOpen(false)}>Game Coming Soon</Link>
                    <Link href="/protected" className="block px-6 py-4 text-black hover:bg-yellow-100" onClick={() => setIsMenuOpen(false)}>Protected</Link>
                    {!user && <Link href="/login" className="block px-6 py-4 text-black hover:bg-yellow-100" onClick={() => setIsMenuOpen(false)}>Login</Link>}
                </div>
            )}
        </Navbar>
    );
}
