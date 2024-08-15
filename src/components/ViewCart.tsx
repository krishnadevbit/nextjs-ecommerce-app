"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import PayPalButton from "./PayPalButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";

const ViewCart = () => {
  const router = useRouter();
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, getCart } = useCartStore();

  const handlePaymentSuccess = async (details: any) => {
    try {
      const lineItems =
        cart.lineItems?.map((item) => ({
          id: item._id,
          name: item.productName?.original,
          image: item.image,
          quantity: item.quantity,
          price: item.price?.amount,
        })) || [];

      if (lineItems.length > 0) {
        const itemIds: string[] = lineItems
          .map((item) => item.id)
          .filter((id): id is string => !!id);
        await wixClient.currentCart.removeLineItemsFromCurrentCart(itemIds);
      }
      sessionStorage.setItem("orderDetails", JSON.stringify(lineItems));
      await getCart(wixClient);
      router.push(`/success?orderId=${details.id}`);
    } catch (err) {
      console.error("Failed to clear cart after payment:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Items</h1>
      {cart.lineItems?.length ? (
        <>
          <div className="flex flex-col gap-8">
            {cart.lineItems.map((item) => (
              <div className="flex gap-4 border-b py-4" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      72,
                      96,
                      {}
                    )}
                    alt={item.productName?.original || "Product Image"}
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {item.productName?.original}
                    </h3>
                    <div className="text-gray-600">
                      {item.quantity} x ${item.price?.amount}
                    </div>
                  </div>
                  <div className="text-gray-500">
                    {item.availability?.status}
                  </div>
                  <button
                    className="text-blue-500 mt-2"
                    onClick={() => removeItem(wixClient, item._id!)}
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>${cart.subtotal.amount}</span>
          </div>
          <div className="flex items-center justify-center">
            <PayPalButton
              amount={cart.subtotal.amount}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </>
      ) : (
        <div>Cart is empty</div>
      )}
    </div>
  );
};

export default ViewCart;
