import Skeleton from "@/components/Skeleton";
import SuccessPage from "@/components/SuccessComp";
import { Suspense } from "react";

const Success = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <SuccessPage />
    </Suspense>
  );
};

export default Success;
