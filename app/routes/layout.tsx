import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-t from-app-orange-50 to-white"></div>
      <header className="flex flex-col gap-4 items-center justify-center p-6 pt-12 relative">
        <a href="/">
          <h1 className="text-6xl font-extrabold text-app-orange-500 tracking-tighter">
            News Battle
          </h1>
        </a>
        <p className="text-gray-500">
          Exposing left and right bias in the mainstream media
        </p>
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </>
  );
}
