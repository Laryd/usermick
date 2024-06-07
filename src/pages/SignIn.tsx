import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BottomGradient, LabelInputContainer } from "./SignUp";
import { NavBar } from "@/components/NavBar";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/components/UsersTable";
import { useNavigate } from "react-router-dom";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type SignInFormData = z.infer<typeof SignInSchema>;

export default function SignIn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInFormData, string>>
  >({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    const authtoken = localStorage.getItem("token");
    setIsLoggedIn(!!authtoken);
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      SignInSchema.parse(formData);
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true); // Update isLoggedIn state
      navigate("/"); // Navigate to the home page
      toast({
        variant: "default",
        title: "login was successful",
        description: "You were successfully logged in",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0] as keyof SignInFormData] = curr.message;
          return acc;
        }, {} as Partial<Record<keyof SignInFormData, string>>);
        setErrors(fieldErrors);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! login Failed.",
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
          Login to <span className="text-blue-400">UserMick</span>
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="johndoe@gmail.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
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
          <button
            className="bg-gradient-to-br relative group/btn from-blue-500 dark:from-zinc-900 dark:to-blue-900 to-blue-400 block dark:bg-blue-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
          >
            Login &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </>
  );
}
