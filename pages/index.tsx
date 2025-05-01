import { useRouter } from "next/router";


export default function Home() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      

      {/* Overlay */}
      <div className="absolute inset-0 bg bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-6 min-h-screen">
        <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">
          Welcome to <span className="text-yellow-400">Expense Tracker</span>
        </h1>
        <p className="text-lg md:text-xl opacity-80 max-w-xl">
         An expense tracker is a tool used to record and monitor spending to manage personal or business finance.
        </p>
        {/* 🔐 Login and Signup Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 text-lg font-semibold bg-white text-black rounded-full shadow-lg hover:bg-gray-200 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-2 text-lg font-semibold bg-yellow-500 text-black rounded-full shadow-lg hover:bg-yellow-600 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}