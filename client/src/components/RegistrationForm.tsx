import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import {
  User,
  Phone,
  Mail,
  Gamepad2,
  Video,
  CheckCircle,
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  videoWatched: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface RegistrationFormProps {
  videoWatched: boolean;
}

export default function RegistrationForm({
  videoWatched,
}: RegistrationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      videoWatched: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/register", {
        ...data,
        videoWatched,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "Redirecting to the game...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
      // Redirect to game page after a short delay
      setTimeout(() => {
        setLocation("/game");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!videoWatched) {
      toast({
        title: "Video Required",
        description: "Please watch the video first to unlock registration",
        variant: "destructive",
      });
      return;
    }
    registerMutation.mutate(data);
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#F76D46] rounded-full opacity-5"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#2C5CDC] rounded-full opacity-5"></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-yellow-300 rounded-full opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-gradient-to-r from-[#F76D46] to-[#2C5CDC] rounded-full mb-8 shadow-xl">
              <Trophy className="text-white" size={40} />
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-[#2C5CDC] mb-4"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Ready to Play?
            </h2>
            <p
              className="text-lg text-gray-600 mb-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Enter your details below to unlock the scratch & win game!
            </p>

            {/* Video Watch Status */}
            <div
              className={`inline-flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full mb-6 ${
                videoWatched
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {videoWatched ? <CheckCircle size={18} className="flex-shrink-0" /> : <Video size={18} className="flex-shrink-0" />}
              <span
                className="font-semibold text-sm md:text-base text-center"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {videoWatched
                  ? "Video complete! You can now register"
                  : "Please watch the video first to unlock registration"}
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-gradient-to-br from-[#2C5CDC] to-[#F76D46] rounded-2xl shadow-2xl p-2">
            <div className="bg-white rounded-xl p-8 shadow-inner relative">
              {/* Play Now badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#F76D46] to-[#2C5CDC] text-white px-6 py-2 rounded-full shadow-lg">
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Play Now
                </span>
              </div>

              {/* Subtle corner accents */}
              <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-bl from-[#F76D46]/10 to-transparent rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-tr from-[#2C5CDC]/10 to-transparent rounded-full"></div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="flex items-center text-sm font-bold text-[#2C5CDC]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <User className="mr-2 text-[#F76D46]" size={16} />
                          Full Name
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!videoWatched}
                              placeholder="Enter your full name"
                              className={`pr-10 ${!videoWatched ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {videoWatched ? (
                              <Unlock className="text-green-500" size={16} />
                            ) : (
                              <Lock className="text-gray-400" size={16} />
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="flex items-center text-sm font-bold text-[#2C5CDC]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <Phone className="mr-2 text-[#F76D46]" size={16} />
                          Phone Number
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!videoWatched}
                              placeholder="(310) 295-6355"
                              onChange={(e) => {
                                const formatted = formatPhoneNumber(
                                  e.target.value,
                                );
                                field.onChange(formatted);
                              }}
                              className={`pr-10 ${!videoWatched ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {videoWatched ? (
                              <Unlock className="text-green-500" size={16} />
                            ) : (
                              <Lock className="text-gray-400" size={16} />
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="flex items-center text-sm font-bold text-[#2C5CDC]"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <Mail className="mr-2 text-[#F76D46]" size={16} />
                          Email Address
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              disabled={!videoWatched}
                              placeholder="your.email@example.com"
                              className={`pr-10 ${!videoWatched ? "bg-gray-200 cursor-not-allowed" : "bg-white"}`}
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            />
                          </FormControl>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {videoWatched ? (
                              <Unlock className="text-green-500" size={16} />
                            ) : (
                              <Lock className="text-gray-400" size={16} />
                            )}
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="relative">
                    {videoWatched && (
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#F76D46] to-[#2C5CDC] rounded-lg blur opacity-30"></div>
                    )}
                    <Button
                      type="submit"
                      disabled={!videoWatched || registerMutation.isPending}
                      className={`relative w-full bg-gradient-to-r from-[#F76D46] to-[#2C5CDC] hover:from-[#F76D46] hover:to-[#2C5CDC] text-white font-black py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-2xl text-lg ${
                        !videoWatched
                          ? "from-gray-400 to-gray-500 cursor-not-allowed transform-none"
                          : "hover:shadow-xl"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3">
                        <Video size={20} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
                        <span className="font-black text-xs sm:text-sm md:text-lg lg:text-xl text-center leading-tight px-1">
                          {registerMutation.isPending
                            ? "REGISTERING..."
                            : videoWatched
                              ? "REGISTER TO PLAY"
                              : "WATCH VIDEO TO UNLOCK"}
                        </span>
                        <Trophy size={20} className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" />
                      </div>
                    </Button>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="text-center text-sm text-gray-600 mt-4">
                    <p style={{ fontFamily: "Montserrat, sans-serif" }}>
                      By registering, you agree to our
                      <a href="#" className="text-[#2C5CDC] hover:underline">
                        {" "}
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#2C5CDC] hover:underline">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
