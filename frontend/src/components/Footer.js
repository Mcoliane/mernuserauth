function Footer() {
    return (
        <footer className="w-full bg-gray-900 border-t border-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-center md:text-left text-sm text-gray-400">
                    © 2025 <span className="font-semibold text-white">Chess++</span>. All rights reserved.
                </p>

                {/* Socials or quick links */}
                <div className="mt-4 md:mt-0 flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
