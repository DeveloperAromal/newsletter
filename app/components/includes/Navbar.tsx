import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed w-full py-8 bg-white  ">
      <div>
        <nav className="flex justify-between items-center px-10">
          <div className="flex items-center justify-center gap-[3rem]">
            <Link
              href="#"
              className="text-cyan-400 flex items-center justify-center"
            >
              <h1>
                <Image src="/logo.svg" alt="logo" width={100} height={100} />
              </h1>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
