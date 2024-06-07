import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Trash2, UserIcon } from "lucide-react";
import { UserEditModal } from "./UserEditModal";
import { useToast } from "./ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  telephone: string;
  location: string;
  isAdmin: boolean;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [value, setValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUsersData();
  }, [currentPage]);

  async function loadUsersData() {
    try {
      const response = await axios.get<User[]>(
        `https://myjsonserver-o9en.onrender.com/users?_page=${currentPage}&_limit=${pageSize}`
      );
      setUsers(response.data);
      setHasNextPage(response.data.length === pageSize);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<User[]>(
        `https://myjsonserver-o9en.onrender.com/users?q=${value}`
      );
      setUsers(response.data);
      setValue("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const deleteUserHandler = async (userId: number) => {
    try {
      await axios.delete(
        `https://myjsonserver-o9en.onrender.com/users/${userId}`
      );
      toast({
        variant: "default",
        title: "User deleted",
        description: "The user was deleted successfully",
      });
      loadUsersData();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const handleReset = () => {
    setValue("");
  };

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrevious = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="container">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center my-6">
        Users{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Table
        </span>
      </h2>
      <div
        className="flex flex-col justify-end items-end gap-4"
        onSubmit={searchHandler}
      >
        <form className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            value={value}
            placeholder="find user by name"
            onChange={(e) => setValue(e.target.value)}
          />
          <Button type="submit">
            <span className="ml-2">Search</span>
          </Button>
          <Button onClick={handleReset}>
            <span className="ml-2">Reset</span>
          </Button>
        </form>
        <Table>
          <TableHeader>
            <TableRow className="bg-black text-white hover:bg-blue-950 hover:text-white">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Location</TableHead>
            </TableRow>
          </TableHeader>
          {users.length === 0 ? (
            <caption>No user found</caption>
          ) : (
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="flex items-center font-medium gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUserHandler(user.id)}
                    >
                      <Trash2 />
                      Delete
                    </Button>{" "}
                    <UserEditModal user={user} onUserUpdate={loadUsersData} />
                    <UserIcon className="w-5 h-5" /> {user.name}{" "}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          <TableFooter className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePaginationPrevious}
                    className={
                      currentPage === 1
                        ? "opacity-50 pointer-events-none"
                        : "hover:cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    className={
                      !hasNextPage
                        ? "opacity-10 pointer-events-none"
                        : "hover:cursor-pointer"
                    }
                    onClick={handlePaginationNext}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default UsersTable;
