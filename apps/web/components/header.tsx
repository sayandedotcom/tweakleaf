import { Button } from '@/components/ui/button'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
      <Link href="/" className="flex items-center gap-x-4">
        <svg fill="none" viewBox="0 0 44 44" className="size-9" aria-hidden>
          <path
            fill="currentColor"
            d="M38 0a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6h32ZM22.982 9.105c-.208-1.081-1.756-1.081-1.964 0l-.85 4.421a1 1 0 0 1-1.666.541l-3.287-3.077c-.804-.752-2.056.158-1.589 1.155l1.911 4.077a1 1 0 0 1-1.03 1.417l-4.467-.558c-1.093-.136-1.571 1.336-.607 1.868l3.942 2.175a1 1 0 0 1 0 1.752l-3.942 2.175c-.964.532-.486 2.004.607 1.868l4.468-.558a1 1 0 0 1 1.03 1.417l-1.912 4.077c-.467.997.785 1.907 1.589 1.155l3.287-3.077a1 1 0 0 1 1.666.54l.85 4.422c.208 1.081 1.756 1.081 1.964 0l.85-4.421a1 1 0 0 1 1.666-.541l3.287 3.077c.804.752 2.056-.158 1.589-1.155l-1.911-4.077a1 1 0 0 1 1.03-1.417l4.467.558c1.093.136 1.572-1.336.607-1.868l-3.942-2.175a1 1 0 0 1 0-1.752l3.942-2.175c.965-.532.486-2.004-.607-1.868l-4.468.558a1 1 0 0 1-1.03-1.417l1.912-4.077c.467-.997-.785-1.907-1.589-1.155l-3.287 3.077a1 1 0 0 1-1.666-.54l-.85-4.422Z"
          />
        </svg>
        <span className="font-semibold">Acme Co.</span>
      </Link>
      <div className="flex items-center gap-x-4">
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
      </div>
    </header>
  )
}
