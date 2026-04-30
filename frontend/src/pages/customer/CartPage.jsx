import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartApi,
  removeFromCartApi,
  updateCartItemApi,
  clearCartApi,
  placeOrderApi,
} from "../../api/customerApi";

/**
 * CartPage - View cart, update quantities, place order
 */
const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchCart = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getCartApi();
      const items = Array.isArray(data) ? data : data?.items || data?.data || [];
      setCartItems(items);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId) => {
    try {
      await removeFromCartApi(itemId);
      setCartItems((prev) => prev.filter((item) => (item.id ?? item.cartItemId) !== itemId));
      setSuccess("Item removed");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove item");
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await updateCartItemApi(itemId, quantity);
      setCartItems((prev) =>
        prev.map((item) =>
          (item.id ?? item.cartItemId) === itemId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    try {
      await clearCartApi();
      setCartItems([]);
      setSuccess("Cart cleared");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to clear cart");
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }
    setPlacing(true);
    setError("");
    try {
      const { data } = await placeOrderApi();
      const orderId = data?.orderId ?? data?.id ?? data;
      setSuccess("Order placed successfully!");
      setCartItems([]);
      setTimeout(() => {
        navigate(`/customer/order/${orderId}`);
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.price ?? item.foodPrice ?? 0;
    const qty = item.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
      <h2 style={{ color: "#fc8019", marginBottom: 20 }}>🛒 Your Cart</h2>

      {error && (
        <div style={{ padding: 10, background: "#fee2e2", color: "#dc2626", borderRadius: 4, marginBottom: 15 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: 10, background: "#dcfce7", color: "#16a34a", borderRadius: 4, marginBottom: 15 }}>
          {success}
        </div>
      )}

      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 18, color: "#686b78" }}>Your cart is empty</p>
          <button
            onClick={() => navigate("/customer-dashboard")}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              background: "#fc8019",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            {cartItems.map((item) => {
              const id = item.id ?? item.cartItemId;
              const name = item.name ?? item.foodName ?? "Item";
              const price = item.price ?? item.foodPrice ?? 0;
              const qty = item.quantity ?? 1;
              return (
                <div
                  key={id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 15,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong>{name}</strong>
                    <p style={{ margin: "4px 0", color: "#686b78", fontSize: 14 }}>
                      ₹ {price} each
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      onClick={() => updateQuantity(id, qty - 1)}
                      disabled={qty <= 1}
                      style={{
                        width: 30,
                        height: 30,
                        border: "1px solid #ddd",
                        background: "#f5f5f5",
                        borderRadius: 4,
                        cursor: qty <= 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: 30, textAlign: "center" }}>{qty}</span>
                    <button
                      onClick={() => updateQuantity(id, qty + 1)}
                      style={{
                        width: 30,
                        height: 30,
                        border: "1px solid #ddd",
                        background: "#f5f5f5",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                    <span style={{ minWidth: 70, textAlign: "right", fontWeight: 600 }}>
                      ₹ {price * qty}
                    </span>
                    <button
                      onClick={() => removeItem(id)}
                      style={{
                        padding: "5px 10px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 20,
              padding: 15,
              background: "#fff4ec",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>Total: ₹ {totalPrice}</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleClearCart}
                style={{
                  padding: "10px 20px",
                  background: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Clear Cart
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                style={{
                  padding: "10px 25px",
                  background: placing ? "#ccc" : "#fc8019",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  fontWeight: 600,
                  cursor: placing ? "not-allowed" : "pointer",
                }}
              >
                {placing ? "Placing..." : "Place Order"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
