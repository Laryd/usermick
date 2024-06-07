import { useState, useEffect } from "react";
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
import { Link, useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  telephone: string;
  location: string;
  isAdmin: boolean;
};

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = localStorage.getItem("token");
    const authUser = localStorage.getItem("user");

    setIsLoggedIn(!!authtoken);
    if (authUser) {
      setUser(JSON.parse(authUser));
    } 
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto my-1">
        <NavigationMenuList className="container h-20 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Link to="/" className="ml-2 mb-2 font-extrabold text-3xl flex">
              User<span className="text-blue-500">Mick</span>
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
                    <Link
                      to="/"
                      className="ml-2 mb-2 font-extrabold text-3xl flex"
                    >
                      User<span className="text-blue-500">Mick</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                {isLoggedIn ? (
                  <nav className="flex flex-col items-start gap-8">
                    <Button variant="ghost">Welcome {user?.name}</Button>
                    <Link
                      to="/"
                      className={`${buttonVariants({
                        variant: "outline",
                      })}`}
                    >
                      Home
                    </Link>
                    <Button onClick={handleSignOut}>
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

          {isLoggedIn ? (
            <nav className="hidden md:flex gap-2">
              <Button variant="ghost">Welcome {user?.name}</Button>
              <Link
                to="/"
                className={`${buttonVariants({
                  variant: "outline",
                })}`}
              >
                Home
              </Link>
              <Button onClick={handleSignOut}>
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
