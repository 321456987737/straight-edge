"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BarberSignup from "@/components/signup/BarberSignup";
import CustomerSignup from "@/components/signup/CustomerSignup";

const SignupContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const type = params.get("type") || "customer";

  const handleBack = () => {
    router.push("/");
  };

  return type === "barber"
    ? <BarberSignup onBack={handleBack} />
    : <CustomerSignup onBack={handleBack} />;
};

const SignupPage = () => {
  return (
    <Suspense fallback={<div>Loading signup form...</div>}>
      <SignupContent />
    </Suspense>
  );
};

export default SignupPage;
