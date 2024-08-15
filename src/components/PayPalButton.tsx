// @ts-nocheck

import React from "react";
import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
}

const PayPalButton = ({ amount, onSuccess }: PayPalButtonProps) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
      }}
    >
      <PayPalButtons
        style={{
          layout: "vertical", // or "horizontal"
          color: "gold", // options: "gold", "blue", "silver", "white", "black"
          shape: "pill", // options: "rect", "pill"
          label: "buynow", // options: "checkout", "pay", "buynow", "paypal", "installment"
          height: 35, // customize height here
        }}
        fundingSource={FUNDING.PAYPAL}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order?.capture().then((details) => {
            onSuccess(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
