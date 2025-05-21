import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Products from '../components/Products';
import { CartProvider } from '../contexts/CartContext';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

const mockProducts = [
  { id: 1, name: 'Product 1', description: 'Description 1', price: 10.99 },
  { id: 2, name: 'Product 2', description: 'Description 2', price: 20.99 },
];

const renderWithProvider = (ui) => {
  return render(
    <CartProvider>
      {ui}
    </CartProvider>
  );
};

describe('Products Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('displays loading state initially', () => {
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({ 
        ok: true,
        json: () => Promise.resolve(mockProducts)
      }), 100))
    );
    
    renderWithProvider(<Products />);
    
    // Assert 29
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  test('displays products after loading', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );
    
    renderWithProvider(<Products />);
    
    await waitFor(() => {
      // Assert 30
      expect(screen.getByText('Available Products')).toBeInTheDocument();
      // Assert 31
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      // Assert 32
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      // Assert 33
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      // Assert 34
      expect(screen.getByText('Description 2')).toBeInTheDocument();
      // Assert 35
      expect(screen.getByText('$10.99')).toBeInTheDocument();
      // Assert 36
      expect(screen.getByText('$20.99')).toBeInTheDocument();
    });
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error('API error'))
    );
    
    renderWithProvider(<Products />);
    
    await waitFor(() => {
      // Assert 37
      expect(screen.getByText('Failed to fetch products. Please try again later.')).toBeInTheDocument();
    });
  });

  test('adds product to cart when add to cart button is clicked', async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts)
      })
    );
    
    renderWithProvider(
      <>
        <Products />
        <TestComponent />
      </>
    );
    
    await waitFor(() => {
      const addToCartButtons = screen.getAllByText('Add to Cart');
      fireEvent.click(addToCartButtons[0]);
      
      // Assert 38
      expect(screen.getByTestId('cart-length').textContent).toBe('1');
      // Assert 39
      expect(screen.getByTestId('total-items').textContent).toBe('1');
    });
  });
});
