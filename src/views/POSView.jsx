import React, { useState, useMemo } from "react";
import {
  ShoppingCart, Search, Plus, Minus, X, AlertTriangle, Package,
  CreditCard, DollarSign, Receipt, ChevronRight, Trash2,
} from "lucide-react";
import { Modal, EmptyState, StatCard } from "../components/ui";
import { today, nowTime } from "../utils/storage";

const CATEGORIES = ["All", "Supplements", "Apparel", "Gear", "Accessories", "Services"];

export function POSView({ products, setProducts, sales, setSales, members, user }) {
  const [activeTab, setActiveTab] = useState("sell");
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const filtered = products.filter((p) =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p) => {
    if (p.stock <= 0 && p.category !== "Services") return alert("Out of stock");
    setCart((c) => {
      const existing = c.find((i) => i.productId === p.id);
      if (existing) return c.map((i) => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { productId: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((c) => c.map((i) => i.productId === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.productId !== id));

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const completeSale = (method) => {
    const member = members.find((m) => m.id === memberId);
    const sale = {
      id: `s${Date.now()}`,
      date: today(),
      time: nowTime(),
      memberId: memberId || null,
      memberName: member?.name || "Walk-in",
      items: cart.map((i) => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
      total: cartTotal,
      method,
      staffName: user.name,
    };
    setSales([sale, ...sales]);

    setProducts(products.map((p) => {
      const cartItem = cart.find((c) => c.productId === p.id);
      if (cartItem && p.category !== "Services") return { ...p, stock: Math.max(0, p.stock - cartItem.qty) };
      return p;
    }));

    setCart([]);
    setMemberId(null);
    setMemberSearch("");
    setShowCheckout(false);
    setActiveTab("history");
  };

  const lowStockCount = products.filter((p) => p.category !== "Services" && p.stock <= p.lowStock).length;
  const todaySales = sales.filter((s) => s.date === today());
  const todayRevenue = todaySales.reduce((s, x) => s + x.total, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's revenue" value={`₦${(todayRevenue / 1000).toFixed(0)}K`} icon={DollarSign} accent="bg-red-500/20 text-red-400" />
        <StatCard label="Today's sales" value={todaySales.length} icon={Receipt} accent="bg-sky-500/20 text-sky-400" />
        <StatCard label="SKUs in stock" value={products.filter((p) => p.category !== "Services").length} icon={Package} accent="bg-amber-500/20 text-amber-400" />
        <StatCard label="Low stock alerts" value={lowStockCount} icon={AlertTriangle} accent="bg-rose-500/20 text-rose-400" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-800 p-1 rounded-lg w-fit">
        {[
          { id: "sell", label: "Sell" },
          { id: "inventory", label: "Inventory" },
          { id: "history", label: "Sales history" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${activeTab === t.id ? "bg-stone-950 text-white shadow-sm" : "text-stone-400 hover:text-stone-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "sell" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((p) => {
                const oos = p.stock <= 0 && p.category !== "Services";
                const low = p.category !== "Services" && p.stock <= p.lowStock;
                return (
                  <button key={p.id} onClick={() => addToCart(p)} disabled={oos}
                    className="bg-stone-900 border border-stone-700 rounded-xl p-4 text-left hover:border-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <div className="text-[10px] font-mono tracking-wider text-stone-500 uppercase mb-1">{p.category}</div>
                    <div className="font-semibold text-sm leading-tight mb-2 text-stone-100">{p.name}</div>
                    <div className="flex items-end justify-between">
                      <div className="font-display text-lg font-semibold text-white">₦{p.price.toLocaleString()}</div>
                      {p.category !== "Services" && (
                        <div className={`text-[10px] font-mono ${oos ? "text-rose-400" : low ? "text-amber-400" : "text-stone-500"}`}>
                          {oos ? "OUT" : `${p.stock} left`}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart */}
          <div className="bg-stone-900 rounded-xl border border-stone-700 p-5 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-stone-400" />
              <h3 className="font-display text-lg font-semibold text-white">Cart</h3>
              {cart.length > 0 && <span className="text-xs font-mono bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full">{cart.length}</span>}
            </div>

            {cart.length === 0 ? (
              <EmptyState icon={ShoppingCart} title="Cart is empty" subtitle="Add products to start a sale" />
            ) : (
              <>
                <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
                  {cart.map((i) => (
                    <div key={i.productId} className="flex items-start gap-2 py-2 border-b border-stone-800 last:border-0">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-stone-200 truncate">{i.name}</div>
                        <div className="text-xs text-stone-500 font-mono">₦{i.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(i.productId, -1)} className="w-6 h-6 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <span className="w-6 text-center text-xs font-mono text-stone-200">{i.qty}</span>
                        <button onClick={() => updateQty(i.productId, 1)} className="w-6 h-6 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => removeFromCart(i.productId)} className="w-6 h-6 rounded hover:bg-rose-950 flex items-center justify-center"><X className="w-3 h-3 text-rose-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-800 pt-3 mb-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono tracking-wider text-stone-500 uppercase">Total</span>
                    <span className="font-display text-2xl font-semibold text-white">₦{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button onClick={() => setShowCheckout(true)} className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "inventory" && <InventoryTab products={products} setProducts={setProducts} />}
      {activeTab === "history" && <SalesHistory sales={sales} />}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          cartTotal={cartTotal}
          memberId={memberId}
          setMemberId={setMemberId}
          memberSearch={memberSearch}
          setMemberSearch={setMemberSearch}
          members={members}
          onComplete={completeSale}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function CheckoutModal({ cart, cartTotal, memberId, setMemberId, memberSearch, setMemberSearch, members, onComplete, onClose }) {
  const matchingMembers = memberSearch
    ? members.filter((m) => m.name.toLowerCase().includes(memberSearch.toLowerCase())).slice(0, 5)
    : [];
  const selectedMember = members.find((m) => m.id === memberId);

  return (
    <Modal title="Checkout" subtitle={`${cart.length} item${cart.length !== 1 ? "s" : ""} · ₦${cartTotal.toLocaleString()}`} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Link to member (optional)</label>
          {selectedMember ? (
            <div className="flex items-center gap-3 p-3 bg-stone-800 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center font-semibold text-sm text-stone-200">{selectedMember.name[0]}</div>
              <div className="flex-1 text-sm font-medium text-stone-200">{selectedMember.name}</div>
              <button onClick={() => { setMemberId(null); setMemberSearch(""); }} className="text-xs text-stone-400 underline hover:text-stone-200">Remove</button>
            </div>
          ) : (
            <>
              <input value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="Search member name (leave blank for walk-in)"
                className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-red-500" />
              {matchingMembers.length > 0 && (
                <div className="mt-2 border border-stone-700 rounded-lg overflow-hidden">
                  {matchingMembers.map((m) => (
                    <button key={m.id} onClick={() => { setMemberId(m.id); setMemberSearch(""); }} className="w-full flex items-center gap-3 p-2 hover:bg-stone-800 text-left">
                      <div className="w-6 h-6 rounded-full bg-stone-700 flex items-center justify-center text-xs font-semibold text-stone-200">{m.name[0]}</div>
                      <span className="text-sm text-stone-300">{m.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <label className="text-xs font-mono tracking-wider text-stone-400 uppercase mb-1.5 block">Payment method</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onComplete("Cash")} className="flex items-center justify-center gap-2 py-3 border border-stone-700 bg-stone-800 rounded-lg hover:border-red-600 text-sm font-medium text-stone-300 transition">
              <DollarSign className="w-4 h-4" /> Cash
            </button>
            <button onClick={() => onComplete("Card")} className="flex items-center justify-center gap-2 py-3 border border-stone-700 bg-stone-800 rounded-lg hover:border-red-600 text-sm font-medium text-stone-300 transition">
              <CreditCard className="w-4 h-4" /> Card
            </button>
            <button onClick={() => onComplete("Transfer")} className="flex items-center justify-center gap-2 py-3 border border-stone-700 bg-stone-800 rounded-lg hover:border-red-600 text-sm font-medium text-stone-300 transition">
              <ChevronRight className="w-4 h-4" /> Bank transfer
            </button>
            <button
              onClick={() => selectedMember ? onComplete("Account") : alert("Link a member to use account billing.")}
              disabled={!selectedMember}
              className="flex items-center justify-center gap-2 py-3 border border-stone-700 bg-stone-800 rounded-lg hover:border-red-600 text-sm font-medium text-stone-300 transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Receipt className="w-4 h-4" /> Charge to account
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InventoryTab({ products, setProducts }) {
  const sorted = [...products].sort((a, b) => {
    const aLow = a.category !== "Services" && a.stock <= a.lowStock;
    const bLow = b.category !== "Services" && b.stock <= b.lowStock;
    if (aLow && !bLow) return -1;
    if (!aLow && bLow) return 1;
    return a.name.localeCompare(b.name);
  });

  const adjustStock = (id, delta) => {
    setProducts(products.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-xs font-mono tracking-wider text-stone-500 uppercase border-b border-stone-700">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium text-right">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const low = p.category !== "Services" && p.stock <= p.lowStock;
              return (
                <tr key={p.id} className="border-b border-stone-800 last:border-0 hover:bg-stone-800">
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm text-stone-100">{p.name}</div>
                    <div className="text-xs text-stone-500">{p.category}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-stone-500">{p.sku}</td>
                  <td className="px-6 py-4 text-sm font-mono text-stone-200">₦{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    {p.category === "Services" ? (
                      <span className="text-xs text-stone-600">—</span>
                    ) : (
                      <span className={`text-sm font-mono font-semibold ${low ? "text-rose-400" : "text-stone-200"}`}>
                        {p.stock}{low && <span className="ml-2 text-[10px] tracking-wider uppercase bg-rose-900/40 text-rose-300 px-1.5 py-0.5 rounded-full">Low</span>}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.category !== "Services" && (
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => adjustStock(p.id, -1)} className="w-7 h-7 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                        <button onClick={() => adjustStock(p.id, 1)} className="w-7 h-7 rounded bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                        <button onClick={() => adjustStock(p.id, 10)} className="px-2 h-7 rounded bg-stone-700 hover:bg-stone-600 text-stone-300 text-[10px] font-mono">+10</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SalesHistory({ sales }) {
  if (sales.length === 0) return <EmptyState icon={Receipt} title="No sales yet" subtitle="Completed sales will appear here." />;

  return (
    <div className="bg-stone-900 rounded-xl border border-stone-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left text-xs font-mono tracking-wider text-stone-500 uppercase border-b border-stone-700">
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Items</th>
              <th className="px-6 py-3 font-medium">Method</th>
              <th className="px-6 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-b border-stone-800 last:border-0 hover:bg-stone-800">
                <td className="px-6 py-4">
                  <div className="text-xs font-mono text-stone-500">{new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                  <div className="text-xs font-mono text-stone-400">{s.time}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-stone-200">{s.memberName}</td>
                <td className="px-6 py-4">
                  <div className="text-xs text-stone-400">
                    {s.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-stone-400">{s.method}</td>
                <td className="px-6 py-4 text-right font-mono font-semibold text-stone-200">₦{s.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
