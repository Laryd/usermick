import { useState, FormEvent, ReactNode, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { NavBar } from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/components/UsersTable";
import { useNavigate } from "react-router-dom";

const SignUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    telephone: z.string().min(1, { message: "Telephone is required" }),
    location: z.string().min(1, { message: "Location is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password must be at least 6 characters" }),
    isAdmin: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof SignUpSchema>;

export default function SignUp() {
    const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    username: "",
    email: "",
    telephone: "",
    location: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
   useEffect(() => {
     const authtoken = localStorage.getItem("token");
     setIsLoggedIn(!!authtoken);
     if (isLoggedIn) {
       navigate("/");
     }
   }, [isLoggedIn, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      SignUpSchema.parse(formData);
      const response = await axios.post(`${API_URL}/auth/signup`, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        telephone: formData.telephone,
        location: formData.location,
        isAdmin: formData.isAdmin,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true); // Update isLoggedIn state
      navigate("/"); // Navigate to the home page
      toast({
        variant: "default",
        title: "Sign up succesful",
        description: "You have successfully signed up.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0] as keyof SignUpFormData] = curr.message;
          return acc;
        }, {} as Partial<Record<keyof SignUpFormData, string>>);
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Sign up Failed.",
          description: "There was a problem with your request.",
        });
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Sign Up to <span className="text-blue-400">UserMick</span>
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="john_doe"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && (
                <p className="text-red-500">{errors.username}</p>
              )}
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              name="telephone"
              placeholder="123-456-7890"
              type="text"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
            {errors.telephone && (
              <p className="text-red-500">{errors.telephone}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="New York, NY"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required
            />
            {errors.location && (
              <p className="text-red-500">{errors.location}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input
              id="confirmpassword"
              name="confirmPassword"
              placeholder="••••••••"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-blue-500 dark:from-zinc-900 dark:to-blue-900 to-blue-400 block dark:bg-blue-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </>
  );
}

export const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export const LabelInputContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
