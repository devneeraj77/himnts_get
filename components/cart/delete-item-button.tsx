'use client';

import type { CartItem } from '@/lib/shopify/types';
import { useActionState } from 'react';
import { XIcon } from 'lucide-react';

// Define CartState type for valid states
type CartState = "Missing cart ID" | "Error fetching cart" | "Item not found in cart" | "Error removing item from cart" | null | undefined;

// Define the UpdateType for possible actions
type UpdateType = 'plus' | 'minus' | 'delete';

// Define the interface for optimistic update function
interface OptimisticUpdateFunction {
  (merchandiseId: string, updateType: UpdateType): void;
}

// Define the interface for the removeItem function's parameters and return type
interface RemoveItemAction {
  (state: CartState, merchandiseId: string): Promise<CartState>;
}

// Define the interface for the DeleteItemButton props
interface DeleteItemButtonProps {
  item: CartItem;
  optimisticUpdate: OptimisticUpdateFunction;
}

// The removeItem function that handles state changes
const removeItem: RemoveItemAction = async (
  state: CartState, // The current state passed by the action
  merchandiseId: string // The ID of the merchandise to be removed
): Promise<CartState> => {
  // If no merchandise ID is provided, return an error state
  if (!merchandiseId) {
    return "Missing cart ID"; // Example state
  }

  try {
    // Simulate the item removal process (e.g., remove from cart)
    console.log(`Removing item with ID: ${merchandiseId}`);
    return null; // Return null on success (can be replaced with other valid states)
  } catch (error) {
    console.error('Error removing item from cart:', error); // Log the error to the console
    return "Error removing item from cart"; // Return error state in case of failure
  }
};

// The DeleteItemButton component where the removeItem function is used
export function DeleteItemButton({
  item,
  optimisticUpdate
}: DeleteItemButtonProps) {
  // Correctly type the useActionState hook and ensure it works with removeItem
  const [message, formAction, isPending]: [
    CartState, // The current state (could be any of the defined CartState values)
    (state: CartState, merchandiseId: string) => Promise<CartState>, // The action dispatcher function
    boolean // The loading state, whether the action is in progress
  ] = useActionState(removeItem, null);

  const merchandiseId = item.merchandise.id;

  // A helper function to call formAction with the correct arguments
  const actionWithVariant = (state: CartState, merchandiseId: string) => {
    return formAction(state, merchandiseId); // Ensure it's called with both arguments
  };

  return (
    <form
      action={async () => {
        // Optimistic update call
        optimisticUpdate(merchandiseId, 'delete'); 
        // Call actionWithVariant to update the state
        await actionWithVariant(null, merchandiseId); 
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {isPending ? "Removing..." : message} {/* Show loading or message */}
      </p>
    </form>
  );
}
