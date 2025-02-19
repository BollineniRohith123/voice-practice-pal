import { DemoConfig, ParameterLocation, SelectedTool } from "@/lib/types";

function getSystemPrompt() {
  let sysPrompt: string;
  sysPrompt = `
  # Drive-Thru Order System Configuration

  ## Agent Role
  - Name: Dr. Donut Drive-Thru Assistant
  - Context: Voice-based order taking system with TTS output
  - Current time: ${new Date()}

  ## Menu Items
    # DONUTS
    Pumpkin Spice Iced Doughnut $1.29
    Pumpkin Spice Cake Doughnut $1.29
    Old Fashioned Doughnut $1.29
    Chocolate Iced Doughnut $1.09
    Chocolate Iced Doughnut with Sprinkles $1.09
    Raspberry Filled Doughnut $1.09
    Blueberry Cake Doughnut $1.09
    Strawberry Iced Doughnut with Sprinkles $1.09
    Lemon Filled Doughnut $1.09
    Doughnut Holes $3.99

    # COFFEE & DRINKS
    Pumpkin Spice Coffee $2.59
    Pumpkin Spice Latte $4.59
    Regular Brewed Coffee $1.79
    Decaf Brewed Coffee $1.79
    Latte $3.49
    Cappucino $3.49
    Caramel Macchiato $3.49
    Mocha Latte $3.49
    Caramel Mocha Latte $3.49

  ## Conversation Flow
  1. Greeting -> Order Taking -> Call "updateOrder" Tool -> Order Confirmation -> Payment Direction

  ## Tool Usage Rules
  - You must call the tool "updateOrder" immediately when:
    - User confirms an item
    - User requests item removal
    - User modifies quantity
  - You must call the tool "highlightProduct" when:
    - Discussing a specific menu item with the user
    - Use action "show" when mentioning the product
    - Use action "hide" when moving to a different product
  - Do not emit text during tool calls
  - Validate menu items before calling any tools
  - Use exact menu item names when calling tools

  ## Response Guidelines
  1. Voice-Optimized Format
    - Use spoken numbers ("one twenty-nine" vs "$1.29")
    - Avoid special characters and formatting
    - Use natural speech patterns

  2. Conversation Management
    - Keep responses brief (1-2 sentences)
    - Use clarifying questions for ambiguity
    - Maintain conversation flow without explicit endings
    - Allow for casual conversation

  3. Order Processing
    - Validate items against menu
    - Suggest similar items for unavailable requests
    - Cross-sell based on order composition:
      - Donuts -> Suggest drinks
      - Drinks -> Suggest donuts
      - Both -> No additional suggestions

  4. Standard Responses
    - Off-topic: "Um... this is a Dr. Donut."
    - Thanks: "My pleasure."
    - Menu inquiries: Provide 2-3 relevant suggestions

  5. Order confirmation
    - Call the "updateOrder" tool first
    - Only confirm the full order at the end when the customer is done

  ## Error Handling
  1. Menu Mismatches
    - Suggest closest available item
    - Explain unavailability briefly
  2. Unclear Input
    - Request clarification
    - Offer specific options
  3. Invalid Tool Calls
    - Validate before calling
    - Handle failures gracefully

  ## State Management
  - Track order contents
  - Monitor order type distribution (drinks vs donuts)
  - Maintain conversation context
  - Remember previous clarifications    
  `;

  sysPrompt = sysPrompt.replace(/"/g, '\"')
    .replace(/\n/g, '\n');

  return sysPrompt;
}

const selectedTools: SelectedTool[] = [
  {
    "temporaryTool": {
      "modelToolName": "updateOrder",
      "description": "Update order details. Used any time items are added or removed or when the order is finalized. Call this any time the user updates their order.",      
      "dynamicParameters": [
        {
          "name": "orderDetailsData",
          "location": ParameterLocation.BODY,
          "schema": {
            "description": "An array of objects contain order items.",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": { "type": "string", "description": "The name of the item to be added to the order." },
                "quantity": { "type": "number", "description": "The quantity of the item for the order." },
                "specialInstructions": { "type": "string", "description": "Any special instructions that pertain to the item." },
                "price": { "type": "number", "description": "The unit price for the item." },
              },
              "required": ["name", "quantity", "price"]
            }
          },
          "required": true
        },
      ],
      "client": {}
    }
  },
  {
    "temporaryTool": {
      "modelToolName": "highlightProduct",
      "description": "Highlight or unhighlight a product in the UI. Use this when discussing specific menu items.",
      "dynamicParameters": [
        {
          "name": "productName",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "string",
            "description": "The name of the product to highlight"
          },
          "required": true
        },
        {
          "name": "action",
          "location": ParameterLocation.BODY,
          "schema": {
            "type": "string",
            "enum": ["show", "hide"],
            "description": "Whether to show or hide the highlight"
          },
          "required": true
        }
      ],
      "client": {}
    }
  }
];

export const demoConfig: DemoConfig = {
  title: "Dr. Donut",
  overview: "This agent has been prompted to facilitate orders at a fictional drive-thru called Dr. Donut.",
  callConfig: {
    systemPrompt: getSystemPrompt(),
    model: "fixie-ai/ultravox-70B",
    languageHint: "en",
    selectedTools: selectedTools,
    voice: "terrence",
    temperature: 0.4
  }
};

export default demoConfig;