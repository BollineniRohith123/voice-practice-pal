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

// Client-implemented tool for Product Highlighting
export const highlightProductTool: ClientToolImplementation = (parameters) => {
  const { productName, action } = parameters;
  console.debug(`Highlighting product: ${productName}, action: ${action}`);

  // Normalize the product name to match the display names
  const normalizedName = productName.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (typeof window !== "undefined") {
    const event = new CustomEvent("productHighlight", {
      detail: { 
        productName: normalizedName, 
        action 
      }
    });
    window.dispatchEvent(event);
  }

  return `${action === 'show' ? 'Highlighted' : 'Unhighlighted'} ${normalizedName}`;
};
