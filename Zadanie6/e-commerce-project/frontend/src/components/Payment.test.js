import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Payment from '../components/Payment';
import { CartProvider } from '../contexts/CartContext';
import '@testing-library/jest-dom';
import TestComponent from '../__test__/TestComponent';


// Mock fetch
global.fetch = jest.fn();

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

describe('Payment Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockedNavigate.mockClear();
  });

  test('displays empty cart message when cart is empty', () => {
    renderWithProviders(<Payment />);
    
    // Assert 40
    expect(screen.getByText('Payment')).toBeInTheDocument();
    // Assert 41
    expect(screen.getByText('Your cart is empty. Add some products before proceeding to payment.')).toBeInTheDocument();
  });

  test('displays payment form when cart has items', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Payment />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    // Assert 42
    expect(screen.getByText('Complete Your Purchase')).toBeInTheDocument();
    // Assert 43
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    // Assert 44
    expect(screen.getByText('Test Product x 1')).toBeInTheDocument();
    // Assert 45
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    // Assert 46
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    // Assert 47
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
    // Assert 48
    expect(screen.getByLabelText('City')).toBeInTheDocument();
    // Assert 49
    expect(screen.getByLabelText('ZIP Code')).toBeInTheDocument();
    // Assert 50
    expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
    // Assert 51
    expect(screen.getByLabelText('Expiry Date')).toBeInTheDocument();
    // Assert 52
    expect(screen.getByLabelText('CVV')).toBeInTheDocument();
  });

  test('updates form fields when user types', () => {
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Payment />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    // Assert 53
    expect(nameInput.value).toBe('John Doe');
  });

  test('submits order and shows success message', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ orderId: '12345' })
      })
    );
    
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Payment />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    // Fill in form
    fireEvent.change(screen.getByLabelText('Full Name'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Address'), { 
      target: { value: '123 Main St' } 
    });
    fireEvent.change(screen.getByLabelText('City'), { 
      target: { value: 'Anytown' } 
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), { 
      target: { value: '12345' } 
    });
    fireEvent.change(screen.getByLabelText('Card Number'), { 
      target: { value: '4111 1111 1111 1111' } 
    });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { 
      target: { value: '12/25' } 
    });
    fireEvent.change(screen.getByLabelText('CVV'), { 
      target: { value: '123' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Complete Purchase'));
    
    await waitFor(() => {
      // Assert 54
      expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
      // Assert 55
      expect(screen.getByText('Thank you for your order. You will be redirected to the home page shortly.')).toBeInTheDocument();
      
      // Assert 56 - check if API was called with the correct data
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/orders', expect.any(Object));
      
      // Verify timeout was set to redirect
      setTimeout(() => {
        // Assert 57
        expect(mockedNavigate).toHaveBeenCalledWith('/');
      }, 3000);
    });
  });

  test('shows error message when payment fails', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API error'))
    );
    
    renderWithProviders(
      <>
        <TestComponent /> {/* Add items to cart */}
        <Payment />
      </>
    );
    
    const testComponent = screen.getByTestId('add-item');
    fireEvent.click(testComponent);
    
    // Fill in form (minimal fields for test)
    fireEvent.change(screen.getByLabelText('Full Name'), { 
      target: { value: 'John Doe' } 
    });
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'john@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('Address'), { 
      target: { value: '123 Main St' } 
    });
    fireEvent.change(screen.getByLabelText('City'), { 
      target: { value: 'Anytown' } 
    });
    fireEvent.change(screen.getByLabelText('ZIP Code'), { 
      target: { value: '12345' } 
    });
    fireEvent.change(screen.getByLabelText('Card Number'), { 
      target: { value: '4111 1111 1111 1111' } 
    });
    fireEvent.change(screen.getByLabelText('Expiry Date'), { 
      target: { value: '12/25' } 
    });
    fireEvent.change(screen.getByLabelText('CVV'), { 
      target: { value: '123' } 
    });
    
    // Submit form
    fireEvent.click(screen.getByText('Complete Purchase'));
    
    await waitFor(() => {
      // Assert 58
      expect(screen.getByText('Payment processing failed. Please try again.')).toBeInTheDocument();
    });
  });
});