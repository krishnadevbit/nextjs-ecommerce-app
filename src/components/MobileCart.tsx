"use client";
import React, { useEffect, useState } from "react";
import CartModal from "./CartModal";
import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";

const MobileCart = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, counter, getCart } = useCartStore();
  const wixClient = useWixClient();

  useEffect(() => {
    getCart(wixClient);
  }, [wixClient, getCart]);
  return (
    <>
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-krishdev rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModal handleCartOpen={setIsCartOpen} />};
    </>
  );
};

export default MobileCart;
