"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Confetti from "react-confetti";

interface SuccessPageProps {
  params: {
    successId: string;
  };
}

const SuccessPage = ({ params }: SuccessPageProps) => {
  const router = useRouter();
  useEffect(() => {
    if (!params.successId) return;

    const timer = setTimeout(() => {
      router.push(`/orders/${params.successId}`);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [params.successId, router]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-[calc(100vh-180px)]">
      <Confetti width={2000} height={1000} />
      <h1 className="text-5xl text-green-700">Order Successfully Placed 🎉</h1>
      <h2 className="text-xl font-medium">
        We sent the invoice to your e-mail
      </h2>
      <h3 className="">You are being redirected to the order page...</h3>
    </div>
  );
};

export default SuccessPage;
