// Cart.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../components/Cart';
import { CartProvider } from '../contexts/CartContext';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const renderWithProviders = (ui) => {
  return render(
    <CartProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </CartProvider>
  );
};

describe('Cart Component', () => {
  test('displays empty cart message when cart is empty', () => {
    renderWithProviders(<Cart />);
    
    // Assert 20
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    // Assert 21
    expect(screen.getByText('Your cart is empty. Add some products!')).toBeInTheDocument();
  });

  test('displays cart items when cart has items', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Cart />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    // Assert 22
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    // Assert 23
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    // Assert 24
    expect(screen.getByText('1')).toBeInTheDocument(); // Quantity
  });

  test('navigates to payment page when checkout button is clicked', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Cart />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    const checkoutButton = screen.getByText('Proceed to Checkout');
    fireEvent.click(checkoutButton);
    
    // Assert 25
    expect(mockedNavigate).toHaveBeenCalledWith('/payment');
  });

  test('updates quantity when + button is clicked', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Cart />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);
    
    // Assert 26
    expect(screen.getByText('2')).toBeInTheDocument(); // Quantity updated
  });

  test('updates quantity when - button is clicked', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Cart />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    // First increase to 2
    const plusButton = screen.getByText('+');
    fireEvent.click(plusButton);
    
    // Then decrease to 1
    const minusButton = screen.getByText('-');
    fireEvent.click(minusButton);
    
    // Assert 27
    expect(screen.getByText('1')).toBeInTheDocument(); // Quantity updated
  });

  test('removes item when remove button is clicked', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Cart />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    // Assert 28
    expect(screen.getByText('Your cart is empty. Add some products!')).toBeInTheDocument();
  });
});