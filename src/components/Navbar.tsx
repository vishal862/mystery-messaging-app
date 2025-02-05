"use client";

import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);

  const user: User = session?.user;

  console.log(user);

  const handleSigninClick = () => {
    setIsLoading(true);
  };

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold mb-4 md:mb-0">
          Mystery Message
        </a>
        {session ? (
          <>
            <span>Welcome, {user.username || user.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href={"/sign-up"}>
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
              onClick={handleSigninClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
