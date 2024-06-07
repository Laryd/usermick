import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { API_URL } from "./UsersTable";
import { z } from "zod";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { Loader2, Plus } from "lucide-react";

// Define the Zod schema for form validation
const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  telephone: z.string().min(10, { message: "Telephone number is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }), // Add password field
});

// Infer the type from the Zod schema
type UserFormData = z.infer<typeof userSchema>;

export function UserAddModal({ onUserUpdate }: { onUserUpdate: () => void }) {
  // State for form data, initialized as empty
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    username: "",
    email: "",
    telephone: "",
    location: "",
    password: "", // Initialize password
  });
  const [sending, setSending] = useState<boolean>(false);
  const { toast } = useToast();
  // State for form validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof UserFormData, string>>
  >({});

  const [isFormEdited, setIsFormEdited] = useState(false);

  // Compare initial form data with current form data
  useEffect(() => {
    const isEdited = Object.values(formData).some((value) => value !== "");
    setIsFormEdited(isEdited);
  }, [formData]);

  // Handle changes to the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        variant: "destructive",
        title: "No token found",
        description: "No token found, cannot add user",
      });
      return;
    }
    e.preventDefault();
    try {
      // Validate the form data using the Zod schema
      userSchema.parse(formData);
      // If validation passes, submit the form data
      setSending(true);
     
      await axios.post(
        `${API_URL}/users`,
        {
          ...formData,
          isAdmin: false, // Default to non-admin user
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Show message if successful
      toast({
        variant: "default",
        title: "User Created Successfully",
        description: "The new user was created successfully",
      });
      setSending(false);
      onUserUpdate();
    } catch (error) {
      // If validation fails, capture and display the errors

      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          if (curr.path.length > 0) {
            const fieldName = curr.path[0] as keyof UserFormData;
            acc[fieldName] = curr.message;
          }
          return acc;
        }, {} as Partial<Record<keyof UserFormData, string>>);
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
      setSending(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1">
          <Plus className="w-4 h4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Form field for name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.name && (
                <p className="text-red-500 col-span-4">{errors.name}</p>
              )}
            </div>
            {/* Form field for username */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.username && (
                <p className="text-red-500 col-span-4">{errors.username}</p>
              )}
            </div>
            {/* Form field for email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.email && (
                <p className="text-red-500 col-span-4 ml-10">{errors.email}</p>
              )}
            </div>
            {/* Form field for telephone */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telephone" className="text-right">
                Phone
              </Label>
              <Input
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.telephone && (
                <p className="text-red-500 col-span-4">{errors.telephone}</p>
              )}
            </div>
            {/* Form field for location */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.location && (
                <p className="text-red-500 col-span-4">{errors.location}</p>
              )}
            </div>
            {/* Form field for password */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="col-span-3"
                disabled={sending}
              />
              {errors.password && (
                <p className="text-red-500 col-span-4">{errors.password}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={sending || !isFormEdited}>
              {sending ? <Loader2 className="animate-spin" /> : "Add User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
