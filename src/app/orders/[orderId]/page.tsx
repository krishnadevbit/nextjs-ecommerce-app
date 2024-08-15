"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { media as wixMedia } from "@wix/sdk";
import Skeleton from "@/components/Skeleton";
interface OrdersIdProps {
  params: {
    orderId: string;
  };
}
const getAccessToken = async () => {
  const response = await fetch(
    `https://api.sandbox.paypal.com/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    }
  );
  const data = await response.json();
  return data.access_token;
};

const OrderPage = ({ params }: OrdersIdProps) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!params.orderId) {
        router.push("/404");
        return;
      }
      try {
        const token = await getAccessToken();
        const response = await fetch(
          `https://api.sandbox.paypal.com/v2/checkout/orders/${params.orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    const storedItems = sessionStorage.getItem("orderDetails");
    if (storedItems) {
      setSessionData(true);
      setItems(JSON.parse(storedItems));
    }

    // Handle browser back button
    const handlePopState = () => {
      sessionStorage.removeItem("orderDetails");
      router.replace("/");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [params.orderId, router]);

  const handleContinueShopping = () => {
    sessionStorage.removeItem("orderDetails");
    router.replace("/");
  };

  if (loading) {
    return <Skeleton />;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-GB", options).replace(",", " at");
  };

  const formattedDate = formatDate(order.create_time);

  return (
    <>
      <div className="flex flex-col md:flex-row md:h-[calc(100vh-180px)]">
        {/* Order Items Section */}
        {sessionData && (
          <div className="w-full md:w-1/2 p-4 ">
            <div className="shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Ordered Items</h2>
              <div className="flex flex-wrap gap-4 ">
                {items.map((item) => (
                  <div key={item.id} className="border p-4 rounded shadow-md">
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
                    <h3 className="font-medium text-lg">{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                    <p>Total: ${item.quantity * parseFloat(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Order Details Section */}
        <div className="w-full md:w-1/2 p-4">
          <div className="shadow-lg p-4">
            <h1 className="text-xl font-semibold mb-4">Order Details</h1>
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-medium">Order Id: </span>
                <span>{order.id}</span>
              </div>
              <div>
                <span className="font-medium">Receiver Name: </span>
                <span>
                  {order.payer.name?.given_name} {order.payer.name?.surname}
                </span>
              </div>
              <div>
                <span className="font-medium">Receiver Email: </span>
                <span>{order.payer.email_address}</span>
              </div>
              <div>
                <span className="font-medium">Price: </span>
                <span>${order.purchase_units[0].amount.value}</span>
              </div>
              <div>
                <span className="font-medium">Payment Status: </span>
                <span>{order.status}</span>
              </div>
              <div>
                <span className="font-medium">Order Created On: </span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center">
        Thanks for the Order! 🙌
        <Link
          href="/"
          className="underline-blue text-krishdev leading-tight text-lg"
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Link>
      </div>
    </>
  );
};

export default OrderPage;
