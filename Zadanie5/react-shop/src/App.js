import React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';

// Context API do zarządzania stanem koszyka
const ShopContext = createContext();

const useShopContext = () => {
  return useContext(ShopContext);
};

// Główny komponent aplikacji
const App = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('products'); // 'products', 'cart', 'checkout'

  // Pobieranie produktów z API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Symulacja odpowiedzi z API
        const mockProducts = [
          { id: 1, title: "Laptop Ultrabook Pro", description: "Szybki laptop z ekranem 15 cali i 16GB RAM", price: 3999.99, image: "/api/placeholder/200/150" },
          { id: 2, title: "Smartfon Galaxy X", description: "Nowoczesny smartfon z aparatem 108MP", price: 2499.99, image: "/api/placeholder/150/200" },
          { id: 3, title: "Słuchawki bezprzewodowe", description: "Słuchawki z redukcją szumów i długim czasem pracy", price: 399.99, image: "/api/placeholder/180/180" },
          { id: 4, title: "Monitor 4K 32 cale", description: "Monitor o wysokiej rozdzielczości do pracy i rozrywki", price: 1799.99, image: "/api/placeholder/220/150" },
          { id: 5, title: "Klawiatura mechaniczna", description: "Klawiatura dla graczy z podświetleniem RGB", price: 349.99, image: "/api/placeholder/200/120" },
          { id: 6, title: "Tablet CreativeTab", description: "Tablet graficzny do tworzenia cyfrowej sztuki", price: 1299.99, image: "/api/placeholder/180/200" }
        ];

        // Symulacja opóźnienia z serwera
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError("Nie udało się pobrać produktów");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Funkcje do zarządzania koszykiem
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
        item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
    prevCart.map(item =>
    item.id === productId
    ? { ...item, quantity }
    : item
    )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Obliczanie sumy koszyka
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const contextValue = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    navigateTo
  };

  // Renderowanie odpowiedniej strony
  const renderPage = () => {
    switch(currentPage) {
      case 'products':
        return <ProductsPage products={products} loading={loading} />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      default:
        return <ProductsPage products={products} loading={loading} />;
    }
  };

  return (
    <ShopContext.Provider value={contextValue}>
    <div className="flex flex-col min-h-screen bg-gray-100">
    <header className="bg-blue-600 text-white shadow-md">
    <div className="container mx-auto p-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">React Shop</h1>
    <nav className="flex space-x-4">
    <button
    onClick={() => navigateTo('products')}
    className="hover:underline"
    >
    Produkty
    </button>
    <button
    onClick={() => navigateTo('cart')}
    className="hover:underline flex items-center"
    >
    Koszyk
    {getTotalItems() > 0 && (
      <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
      {getTotalItems()}
      </span>
    )}
    </button>
    </nav>
    </div>
    </header>

    <main className="container mx-auto p-4 flex-grow">
    {error && <div className="text-red-500 mb-4">{error}</div>}
    {renderPage()}
    </main>

    <footer className="bg-gray-800 text-white p-4 text-center">
    <p>&copy; 2025 React Shop. Wszelkie prawa zastrzeżone.</p>
    </footer>
    </div>
    </ShopContext.Provider>
  );
};

// Komponent strony z produktami
const ProductsPage = ({ products, loading }) => {
  if (loading) {
    return <div className="text-center py-8">Ładowanie produktów...</div>;
  }

  return (
    <div>
    <h2 className="text-2xl font-semibold mb-6">Nasze produkty</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
    </div>
    </div>
  );
};

// Komponent karty produktu
const ProductCard = ({ product }) => {
  const { addToCart } = useShopContext();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-4 h-48 flex items-center justify-center bg-gray-100">
    <img
    src={product.image}
    alt={product.title}
    className="h-full object-contain"
    />
    </div>
    <div className="p-4">
    <h3 className="text-lg font-medium truncate">{product.title}</h3>
    <p className="text-gray-600 text-sm mt-1 h-12 overflow-hidden">{product.description}</p>
    <div className="mt-4 flex justify-between items-center">
    <span className="text-lg font-bold">{product.price} zł</span>
    <button
    onClick={() => addToCart(product)}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
    Dodaj do koszyka
    </button>
    </div>
    </div>
    </div>
  );
};

// Komponent strony koszyka
const CartPage = () => {
  const { cart, getTotalPrice, navigateTo } = useShopContext();

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
      <h2 className="text-2xl font-semibold mb-4">Twój koszyk jest pusty</h2>
      <p className="mb-4">Dodaj produkty do koszyka, aby kontynuować.</p>
      <button
      onClick={() => navigateTo('products')}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
      Przejdź do sklepu
      </button>
      </div>
    );
  }

  return (
    <div>
    <h2 className="text-2xl font-semibold mb-6">Twój koszyk</h2>
    <div className="bg-white rounded-lg shadow-md p-4">
    {cart.map(item => (
      <CartItem key={item.id} item={item} />
    ))}

    <div className="border-t border-gray-200 mt-4 pt-4">
    <div className="flex justify-between items-center mb-4">
    <span className="font-semibold text-lg">Razem:</span>
    <span className="font-bold text-xl">{getTotalPrice()} zł</span>
    </div>

    <button
    onClick={() => navigateTo('checkout')}
    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
    >
    Przejdź do płatności
    </button>
    </div>
    </div>
    </div>
  );
};

