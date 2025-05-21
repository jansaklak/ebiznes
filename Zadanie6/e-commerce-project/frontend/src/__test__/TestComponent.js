// Create a file src/__tests__/TestComponent.js
import React from 'react';
import { useCart } from '../contexts/CartContext';

export const TestComponent = () => {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getTotalItems,
    getTotalPrice 
  } = useCart();
  
  return (
    <div>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <button 
        data-testid="add-item" 
        onClick={() => addToCart({ id: 1, name: 'Test Product', price: 10.99 })}
      >
        Add Item
      </button>
      <button 
        data-testid="remove-item" 
        onClick={() => removeFromCart(1)}
      >
        Remove Item
      </button>
      <button 
        data-testid="update-quantity" 
        onClick={() => updateQuantity(1, 3)}
      >
        Update Quantity
      </button>
      <button 
        data-testid="clear-cart" 
        onClick={clearCart}
      >
        Clear Cart
      </button>
      {cart.map(item => (
        <div key={item.id} data-testid={`item-${item.id}`}>
          {item.name} - Quantity: {item.quantity}
        </div>
      ))}
    </div>
  );
};