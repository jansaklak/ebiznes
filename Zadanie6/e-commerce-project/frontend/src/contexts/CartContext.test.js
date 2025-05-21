import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import '@testing-library/jest-dom';

// Test component to access cart context
const TestComponent = () => {
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

describe('CartContext', () => {
  test('initializes with an empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    // Assert 1
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    // Assert 2
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    // Assert 3
    expect(screen.getByTestId('total-price').textContent).toBe('0');
  });

  test('adds an item to the cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Assert 4
    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    // Assert 5
    expect(screen.getByTestId('total-items').textContent).toBe('1');
    // Assert 6
    expect(screen.getByTestId('total-price').textContent).toBe('10.99');
    // Assert 7
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
  });

  test('increases quantity when adding the same item', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('add-item'));
    
    // Assert 8
    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    // Assert 9
    expect(screen.getByTestId('total-items').textContent).toBe('2');
    // Assert 10
    expect(screen.getByTestId('total-price').textContent).toBe('21.98');
  });

  test('removes an item from the cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('remove-item'));
    
    // Assert 11
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    // Assert 12
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    // Assert 13
    expect(screen.getByTestId('total-price').textContent).toBe('0');
  });

  test('updates item quantity', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('update-quantity'));
    
    // Assert 14
    expect(screen.getByTestId('total-items').textContent).toBe('3');
    // Assert 15
    expect(screen.getByTestId('total-price').textContent).toBe('32.97');
    // Assert 16
    expect(screen.getByTestId('item-1')).toHaveTextContent('Quantity: 3');
  });

  test('clears the cart', async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );
    
    fireEvent.click(screen.getByTestId('add-item'));
    fireEvent.click(screen.getByTestId('clear-cart'));
    
    // Assert 17
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    // Assert 18
    expect(screen.getByTestId('total-items').textContent).toBe('0');
    // Assert 19
    expect(screen.getByTestId('total-price').textContent).toBe('0');
  });
});