// Komponent przedmiotu w koszyku
const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useShopContext();

  return (
    <div className="flex items-center py-4 border-b border-gray-200 last:border-0">
    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded">
    <img
    src={item.image}
    alt={item.title}
    className="h-16 object-contain"
    />
    </div>

    <div className="ml-4 flex-grow">
    <h3 className="font-medium">{item.title}</h3>
    <p className="text-gray-500 text-sm">{item.price} zł / szt.</p>
    </div>

    <div className="flex items-center">
    <button
    onClick={() => updateQuantity(item.id, item.quantity - 1)}
    className="bg-gray-200 px-3 py-1 rounded-l"
    >
    -
    </button>
    <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
    <button
    onClick={() => updateQuantity(item.id, item.quantity + 1)}
    className="bg-gray-200 px-3 py-1 rounded-r"
    >
    +
    </button>
    </div>

    <div className="ml-4 text-right">
    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} zł</p>
    <button
    onClick={() => removeFromCart(item.id)}
    className="text-red-600 text-sm hover:underline mt-1"
    >
    Usuń
    </button>
    </div>
    </div>
  );
};

// Komponent strony płatności
const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart, navigateTo } = useShopContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Obsługa zmiany pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Wysyłanie danych do API
  const handleSubmit = () => {
    setLoading(true);

    // Dane do wysłania na serwer
    const orderData = {
      customerInfo: formData,
      items: cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: parseFloat(getTotalPrice())
    };

    // Symulacja wysłania żądania do API
    console.log('Wysyłanie zamówienia:', orderData);

    // Symulacja odpowiedzi z serwera
    setTimeout(() => {
      // Czyszczenie koszyka po złożeniu zamówienia
      clearCart();
      setOrderComplete(true);
      setLoading(false);
    }, 1500);
  };

  // Weryfikacja czy wszystkie pola są wypełnione
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
        formData.email.trim() !== '' &&
          formData.address.trim() !== '' &&
            formData.city.trim() !== '' &&
              formData.postalCode.trim() !== ''
    );
  };

  // Sprawdzenie czy koszyk jest pusty
  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigateTo('products');
    }
  }, [cart, navigateTo, orderComplete]);

  if (orderComplete) {
    return (
      <div className="text-center py-8">
      <h2 className="text-2xl font-semibold mb-4">Dziękujemy za Twoje zamówienie!</h2>
      <p className="mb-6">Szczegóły zamówienia zostały wysłane na podany adres email.</p>
      <button
      onClick={() => navigateTo('products')}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
      Wróć do sklepu
      </button>
      </div>
    );
  }

  return (
    <div>
    <h2 className="text-2xl font-semibold mb-6">Płatność</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2">
    <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-medium mb-4">Dane do wysyłki</h3>

    <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <div>
    <label className="block text-gray-700 mb-1">Imię i nazwisko</label>
    <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
    />
    </div>
    <div>
    <label className="block text-gray-700 mb-1">Email</label>
    <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
    />
    </div>
    </div>

    <div className="mb-4">
    <label className="block text-gray-700 mb-1">Adres</label>
    <input
    type="text"
    name="address"
    value={formData.address}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
    />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
    <label className="block text-gray-700 mb-1">Miasto</label>
    <input
    type="text"
    name="city"
    value={formData.city}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
    />
    </div>
    <div>
    <label className="block text-gray-700 mb-1">Kod pocztowy</label>
    <input
    type="text"
    name="postalCode"
    value={formData.postalCode}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2"
    />
    </div>
    </div>

    <h3 className="text-lg font-medium mb-4">Metoda płatności</h3>

    <div className="space-y-2 mb-6">
    <div className="flex items-center">
    <input
    type="radio"
    id="card"
    name="paymentMethod"
    value="card"
    checked={formData.paymentMethod === 'card'}
    onChange={handleChange}
    className="mr-2"
    />
    <label htmlFor="card">Karta płatnicza</label>
    </div>
    <div className="flex items-center">
    <input
    type="radio"
    id="blik"
    name="paymentMethod"
    value="blik"
    checked={formData.paymentMethod === 'blik'}
    onChange={handleChange}
    className="mr-2"
    />
    <label htmlFor="blik">BLIK</label>
    </div>
    <div className="flex items-center">
    <input
    type="radio"
    id="transfer"
    name="paymentMethod"
    value="transfer"
    checked={formData.paymentMethod === 'transfer'}
    onChange={handleChange}
    className="mr-2"
    />
    <label htmlFor="transfer">Przelew bankowy</label>
    </div>
    </div>

    <button
    onClick={handleSubmit}
    disabled={loading || !isFormValid()}
    className={`w-full py-3 rounded-lg text-white font-medium ${
      loading || !isFormValid() ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
    } transition`}
    >
    {loading ? 'Przetwarzanie...' : 'Złóż zamówienie'}
    </button>
    </div>
    </div>
    </div>

    <div>
    <div className="bg-white rounded-lg shadow-md p-4">
    <h3 className="text-lg font-medium mb-4">Podsumowanie zamówienia</h3>

    {cart.map(item => (
      <div key={item.id} className="flex justify-between mb-2">
      <span>{item.title} (x{item.quantity})</span>
      <span>{(item.price * item.quantity).toFixed(2)} zł</span>
      </div>
    ))}

    <div className="border-t border-gray-200 mt-4 pt-4">
    <div className="flex justify-between font-bold">
    <span>Suma:</span>
    <span>{getTotalPrice()} zł</span>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
};

export default App;
