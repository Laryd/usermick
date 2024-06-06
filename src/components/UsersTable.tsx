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
import { RotateCw, Search, Trash2, UserIcon } from "lucide-react";

interface User {
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

  useEffect(() => {
    loadUsersData();
  }, []);

  async function loadUsersData() {
    try {
      const response = await axios.get<User[]>(
        "https://myjsonserver-o9en.onrender.com/users"
      );
      setUsers(response.data);
    } catch (err) {
      console.log("Error fetching users:", err);
    }
  }
  const searchHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<User[]>(
        `https://myjsonserver-o9en.onrender.com/users?q=${value}`
      );
      setUsers(response.data);
      setValue("");
    } catch (err) {
      console.log(err);
    }
    return;
  };
  const deleteUserHandler = async (userId: number) => {
    try {
      await axios.delete(
        `https://myjsonserver-o9en.onrender.com/users/${userId}`
      );
      loadUsersData();
    } catch (err) {
      console.log(err, "something went wrong");
    }
  };
  const handleReset = () => {
    setValue("");
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
            <span className="ml-2">Search</span> <Search />
          </Button>
          <Button onClick={() => handleReset()}>
            <span className="ml-2">Reset</span> <RotateCw />
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
                      size={"sm"}
                      onClick={() => deleteUserHandler(user.id)}
                    >
                      <Trash2 />
                      Delete
                    </Button>{" "}
                    <UserIcon className="w-5 h-5" /> {user.name}{" "}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          <TableFooter></TableFooter>
        </Table>
      </div>
    </div>
  );
};



export default UsersTable;
