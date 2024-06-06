
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button, buttonVariants } from "./ui/button";
import { Menu, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";


export const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto my-1">
        <NavigationMenuList className="container h-20 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link to="/" className="ml-2 mb-2 font-bold text-xl flex">
              <img src="/assets/react.svg" alt="logo" />
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <div className="flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                ></Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    <Link to="/" className="ml-2 mt-5 font-bold text-xl flex">
                      <img
                        src="/logo.svg"
                        alt="logo"
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                { true ? (
                  <nav className="flex flex-col items-start gap-8">
                    <Button variant="ghost">
                      Welcome,
                      
                    </Button>
                    <Link
                      to="/"
                      className={`${buttonVariants({
                        variant: "outline",
                      })}`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/home"
                      className={`${buttonVariants({
                        variant: "outline",
                      })}`}
                    >
                      Dashboard
                    </Link>
                    <Button>
                      Sign out
                      <MoveRight />
                    </Button>
                  </nav>
                ) : (
                  <nav className="flex flex-col justify-start items-left gap-5 mt-4">
                    <Link
                      to="/"
                      className={`${buttonVariants({
                        variant: "outline",
                      })}`}
                    >
                      Home
                    </Link>
                    <Link
                      to="/signin"
                      onClick={() => setIsOpen(false)}
                      className={`${buttonVariants({ variant: "outline" })}`}
                    >
                      Sign in
                    </Link>
                    <Button>
                      <Link to="/signup">Get Started </Link>
                      <MoveRight />
                    </Button>
                  </nav>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* desktop */}

          {true ? (
            <nav className="hidden md:flex gap-2">
              <Button variant="ghost">
                Welcome,
              </Button>
              <Link
                to="/"
                className={`${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Home
              </Link>
              <Link
                to="/home"
                className={`${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Dashboard
              </Link>
              <Button>
                Sign out
                <MoveRight />
              </Button>
            </nav>
          ) : (
            <nav className="hidden md:flex gap-2">
              <Link
                to="/"
                className={`${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Home
              </Link>
              <Link
                to="/signin"
                className={`text-[17px] text-gray-600 ${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Sign in
              </Link>

              <Button className="flex gap-2">
                <Link to="/signup">Get Started </Link>

                <MoveRight />
              </Button>
            </nav>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
