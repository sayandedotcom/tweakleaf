import { site } from "@/configs/site";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import {
//   SignedIn,
//   SignInButton,
//   SignUpButton,
//   SignedOut,
//   UserButton,
// } from "@clerk/nextjs";
import Link from "next/link";
import { navigation } from "@/configs/navbar";

function Navbar() {
  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  W3
                </span>
              </div> */}
            <Image
              src={site.logo}
              alt="logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            {/* <Image
              src="/1.svg"
              alt="logo"
              width={60}
              height={60}
              className="rounded-lg"
            /> */}
            <span className="text-xl font-bold">{site.name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((nav, index) =>
              nav.title === "Founder's Tip" ? (
                <Link
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  key={index}
                  href={nav.path}
                >
                  {nav.title}
                </Link>
              ) : (
                <Link key={index} href={nav.path}>
                  {nav.title}
                </Link>
              ),
            )}
          </div>

          {/* <div className="flex items-center gap-x-4">
            <SignedOut>
              <SignInButton>
                <Button variant="ghost">Sign in</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <Button
              variant={"secondary"}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
