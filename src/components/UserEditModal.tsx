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
import { User } from "./UsersTable";
import { z } from "zod";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { Edit, Loader2 } from "lucide-react";

// Define the Zod schema for form validation
const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  telephone: z.string().min(10, { message: "Telephone number is required" }),
  location: z.string().min(1, { message: "Location is required" }),
});

// Infer the type from the Zod schema
type UserFormData = z.infer<typeof userSchema>;

export function UserEditModal({user,
  onUserUpdate,
}: {
  user: User;
  onUserUpdate: () => void;
}) {
      
    //set initial form date
    const [initialFormData] = useState<UserFormData>({
      name: user.name,
      username: user.username,
      email: user.email,
      telephone: user.telephone,
      location: user.location,
    });
  // State for form data, initialized with the user data
  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    username: user.username,
    email: user.email,
    telephone: user.telephone,
    location: user.location,
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
    const isEdited =
      JSON.stringify(initialFormData) !== JSON.stringify(formData);
    setIsFormEdited(isEdited);
  }, [formData, initialFormData]);

  // Handle changes to the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Validate the form data using the Zod schema
      userSchema.parse(formData);
      // If validation passes, submit the form data
      setSending(true);
      console.log(formData);
      await axios.put<User>(
        `https://myjsonserver-o9en.onrender.com/users/${user.id}`,
        {
          ...formData,
          id: user.id,
          isAdmin: user.isAdmin,
        }
      );
      //show message if successful
      toast({
        variant: "default",
        title: "Update Succesful",
        description: "The user details were updated successfuly",
      });
      setSending(false);
      onUserUpdate()
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
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-1"><Edit className="w-4 h4"/>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Make changes to the user here
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={sending || !isFormEdited}>
              {sending ? <Loader2 className="animate-spin" /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
