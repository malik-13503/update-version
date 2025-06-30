import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, Mail, Gamepad2, Video, CheckCircle, Lock, Unlock, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

export default function RegistrationForm({ videoWatched }: RegistrationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
      // TODO: Redirect to game page
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
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 6) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
    }
    return cleaned;
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[hsl(16,100%,64%)] to-[hsl(16,85%,69%)] rounded-full mb-6">
              <Trophy className="text-white text-3xl" size={36} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[hsl(225,47%,32%)] mb-4">
              Ready to Win <span className="text-[hsl(16,100%,64%)]">$5 Million</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-8">Enter your details below to unlock the scratch & win game!</p>
            
            {/* Video Watch Status */}
            <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full mb-8 shadow-lg ${
              videoWatched 
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
            }`}>
              {videoWatched ? (
                <>
                  <CheckCircle size={24} />
                  <span className="font-bold text-lg">Video Complete! Ready to Play!</span>
                  <Sparkles size={20} className="animate-pulse" />
                </>
              ) : (
                <>
                  <Video size={24} />
                  <span className="font-bold text-lg">Please Watch the Video First</span>
                </>
              )}
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-lg font-bold text-[hsl(225,47%,32%)] mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(16,100%,64%)] to-[hsl(16,85%,69%)] rounded-full flex items-center justify-center mr-3">
                          <User className="text-white" size={20} />
                        </div>
                        Full Name
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!videoWatched}
                            placeholder="Enter your full name"
                            className={`h-14 text-lg pl-6 pr-14 rounded-xl border-2 focus:border-[hsl(16,100%,64%)] transition-all duration-300 ${
                              !videoWatched 
                                ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                                : 'bg-white border-gray-300 hover:border-[hsl(16,85%,69%)]'
                            }`}
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          {videoWatched ? 
                            <Unlock className="text-green-500" size={20} /> : 
                            <Lock className="text-gray-400" size={20} />
                          }
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
                      <FormLabel className="flex items-center text-lg font-bold text-[hsl(225,47%,32%)] mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(227,100%,65%)] to-[hsl(227,85%,70%)] rounded-full flex items-center justify-center mr-3">
                          <Phone className="text-white" size={20} />
                        </div>
                        Phone Number
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={!videoWatched}
                            placeholder="(310) 295-6355"
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              field.onChange(formatted);
                            }}
                            className={`h-14 text-lg pl-6 pr-14 rounded-xl border-2 focus:border-[hsl(227,100%,65%)] transition-all duration-300 ${
                              !videoWatched 
                                ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                                : 'bg-white border-gray-300 hover:border-[hsl(227,85%,70%)]'
                            }`}
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          {videoWatched ? 
                            <Unlock className="text-green-500" size={20} /> : 
                            <Lock className="text-gray-400" size={20} />
                          }
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
                      <FormLabel className="flex items-center text-lg font-bold text-[hsl(225,47%,32%)] mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[hsl(16,100%,64%)] via-[hsl(227,100%,65%)] to-[hsl(16,85%,69%)] rounded-full flex items-center justify-center mr-3">
                          <Mail className="text-white" size={20} />
                        </div>
                        Email Address
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!videoWatched}
                            placeholder="your.email@example.com"
                            className={`h-14 text-lg pl-6 pr-14 rounded-xl border-2 focus:border-[hsl(16,100%,64%)] transition-all duration-300 ${
                              !videoWatched 
                                ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                                : 'bg-white border-gray-300 hover:border-[hsl(16,85%,69%)]'
                            }`}
                          />
                        </FormControl>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          {videoWatched ? 
                            <Unlock className="text-green-500" size={20} /> : 
                            <Lock className="text-gray-400" size={20} />
                          }
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={!videoWatched || registerMutation.isPending}
                    className={`w-full h-16 text-xl font-black rounded-xl shadow-2xl transition-all duration-300 ${
                      videoWatched 
                        ? 'bg-gradient-to-r from-[hsl(16,100%,64%)] via-[hsl(16,85%,69%)] to-[hsl(227,100%,65%)] hover:from-[hsl(16,85%,69%)] hover:via-[hsl(16,100%,64%)] hover:to-[hsl(227,85%,70%)] text-white transform hover:scale-105 hover:shadow-3xl' 
                        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {registerMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          <span>REGISTERING...</span>
                        </>
                      ) : videoWatched ? (
                        <>
                          <Gamepad2 size={24} />
                          <span>PLAY SCRATCH & WIN GAME NOW!</span>
                          <Sparkles size={20} className="animate-pulse" />
                        </>
                      ) : (
                        <>
                          <Lock size={24} />
                          <span>COMPLETE VIDEO TO UNLOCK GAME</span>
                        </>
                      )}
                    </div>
                  </Button>
                </div>
                
                {/* Prize Highlight */}
                {videoWatched && (
                  <div className="text-center bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 p-4 rounded-xl mt-6">
                    <p className="font-bold text-lg">
                      🎉 You're just one click away from winning up to $5 Million! 🎉
                    </p>
                  </div>
                )}
                
                {/* Terms & Conditions */}
                <div className="text-center text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
                  <p>By registering, you agree to our 
                    <a href="#" className="text-[hsl(227,100%,65%)] hover:underline font-semibold"> Terms & Conditions</a> 
                    {' '}and{' '}
                    <a href="#" className="text-[hsl(227,100%,65%)] hover:underline font-semibold">Privacy Policy</a>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    🔒 Your information is secure and will never be shared with third parties
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
