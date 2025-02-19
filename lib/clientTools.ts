import { ClientToolImplementation } from 'ultravox-client';

// Client-implemented tool for Order Details
export const updateOrderTool: ClientToolImplementation = (parameters) => {
  const { orderDetailsData } = parameters;
  console.debug("Received order details update:", orderDetailsData);

  if (typeof window !== "undefined") {
    const event = new CustomEvent("orderDetailsUpdated", {
      detail: orderDetailsData
    });
    window.dispatchEvent(event);
  }

  return "Updated the order details.";
};
