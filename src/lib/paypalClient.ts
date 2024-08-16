export const getAccessToken = async () => {
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
  if (!response.ok) {
    throw new Error("Failed to fetch access token");
  }
  const data = await response.json();
  return data.access_token;
};

export const fetchOrderDetails = async (orderId: string, token: string) => {
  const response = await fetch(
    `https://api.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return await response.json();
};
