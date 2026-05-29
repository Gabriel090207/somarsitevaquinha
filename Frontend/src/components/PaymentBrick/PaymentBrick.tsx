import {
  CardPayment,
} from "@mercadopago/sdk-react";

export function PaymentBrickComponent() {

  const initialization = {
    amount: 10,
  };

  const onSubmit = async (
    formData: any
  ) => {

    console.log(formData);
  };

  return (
    <CardPayment
      initialization={initialization}
      onSubmit={onSubmit}
    />
  );
}