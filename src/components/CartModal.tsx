"use client";

import Image from "next/image";
import { useCartStore } from "@/hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";
import { currentCart } from "@wix/ecom";
import PayPalButton from "./PayPalButton";
import { useRouter } from "next/navigation";

interface CartModalProps {
  handleCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartModal = ({ handleCartOpen }: CartModalProps) => {
  const router = useRouter();
  const wixClient = useWixClient();
  const { cart, isLoading, removeItem, getCart } = useCartStore();

  const handleCheckout = async () => {
    try {
      const checkout =
        await wixClient.currentCart.createCheckoutFromCurrentCart({
          channelType: currentCart.ChannelType.WEB,
        });

      const { redirectSession } =
        await wixClient.redirects.createRedirectSession({
          ecomCheckout: { checkoutId: checkout.checkoutId },
          callbacks: {
            postFlowUrl: window.location.origin,
            thankYouPageUrl: `${window.location.origin}/success`,
          },
        });

      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      handleCartOpen((prev) => !prev);
      router.push(`/success?orderId=${details.id}`);
    } catch (err) {
      console.error("Failed to clear cart after payment:", err);
    }
  };

  const isCartEmpty = !cart.lineItems || cart.lineItems.length === 0;

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
      {isCartEmpty ? (
        <div>
          <p className="text-md">Cart 🛒 is Empty</p>
          <p className="text-sm">Please add some products! 🤪</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl">Shopping Cart</h2>
          {/* LIST */}
          <div className="flex flex-col gap-8">
            {/* ITEM */}
            {cart.lineItems.map((item) => (
              <div className="flex gap-4" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(
                      item.image,
                      72,
                      96,
                      {}
                    )}
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* TOP */}
                  <div>
                    {/* TITLE */}
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold">
                        {item.productName?.original}
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        ${item.price?.amount}
                      </div>
                    </div>
                    {/* DESC */}
                    <div className="text-sm text-gray-500">
                      {item.availability?.status}
                    </div>
                  </div>
                  {/* BOTTOM */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className="text-blue-500"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(wixClient, item._id!)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* BOTTOM */}
          <div>
            <div className="flex items-center justify-between font-semibold">
              <span>Subtotal</span>
              <span>${cart.subtotal.amount}</span>
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                View Cart
              </button>
              <div className="flex items-center justify-center">
                <PayPalButton
                  amount={cart.subtotal.amount}
                  onSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
