"use client";
import { useRouter, useSearchParams } from "next/navigation";
import BarberSignup from "@/components/signup/BarberSignup";
import CustomerSignup from "@/components/signup/CustomerSignup";

const SignupPage = () => {
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

export default SignupPage;
