"use client";

import { useState } from "react";
import { SignIn1 } from "@/components/ui/modern-stunning-sign-in";

/**
 * Visual demo only — wired form without live OTP (alerts on submit).
 */
const Demo = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#121212] px-4 py-12">
      <SignIn1
        name={name}
        email={email}
        otp={otp}
        otpSent={otpSent}
        error={error}
        loading={loading}
        onNameChange={setName}
        onEmailChange={setEmail}
        onOtpChange={setOtp}
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          if (!name.trim() || !email.trim()) {
            setError("Please enter name and email.");
            return;
          }
          if (!otpSent) {
            setLoading(true);
            window.setTimeout(() => {
              setOtpSent(true);
              setLoading(false);
            }, 400);
            return;
          }
          if (!otp.trim()) {
            setError("Enter the demo code.");
            return;
          }
          alert("Sign in successful! (Demo)");
        }}
      />
    </div>
  );
};

export { Demo };
