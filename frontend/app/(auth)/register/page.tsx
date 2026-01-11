"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft 
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useRegister } from "@/hooks/useRegister";

/**
 * Friendly error mapping for common Better Auth/Prisma codes
 */
const mapErrorToMessage = (error: string | null) => {
  if (!error) return null;
  if (error.includes("USER_ALREADY_EXISTS")) return "An account with this email already exists. Try logging in.";
  if (error.includes("INTERNAL_SERVER_ERROR")) return "Our systems are currently busy. Please try again in a moment.";
  return "Could not create account. Please check your details and try again.";
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error: rawError } = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const errorMessage = useMemo(() => mapErrorToMessage(rawError), [rawError]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || isSuccess) return;

    const success = await register(email, password);
    if (success) {
      setIsSuccess(true);
      // Brief delay to allow the user to see the success state (improves trust)
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-[#020617]">
      
      {/* Navigation Fallback */}
      <Link 
        href="/" 
        className="mb-8 flex items-center text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
      </Link>

      <Card className="w-full max-w-md border-slate-200 shadow-xl dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create your Ledger
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Start structuring your financial data with bank-grade precision.
          </p>
        </CardHeader>
        
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-semibold">Account Created!</h3>
              <p className="text-sm text-slate-500">Redirecting you to the secure login...</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={loading}
                  aria-describedby="email-hint"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                  aria-describedby="password-hint"
                />
                <p id="password-hint" className="text-[11px] text-slate-400">
                  Must be at least 8 characters.
                </p>
              </div>

              {errorMessage && (
                <Alert variant="destructive" className="py-2" aria-live="polite">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Encrypting & Saving...
                  </>
                ) : (
                  "Create Free Account"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 p-6 dark:border-slate-800">
          <div className="flex items-center justify-center text-xs text-slate-400">
            <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" />
            Your data is protected by encryption.
          </div>
          
          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-600 hover:underline">
              Log in here
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      <p className="mt-8 text-center text-[11px] text-slate-400 max-w-[280px]">
        By registering, you agree to our Terms of Service and Privacy Policy. Vessify Assets is SOC2 Type II compliant.
      </p>
    </div>
  );
}