import {
    Navbar,
    NavbarBrand,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    NavbarContent,
    NavbarItem,
    Link,
    Button, DropdownMenu, DropdownItem, DropdownTrigger, Dropdown, Avatar,
} from "@heroui/react";

export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export default function NavComp() {
    const menuItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];

    return (
        <Navbar
            isBordered
            className="backdrop-blur-md bg-white/80 shadow-sm text-black"
        >

            {/* Main nav items for larger screens */}
            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                <NavbarBrand>
                    <AcmeLogo/>
                    <p className="font-bold text-xl text-primary ml-2"><Link href="/">Chess++</Link></p>
                </NavbarBrand>

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
                            Game 2
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

                <NavbarItem className="hidden lg:flex">
                    <Link
                        href="/login"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Login
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Button
                        as={Link}
                        color="warning"
                        href="/register"
                        variant="flat"
                        className="hover:text-yellow-600 transition-colors duration-300 font-medium"
                    >
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
