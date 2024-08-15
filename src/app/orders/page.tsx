import OrderPage from "@/components/OrdersPage";
import Skeleton from "@/components/Skeleton";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <OrderPage />
    </Suspense>
  );
};

export default page;
