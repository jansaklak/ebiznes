import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock components
jest.mock('./components/Products', () => () => <div data-testid="products-component">Products Component</div>);
jest.mock('./components/Cart', () => () => <div data-testid="cart-component">Cart Component</div>);
jest.mock('./components/Payment', () => () => <div data-testid="payment-component">Payment Component</div>);

describe('App Component', () => {
  test('renders header and navigation', () => {
    render(<App />);
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
  });

  test('renders Products component by default', () => {
    render(<App />);
    expect(screen.getByTestId('products-component')).toBeInTheDocument();
  });
});