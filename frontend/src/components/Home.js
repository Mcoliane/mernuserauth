import {Link} from "@heroui/react";
function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
            <header className="text-center mt-20">
                <h1 className="text-5xl font-bold mb-4">Master Your Mind</h1>
                <p className="text-xl mb-8">Play Chess and strategy games against AI or your friends.</p>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl px-6">
                <button
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
                    <Link href='/chess'> Start Playing </Link>
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
                    <Link href='/login'> Make an Account </Link>
                </button>
                </div>
            </header>

            {/* Optional Why Section */}
            <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl px-6">
                <div className="bg-white/10 p-6 rounded-xl shadow-md text-center">
                <h2 className="text-2xl font-semibold mb-2">♟️ Challenge AI</h2>
                    <p>Face increasingly difficult computer opponents and improve your skills.</p>
                </div>
                <div className="bg-white/10 p-6 rounded-xl shadow-md text-center">
                    <h2 className="text-2xl font-semibold mb-2">🧑‍🤝‍🧑 Play with Friends</h2>
                    <p>Invite friends and battle it out in real time!</p>
                </div>
            </section>

        </div>
    );
}

export default HomePage;
