"use client";
export default function Login() {
  return (
    <form className="flex flex-col gap-4">
      <input
        className="px-2 py-2 rounded-md"
        type="text"
        name="username"
        id="username"
        placeholder="Username"
      />
      <input
        className="px-2 py-2 rounded-md"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
      />
      <button
        className="uppercase px-2 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-800"
        type="submit"
      >
        Sign In
      </button>
    </form>
  );
}
