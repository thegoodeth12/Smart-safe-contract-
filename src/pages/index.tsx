import React, { useState, useEffect } from "react";

interface SavedContract {
  name: string;
  address: string;
  network: string;
}

const STORAGE_KEY = "saved_contracts";

export default function Dashboard() {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [form, setForm] = useState<SavedContract>({
    name: "",
    address: "",
    network: "ethereum",
  });

  // Load saved contracts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setContracts(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever contracts change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  }, [contracts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address) return;
    setContracts([...contracts, form]);
    setForm({ name: "", address: "", network: "ethereum" });
  };

  const handleRemove = (address: string) => {
    setContracts(contracts.filter((c) => c.address !== address));
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">SafeVault Dashboard</h1>

      {/* Add Contract Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="0x..."
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <select
          value={form.network}
          onChange={(e) => setForm({ ...form, network: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
        </select>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-500 text-white rounded"
        >
          + Save
        </button>
      </form>

      {/* Saved Contracts Table */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-bold mb-2">Saved Contracts</h2>
        {contracts.length === 0 ? (
          <p className="text-gray-500">No contracts saved yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Address</th>
                <th className="text-left p-2">Network</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2 font-mono text-sm">{c.address}</td>
                  <td className="p-2 capitalize">{c.network}</td>
                  <td className="p-2 flex gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(c.address)
                      }
                      className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleRemove(c.address)}
                      className="px-2 py-1 text-sm border rounded text-red-500 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
