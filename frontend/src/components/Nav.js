import React from "react";
import Logo from '../assets/icon.png';
import LogoutButton from "./LogoutButton";
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
} from "@heroui/react"; // or wherever you get your components

export default function NavComp() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (<Navbar
            isBordered
            className="backdrop-blur-md bg-white/80 shadow-sm text-black relative"
        >
            {/* Top bar */}
            <NavbarContent justify="start">
                {/* Hamburger for mobile */}
                <button
                    className="sm:hidden p-2 focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {/* Simple Hamburger Icon */}
                    <div className="space-y-1">
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                        <div className="w-6 h-0.5 bg-black"></div>
                    </div>
                </button>

                {/* Brand Logo */}
                <NavbarBrand>
                    <img src={Logo} alt="Chess++ Logo" className="h-9 w-auto"/>
                    <p className="font-bold text-xl text-primary ml-2">
                        <Link href="/">Chess++</Link>
                    </p>
                </NavbarBrand>
            </NavbarContent>

            {/* Desktop Menu */}
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link
                        color="foreground"
                        href="/"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Home
                    </Link>
                </NavbarItem>

                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 bg-transparent text-black hover:text-yellow-600 transition-colors duration-300 font-medium"
                                radius="sm"
                                variant="light"
                            >
                                Games
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="Game features"
                        className="bg-white border border-gray-200 shadow-lg rounded-lg p-2"
                        itemClasses={{
                            base: "rounded-md px-4 py-3 hover:bg-yellow-100 hover:text-black transition duration-300",
                        }}
                    >
                        <DropdownItem key="chess" description="Play a classic chess match">
                            <Link
                                color="foreground"
                                href="/chess"
                                className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                            >
                                Chess
                            </Link>
                        </DropdownItem>
                        <DropdownItem key="game2" description="Challenge yourself with puzzles">
                            <Link
                                color="foreground"
                                href="/howToPlay"
                                className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                            >
                                Game Rules
                            </Link>
                        </DropdownItem>
                        <DropdownItem key="game3" description="Multiplayer battles">
                            Game 3
                        </DropdownItem>
                        <DropdownItem key="game4" description="Timed blitz matches">
                            Game 4
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <NavbarItem>
                    <Link
                        color="foreground"
                        href="/protected"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Protected
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link
                        color="foreground"
                        href='/tournaments'
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Tournaments
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        color="foreground"
                        href="/friends"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Friends
                    </Link>
                </NavbarItem>
                <NavbarItem className="hidden lg:flex">
                    <Link
                        href="/login"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Login
                    </Link>
                </NavbarItem>
            </NavbarContent>
            {/* Profile Avatar */}
            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            color="green"
                            as="button"
                            radius="full"
                            className="w-10 h-10 p-1"
                            name="Jason Hughes"
                            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat"
                                  className="bg-white border border-gray-200 shadow-lg rounded-lg p-2" itemClasses={{
                        base: "rounded-md px-4 py-3 hover:bg-yellow-100 hover:text-black transition duration-300",
                    }}>
                        <DropdownItem key="profile" className="h-14 gap-2">
                            <p className="font-semibold">Signed in as zoey@example.com</p>
                        </DropdownItem>
                        <DropdownItem key="settings">
                            <Link href="/profile">My Profile</Link>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger">
                            <LogoutButton />
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col sm:hidden z-50">
                    <Link
                        href="/"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/chess"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Chess
                    </Link>
                    <Link
                        href="#"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Game Coming Soon
                    </Link>
                    <Link
                        href="#"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Game Coming Soon
                    </Link>
                    <Link
                        href="/protected"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Protected
                    </Link>
                    <Link
                        href="/login"
                        className="block px-6 py-4 text-black hover:bg-yellow-100"
                        onPress={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                </div>)}
        </Navbar>);
}
