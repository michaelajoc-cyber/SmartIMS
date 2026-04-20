import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  Users,
  Search,
  Plus,
  Bell,
  Settings,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Pencil,
  ScanLine,
  Printer,
  Cloud,
  FileSpreadsheet,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  Camera,
  Filter,
  X,
  Copy,
  Eye,
  QrCode,
  Gem,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

const starterItems = [
  {
    id: "RNG-001",
    name: "Diamond Solitaire Ring",
    category: "Rings",
    material: "Gold 18K",
    price: 2500,
    stock: 7,
    capacity: 10,
    status: "In Stock",
    barcode: "8901234567890",
    location: "A1-03",
    weight: "3.25g",
    stone: "1.00ct, VS1, G, Excellent",
    supplier: "Diamond House",
    ringSize: "6.5",
    description: "18K gold solitaire ring with certified diamond",
    dateAdded: "May 8, 2024",
    updatedAt: "May 12, 2024",
    image: "",
    notes: "Classic solitaire design",
  },
  {
    id: "NKL-001",
    name: "Pearl Necklace",
    category: "Necklaces",
    material: "Silver 925",
    price: 850,
    stock: 2,
    capacity: 15,
    status: "Low Stock",
    barcode: "8901234567891",
    location: "B2-01",
    weight: "12.4g",
    stone: "Freshwater pearls",
    supplier: "Pearl House",
    ringSize: "—",
    description: "Elegant pearl necklace with silver clasp",
    dateAdded: "Apr 22, 2024",
    updatedAt: "May 10, 2024",
    image: "",
    notes: "Gift wrap requested often",
  },
  {
    id: "EAR-001",
    name: "Sapphire Drop Earrings",
    category: "Earrings",
    material: "White Gold",
    price: 1200,
    stock: 0,
    capacity: 8,
    status: "Out of Stock",
    barcode: "8901234567892",
    location: "C1-08",
    weight: "4.8g",
    stone: "Blue sapphire pair",
    supplier: "Azure Gems",
    ringSize: "—",
    description: "White gold earrings with sapphire drops",
    dateAdded: "Mar 19, 2024",
    updatedAt: "May 9, 2024",
    image: "",
    notes: "Awaiting supplier restock",
  },
  {
    id: "BRC-001",
    name: "Tennis Bracelet",
    category: "Bracelets",
    material: "Platinum",
    price: 4500,
    stock: 4,
    capacity: 5,
    status: "In Stock",
    barcode: "8901234567893",
    location: "D4-02",
    weight: "8.9g",
    stone: "Round brilliant set",
    supplier: "Platinum Line",
    ringSize: "—",
    description: "Premium platinum tennis bracelet",
    dateAdded: "May 1, 2024",
    updatedAt: "May 12, 2024",
    image: "",
    notes: "High-value item",
  },
  {
    id: "PND-001",
    name: "Ruby Heart Pendant",
    category: "Pendants",
    material: "Gold 14K",
    price: 780,
    stock: 9,
    capacity: 12,
    status: "In Stock",
    barcode: "8901234567894",
    location: "E3-04",
    weight: "2.9g",
    stone: "Natural ruby center",
    supplier: "Ruby Atelier",
    ringSize: "—",
    description: "Heart-shaped pendant with ruby center stone",
    dateAdded: "Apr 14, 2024",
    updatedAt: "May 11, 2024",
    image: "",
    notes: "Popular gift item",
  },
];

const starterSales = [
  { id: 1, date: "2026-04-10", sku: "RNG-001", item: "Diamond Solitaire Ring", qty: 1, salePrice: 2500, customer: "Jane Smith", notes: "" },
  { id: 2, date: "2026-04-08", sku: "NKL-001", item: "Pearl Necklace", qty: 1, salePrice: 850, customer: "John Smith", notes: "Gift wrap requested" },
  { id: 3, date: "2026-04-05", sku: "PND-001", item: "Ruby Heart Pendant", qty: 1, salePrice: 780, customer: "Alice Brown", notes: "" },
];

const starterRestocks = [
  { id: 1, date: "2026-04-17", sku: "EAR-001", item: "Sapphire Drop Earrings", qty: 8, supplier: "Azure Gems", notes: "Restock requested" },
  { id: 2, date: "2026-04-15", sku: "NKL-001", item: "Pearl Necklace", qty: 6, supplier: "Pearl House", notes: "Restocked best-seller" },
];

const starterUsers = [
  { id: 1, name: "Admin User", email: "admin@jewelryims.com", firstUsed: "Apr 20, 2026", lastActive: "Now" },
];

const inventoryCategories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Pendants"];

const emptyItem = {
  id: "",
  name: "",
  category: "Rings",
  material: "",
  price: "",
  stock: "",
  capacity: "",
  barcode: "",
  location: "",
  weight: "",
  stone: "",
  supplier: "",
  ringSize: "",
  description: "",
  dateAdded: "",
  updatedAt: "",
  image: "",
  notes: "",
};

const emptySale = { sku: "", item: "", qty: 1, salePrice: "", customer: "", notes: "", date: "2026-04-20" };
const emptyRestock = { sku: "", item: "", qty: 1, supplier: "", notes: "", date: "2026-04-20" };
const defaultSheetSettings = {
  spreadsheetId: "",
  inventorySheet: "Inventory",
  salesSheet: "Sales",
  restockSheet: "Restock",
  labelsSheet: "Labels",
  autoSync: true,
  lastSynced: "Not synced yet",
};

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function OverviewCard({ title, value, subtitle }) {
  return (
    <Card className="rounded-3xl border border-slate-200 shadow-none">
      <CardContent className="p-5">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function JewelryThumb({ item }) {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
      {item.image ? <img src={item.image} alt={item.name} className="h-full w-full rounded-2xl object-cover" /> : <Gem className="h-6 w-6" />}
    </div>
  );
}

function StockPill({ stock, status }) {
  const style = status === "Out of Stock"
    ? "bg-rose-100 text-rose-600"
    : status === "Low Stock"
    ? "bg-amber-100 text-amber-600"
    : "bg-emerald-100 text-emerald-600";
  return <span className={`inline-flex min-w-12 items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${style}`}>{stock}</span>;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("Inventory");
  const [items, setItems] = useState(starterItems);
  const [sales, setSales] = useState(starterSales);
  const [restocks, setRestocks] = useState(starterRestocks);
  const [users] = useState(starterUsers);
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [saleForm, setSaleForm] = useState(emptySale);
  const [restockForm, setRestockForm] = useState(emptyRestock);
  const [editingItemId, setEditingItemId] = useState(null);
  const [sheetSettings, setSheetSettings] = useState(defaultSheetSettings);
  const [syncLog, setSyncLog] = useState(["Inventory sheet columns prepared", "Sales sheet columns prepared", "Restock sheet columns prepared"]);
  const [scanInput, setScanInput] = useState("");
  const [scanMode, setScanMode] = useState("lookup");
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [labelPrintQueue, setLabelPrintQueue] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("RNG-001");
  const [qrDialogItem, setQrDialogItem] = useState(null);
  const [itemDetailsDialogItem, setItemDetailsDialogItem] = useState(null);
  const videoRef = useRef(null);

  const selectedItem = useMemo(() => items.find((item) => item.id === selectedItemId) || items[0], [items, selectedItemId]);
  const totalInventoryValue = useMemo(() => items.reduce((sum, item) => sum + item.price * item.stock, 0), [items]);
  const lowStockCount = useMemo(() => items.filter((item) => item.status === "Low Stock" || item.status === "Out of Stock").length, [items]);
  const totalItems = items.length;
  const activeSalesValue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = inventoryFilter === "All" ? true : item.category === inventoryFilter;
      const haystack = `${item.id} ${item.name} ${item.category} ${item.material} ${item.barcode} ${item.location}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
  }, [items, inventoryFilter, search]);

  const printRows = useMemo(() => items.map((item) => ({ SKU: item.id, Barcode: item.barcode, Name: item.name, Stock: item.stock })), [items]);

  useEffect(() => {
    if (!cameraEnabled || !navigator?.mediaDevices?.getUserMedia || !videoRef.current) return;
    let activeStream;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then((stream) => {
      activeStream = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play?.();
      }
    }).catch(() => setCameraEnabled(false));
    return () => activeStream?.getTracks?.().forEach((track) => track.stop());
  }, [cameraEnabled]);

  const syncStatus = (stock, capacity) => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= Math.max(2, Math.floor(capacity * 0.25))) return "Low Stock";
    return "In Stock";
  };

  const uploadItemImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setItemForm((prev) => ({ ...prev, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const resetItemForm = () => {
    setItemForm(emptyItem);
    setEditingItemId(null);
  };

  const submitItem = () => {
    if (!itemForm.id.trim() || !itemForm.name.trim()) return;
    const capacity = Number(itemForm.capacity || 0);
    const stock = Number(itemForm.stock || 0);
    const payload = {
      id: itemForm.id.trim(),
      name: itemForm.name.trim(),
      category: itemForm.category,
      material: itemForm.material.trim(),
      price: Number(itemForm.price || 0),
      stock,
      capacity,
      barcode: itemForm.barcode.trim(),
      location: itemForm.location.trim(),
      weight: itemForm.weight.trim(),
      stone: itemForm.stone.trim(),
      supplier: itemForm.supplier.trim(),
      ringSize: itemForm.ringSize.trim(),
      description: itemForm.description.trim(),
      dateAdded: itemForm.dateAdded.trim() || new Date().toLocaleDateString(),
      updatedAt: itemForm.updatedAt.trim() || new Date().toLocaleDateString(),
      image: itemForm.image,
      notes: itemForm.notes.trim(),
      status: syncStatus(stock, capacity),
    };
    if (editingItemId) {
      setItems((prev) => prev.map((item) => (item.id === editingItemId ? payload : item)));
    } else {
      setItems((prev) => [...prev, payload]);
      setLabelPrintQueue((prev) => [payload, ...prev]);
    }
    setSelectedItemId(payload.id);
    setItemDialogOpen(false);
    resetItemForm();
  };

  const editItem = (item) => {
    setEditingItemId(item.id);
    setItemForm({
      id: item.id,
      name: item.name,
      category: item.category,
      material: item.material,
      price: item.price,
      stock: item.stock,
      capacity: item.capacity,
      barcode: item.barcode,
      location: item.location,
      weight: item.weight,
      stone: item.stone,
      supplier: item.supplier,
      ringSize: item.ringSize,
      description: item.description,
      dateAdded: item.dateAdded,
      updatedAt: item.updatedAt,
      image: item.image,
      notes: item.notes,
    });
    setItemDialogOpen(true);
  };

  const deleteItem = (id) => {
    const remaining = items.filter((item) => item.id !== id);
    setItems(remaining);
    if (selectedItemId === id && remaining[0]) setSelectedItemId(remaining[0].id);
  };

  const submitSale = () => {
    if (!saleForm.sku || !saleForm.item) return;
    const qty = Number(saleForm.qty || 0);
    setSales((prev) => [{ id: Date.now(), ...saleForm, qty, salePrice: Number(saleForm.salePrice || 0) }, ...prev]);
    setItems((prev) => prev.map((item) => item.id === saleForm.sku ? { ...item, stock: Math.max(0, item.stock - qty), status: syncStatus(Math.max(0, item.stock - qty), item.capacity), updatedAt: new Date().toLocaleDateString() } : item));
    setSaleForm(emptySale);
    setSaleDialogOpen(false);
  };

  const submitRestock = () => {
    if (!restockForm.sku || !restockForm.item) return;
    const qty = Number(restockForm.qty || 0);
    setRestocks((prev) => [{ id: Date.now(), ...restockForm, qty }, ...prev]);
    setItems((prev) => prev.map((item) => item.id === restockForm.sku ? { ...item, stock: item.stock + qty, status: syncStatus(item.stock + qty, item.capacity), updatedAt: new Date().toLocaleDateString() } : item));
    setRestockForm(emptyRestock);
    setRestockDialogOpen(false);
  };

  const handleScan = (value) => {
    setScanInput(value);
    const found = items.find((item) => item.barcode === value || item.id.toLowerCase() === value.toLowerCase());
    setLastScannedItem(found || null);
    if (!found) return;
    setSelectedItemId(found.id);
    if (scanMode === "sale") {
      setSaleForm((prev) => ({ ...prev, sku: found.id, item: found.name, salePrice: found.price }));
      setCurrentPage("Sales");
      setSaleDialogOpen(true);
    }
    if (scanMode === "restock") {
      setRestockForm((prev) => ({ ...prev, sku: found.id, item: found.name }));
      setCurrentPage("Restock");
      setRestockDialogOpen(true);
    }
  };

  const simulateGoogleSheetsSync = () => {
    const stamp = new Date().toLocaleString();
    setSheetSettings((prev) => ({ ...prev, lastSynced: stamp }));
    setSyncLog([
      `Synced Inventory: ${items.length} rows`,
      `Synced Sales: ${sales.length} rows`,
      `Synced Restock: ${restocks.length} rows`,
      `Updated label queue: ${labelPrintQueue.length} rows`,
      `Last sync completed at ${stamp}`,
    ]);
  };

  const printLabels = (specificItem) => {
    const printable = specificItem ? [specificItem] : labelPrintQueue.length ? labelPrintQueue : items;
    const html = `
      <html>
        <head>
          <title>Print Labels</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 16px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
            .label { border: 1px solid #ccc; border-radius: 16px; padding: 12px; min-height: 140px; }
            .sku { font-size: 12px; color: #666; }
            .name { font-size: 16px; font-weight: 700; margin: 6px 0; }
            .barcode { font-family: monospace; letter-spacing: 1px; margin-top: 10px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="grid">
            ${printable.map((item) => `<div class="label"><div class="sku">${item.id}</div><div class="name">${item.name}</div><div>${item.material}</div><div>Price: $${item.price}</div><div class="barcode">*${item.barcode}*</div></div>`).join("")}
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>`;
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(html);
    printWindow?.document.close();
  };

  const copyBarcode = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
  };

  const openQrDetails = (item) => {
    setQrDialogItem(item);
  };

  const openItemDetailsFromQr = (item) => {
    setSelectedItemId(item.id);
    setItemDetailsDialogItem(item);
    setQrDialogItem(null);
  };

  const renderInventoryPage = () => (
    <div className="grid gap-0 xl:grid-cols-[1fr_420px]">
      <div className="border-r border-slate-200 pr-0 xl:pr-0">
        <div className="border-b border-slate-200 px-6 pb-5 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Inventory</h1>
              <p className="mt-1 text-2xl text-slate-500">{filteredItems.length} of {items.length} items</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200"><Filter className="h-5 w-5" /></Button>
              <Button className="h-12 rounded-2xl bg-violet-600 px-6 hover:bg-violet-700" onClick={() => { resetItemForm(); setItemDialogOpen(true); }}><Plus className="mr-2 h-5 w-5" />Add</Button>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="relative min-w-[320px] flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKU, name, material..." className="h-14 rounded-2xl border-slate-200 pl-12 text-lg" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {inventoryCategories.map((category) => (
              <button key={category} onClick={() => setInventoryFilter(category)} className={`rounded-full px-5 py-2.5 text-lg ${inventoryFilter === category ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-hidden rounded-[28px] border border-slate-200">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 text-left text-xl text-slate-500">
                <tr>
                  <th className="px-5 py-5"></th>
                  <th className="px-4 py-5 font-medium">SKU</th>
                  <th className="px-4 py-5 font-medium">Name</th>
                  <th className="px-4 py-5 font-medium">Category</th>
                  <th className="px-4 py-5 font-medium">Material</th>
                  <th className="px-4 py-5 font-medium">Price</th>
                  <th className="px-4 py-5 font-medium">Stock</th>
                  <th className="px-4 py-5 font-medium">Status</th>
                  <th className="px-4 py-5 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const ratio = `${item.stock}/${item.capacity}`;
                  const progress = `${Math.max(0, Math.min(100, (item.stock / item.capacity) * 100))}%`;
                  const progressColor = item.status === "Out of Stock" ? "bg-rose-400" : item.status === "Low Stock" ? "bg-amber-400" : "bg-emerald-500";
                  return (
                    <tr key={item.id} className={`border-t border-slate-200 transition hover:bg-slate-50 ${selectedItemId === item.id ? "bg-slate-50" : "bg-white"}`}>
                      <td className="px-5 py-5"><button onClick={() => setSelectedItemId(item.id)}><JewelryThumb item={item} /></button></td>
                      <td className="px-4 py-5 text-xl font-semibold text-slate-800">{item.id}</td>
                      <td className="px-4 py-5 text-[30px] font-medium text-slate-900"><button onClick={() => setSelectedItemId(item.id)} className="text-left hover:text-violet-700">{item.name}</button></td>
                      <td className="px-4 py-5 text-2xl text-slate-500">{item.category}</td>
                      <td className="px-4 py-5 text-2xl text-slate-500">{item.material}</td>
                      <td className="px-4 py-5 text-[30px] font-semibold text-slate-900">${item.price.toLocaleString()}</td>
                      <td className="px-4 py-5"><StockPill stock={item.stock} status={item.status} /></td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-2.5 w-20 rounded-full bg-slate-100"><div className={`h-2.5 rounded-full ${progressColor}`} style={{ width: progress }} /></div>
                          <span className="text-2xl text-slate-500">{ratio}</span>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-4 text-slate-700">
                          <button title="View QR code" onClick={() => openQrDetails(item)} className="rounded-xl p-2 hover:bg-slate-100"><QrCode className="h-6 w-6" /></button>
                          <button title="Quick stock in" onClick={() => { setRestockForm((prev) => ({ ...prev, sku: item.id, item: item.name })); setRestockDialogOpen(true); }} className="rounded-xl p-2 hover:bg-slate-100"><Plus className="h-6 w-6" /></button>
                          <button title="Edit item" onClick={() => editItem(item)} className="rounded-xl p-2 hover:bg-slate-100"><Pencil className="h-6 w-6" /></button>
                          <button title="Delete item" onClick={() => deleteItem(item.id)} className="rounded-xl p-2 text-rose-500 hover:bg-rose-50"><Trash2 className="h-6 w-6" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-2 pt-6 text-xl text-slate-500">Showing 1 to {filteredItems.length} of {items.length} items</p>
        </div>
      </div>

      <div className="min-h-full bg-white px-6 pb-6 pt-5">
        {selectedItem && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-slate-900">Item Details</h2>
              <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-6 w-6" /></button>
            </div>
            <div className="mt-5 rounded-[28px] border border-slate-200 p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex h-44 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                  {selectedItem.image ? <img src={selectedItem.image} alt={selectedItem.name} className="h-full w-full rounded-3xl object-cover" /> : <Gem className="h-14 w-14" />}
                </div>
                <button onClick={() => openQrDetails(selectedItem)} className="rounded-3xl border border-slate-300 p-3 text-center hover:bg-slate-50">
                  <div className="mx-auto rounded-2xl bg-white p-2">
                    <QRCode
                      value={JSON.stringify({
                        sku: selectedItem.id,
                        name: selectedItem.name,
                        category: selectedItem.category,
                        material: selectedItem.material,
                        price: selectedItem.price,
                        stock: selectedItem.stock,
                        barcode: selectedItem.barcode,
                        location: selectedItem.location,
                      })}
                      size={120}
                    />
                  </div>
                  <p className="mt-3 text-xl font-semibold text-slate-800">{selectedItem.id}</p>
                  <p className="text-lg text-slate-500">Scan to view details</p>
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <h3 className="text-[34px] font-semibold text-slate-900">{selectedItem.name}</h3>
              <Badge className={`${selectedItem.status === "In Stock" ? "bg-emerald-100 text-emerald-700" : selectedItem.status === "Low Stock" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"} rounded-full px-4 py-2 text-lg hover:bg-inherit`}>{selectedItem.status}</Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["SKU", selectedItem.id],
                ["Category", selectedItem.category],
                ["Material", selectedItem.material],
                ["Price", `$${selectedItem.price.toLocaleString()}`],
                ["Stock", String(selectedItem.stock)],
                ["Status", `${selectedItem.stock}/${selectedItem.capacity}`],
                ["Location", selectedItem.location],
                ["Weight", selectedItem.weight],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[28px] border border-slate-200 p-5">
              <h4 className="text-2xl font-semibold text-slate-900">Details</h4>
              <div className="mt-4 space-y-0">
                {[
                  ["Description", selectedItem.description],
                  ["Diamond", selectedItem.stone],
                  ["Ring Size", selectedItem.ringSize],
                  ["Barcode", selectedItem.barcode],
                  ["Location", selectedItem.location],
                  ["Supplier", selectedItem.supplier],
                  ["Date Added", selectedItem.dateAdded],
                  ["Last Updated", selectedItem.updatedAt],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[130px_1fr_auto] items-center border-b border-slate-100 py-4 last:border-b-0">
                    <span className="text-lg text-slate-500">{label}</span>
                    <span className="text-lg text-slate-800">{value}</span>
                    {label === "Barcode" ? <button onClick={() => copyBarcode(String(value))} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><Copy className="h-4 w-4" /></button> : <span />}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-14 rounded-2xl text-lg" onClick={() => editItem(selectedItem)}><Pencil className="mr-2 h-5 w-5" />Edit Item</Button>
              <Button variant="outline" className="h-14 rounded-2xl border-violet-300 text-lg text-violet-700 hover:bg-violet-50" onClick={() => printLabels(selectedItem)}><Printer className="mr-2 h-5 w-5" />Print Label</Button>
              <Button className="h-14 rounded-2xl bg-violet-600 text-lg hover:bg-violet-700"><Eye className="mr-2 h-5 w-5" />View History</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f8fb] text-slate-900">
      <div className="grid min-h-screen xl:grid-cols-[310px_1fr]">
        <aside className="flex flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-6 py-7">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Gem className="h-8 w-8" /></div>
              <div>
                <p className="text-[34px] font-semibold leading-none">Jewelry IMS</p>
                <p className="mt-2 text-xl text-slate-500">Inventory System</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-3 px-6 py-8">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentPage === "Dashboard"} onClick={() => setCurrentPage("Dashboard")} />
            <SidebarItem icon={Package} label="Inventory" active={currentPage === "Inventory"} onClick={() => setCurrentPage("Inventory")} />
            <SidebarItem icon={ShoppingCart} label="Sales" active={currentPage === "Sales"} onClick={() => setCurrentPage("Sales")} />
            <SidebarItem icon={RotateCcw} label="Restock" active={currentPage === "Restock"} onClick={() => setCurrentPage("Restock")} />
            <SidebarItem icon={ScanLine} label="Document Scanning" active={currentPage === "Document Scanning"} onClick={() => setCurrentPage("Document Scanning")} />
            <SidebarItem icon={Users} label="Users" active={currentPage === "Users"} onClick={() => setCurrentPage("Users")} />
            <SidebarItem icon={Cloud} label="Google Sheets Sync" active={currentPage === "Google Sheets Sync"} onClick={() => setCurrentPage("Google Sheets Sync")} />
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 bg-violet-600 text-white"><AvatarFallback>A</AvatarFallback></Avatar>
                <div>
                  <p className="text-xl font-semibold">Admin User</p>
                  <p className="text-sm text-slate-500">admin@jewelryims.com</p>
                </div>
              </div>
            </div>
            <button className="mt-4 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"><span className="flex items-center gap-3 text-lg"><Settings className="h-5 w-5" />Settings</span><ChevronRight className="h-5 w-5" /></button>
          </div>
        </aside>

        <main className="bg-white">
          {currentPage === "Inventory" && renderInventoryPage()}

          {currentPage === "Dashboard" && (
            <div className="p-8">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <OverviewCard title="Total Items" value={totalItems} subtitle="Jewelry products tracked" />
                <OverviewCard title="Inventory Value" value={`$${totalInventoryValue.toLocaleString()}`} subtitle="Current catalog value" />
                <OverviewCard title="Low or Out" value={lowStockCount} subtitle="Needs attention" />
                <OverviewCard title="Sales Value" value={`$${activeSalesValue.toLocaleString()}`} subtitle="Recorded sales" />
              </div>
            </div>
          )}

          {currentPage === "Document Scanning" && (
            <div className="p-8">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="rounded-3xl border-slate-200 shadow-none">
                  <CardHeader><CardTitle className="text-2xl">Document Scanning</CardTitle></CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label>Scan mode</Label>
                        <Select value={scanMode} onValueChange={setScanMode}>
                          <SelectTrigger className="mt-2 h-12 rounded-2xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lookup">Lookup item</SelectItem>
                            <SelectItem value="sale">Record sale after scan</SelectItem>
                            <SelectItem value="restock">Record restock after scan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Camera preview</Label>
                        <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 px-4"><Switch checked={cameraEnabled} onCheckedChange={setCameraEnabled} /><span className="text-slate-600">Enable camera preview</span></div>
                      </div>
                    </div>
                    <div>
                      <Label>Scan or enter barcode</Label>
                      <div className="mt-2 flex gap-3">
                        <Input value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="Scan with barcode reader or type code" className="h-12 rounded-2xl" />
                        <Button className="h-12 rounded-2xl bg-violet-600 px-5 hover:bg-violet-700" onClick={() => handleScan(scanInput)}><ScanLine className="mr-2 h-5 w-5" />Scan</Button>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                      {cameraEnabled ? <video ref={videoRef} className="aspect-video w-full bg-black object-cover" muted playsInline /> : <div className="flex aspect-video items-center justify-center text-slate-400"><div className="text-center"><Camera className="mx-auto mb-3 h-10 w-10" /><p>Camera preview is off</p></div></div>}
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-slate-200 shadow-none">
                  <CardHeader><CardTitle className="text-2xl">Scan Result</CardTitle></CardHeader>
                  <CardContent>
                    {lastScannedItem ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700"><CheckCircle2 className="h-5 w-5" /><span>Item found</span></div>
                        <div className="space-y-3 text-lg">
                          <p><strong>SKU:</strong> {lastScannedItem.id}</p>
                          <p><strong>Barcode:</strong> {lastScannedItem.barcode}</p>
                          <p><strong>Name:</strong> {lastScannedItem.name}</p>
                          <p><strong>Stock:</strong> {lastScannedItem.stock}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="rounded-2xl" onClick={() => setSelectedItemId(lastScannedItem.id)}>Open item</Button>
                          <Button variant="outline" className="rounded-2xl" onClick={() => openQrDetails(lastScannedItem)}>View QR</Button>
                        </div>
                      </div>
                    ) : <div className="rounded-2xl bg-amber-50 p-4 text-amber-700"><AlertCircle className="inline h-5 w-5" /> <span className="ml-2">No matching item yet</span></div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentPage === "Sales" && (
            <div className="p-8">
              <div className="mb-4 flex justify-end">
                <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
                  <DialogTrigger asChild><Button className="h-12 rounded-2xl bg-violet-600 px-5 hover:bg-violet-700"><Plus className="mr-2 h-4 w-4" />Record Sale</Button></DialogTrigger>
                  <DialogContent className="rounded-3xl sm:max-w-xl">
                    <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Item</Label><Select value={saleForm.sku} onValueChange={(value) => { const found = items.find((item) => item.id === value); setSaleForm((p) => ({ ...p, sku: value, item: found?.name || "", salePrice: found?.price || "" })); }}><SelectTrigger className="mt-2 rounded-2xl"><SelectValue placeholder="Select item" /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Quantity</Label><Input type="number" value={saleForm.qty} onChange={(e) => setSaleForm((p) => ({ ...p, qty: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                        <div><Label>Sale Price</Label><Input type="number" value={saleForm.salePrice} onChange={(e) => setSaleForm((p) => ({ ...p, salePrice: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Customer</Label><Input value={saleForm.customer} onChange={(e) => setSaleForm((p) => ({ ...p, customer: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                        <div><Label>Date</Label><Input type="date" value={saleForm.date} onChange={(e) => setSaleForm((p) => ({ ...p, date: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      </div>
                      <div><Label>Notes</Label><Textarea value={saleForm.notes} onChange={(e) => setSaleForm((p) => ({ ...p, notes: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      <div className="flex justify-end gap-2"><Button variant="outline" className="rounded-2xl" onClick={() => setSaleDialogOpen(false)}>Cancel</Button><Button className="rounded-2xl bg-violet-600 hover:bg-violet-700" onClick={submitSale}>Save</Button></div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Card className="rounded-3xl border-slate-200 shadow-none"><CardHeader><CardTitle className="text-2xl">Sales</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>SKU</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Sale Price</TableHead><TableHead>Customer</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader><TableBody>{sales.map((sale) => <TableRow key={sale.id}><TableCell>{sale.date}</TableCell><TableCell>{sale.sku}</TableCell><TableCell>{sale.item}</TableCell><TableCell>{sale.qty}</TableCell><TableCell>${sale.salePrice}</TableCell><TableCell>{sale.customer}</TableCell><TableCell>{sale.notes}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            </div>
          )}

          {currentPage === "Restock" && (
            <div className="p-8">
              <div className="mb-4 flex justify-end">
                <Dialog open={restockDialogOpen} onOpenChange={setRestockDialogOpen}>
                  <DialogTrigger asChild><Button className="h-12 rounded-2xl bg-violet-600 px-5 hover:bg-violet-700"><Plus className="mr-2 h-4 w-4" />Record Restock</Button></DialogTrigger>
                  <DialogContent className="rounded-3xl sm:max-w-xl">
                    <DialogHeader><DialogTitle>Record Restock</DialogTitle></DialogHeader>
                    <div className="grid gap-4 py-2">
                      <div><Label>Item</Label><Select value={restockForm.sku} onValueChange={(value) => { const found = items.find((item) => item.id === value); setRestockForm((p) => ({ ...p, sku: value, item: found?.name || "" })); }}><SelectTrigger className="mt-2 rounded-2xl"><SelectValue placeholder="Select item" /></SelectTrigger><SelectContent>{items.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div><Label>Quantity</Label><Input type="number" value={restockForm.qty} onChange={(e) => setRestockForm((p) => ({ ...p, qty: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                        <div><Label>Date</Label><Input type="date" value={restockForm.date} onChange={(e) => setRestockForm((p) => ({ ...p, date: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      </div>
                      <div><Label>Supplier</Label><Input value={restockForm.supplier} onChange={(e) => setRestockForm((p) => ({ ...p, supplier: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      <div><Label>Notes</Label><Textarea value={restockForm.notes} onChange={(e) => setRestockForm((p) => ({ ...p, notes: e.target.value }))} className="mt-2 rounded-2xl" /></div>
                      <div className="flex justify-end gap-2"><Button variant="outline" className="rounded-2xl" onClick={() => setRestockDialogOpen(false)}>Cancel</Button><Button className="rounded-2xl bg-violet-600 hover:bg-violet-700" onClick={submitRestock}>Save</Button></div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Card className="rounded-3xl border-slate-200 shadow-none"><CardHeader><CardTitle className="text-2xl">Restock</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>SKU</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Supplier</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader><TableBody>{restocks.map((entry) => <TableRow key={entry.id}><TableCell>{entry.date}</TableCell><TableCell>{entry.sku}</TableCell><TableCell>{entry.item}</TableCell><TableCell>{entry.qty}</TableCell><TableCell>{entry.supplier}</TableCell><TableCell>{entry.notes}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            </div>
          )}

          {currentPage === "Google Sheets Sync" && (
            <div className="p-8">
              <div className="grid gap-6 xl:grid-cols-2">
                <Card className="rounded-3xl border-slate-200 shadow-none"><CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-2xl">Google Sheets Sync</CardTitle><p className="mt-1 text-slate-500">Prepared structure for printing, labels, sales logs, and restock logs.</p></div><Button className="rounded-2xl bg-violet-600 hover:bg-violet-700" onClick={simulateGoogleSheetsSync}><RefreshCcw className="mr-2 h-4 w-4" />Sync now</Button></div></CardHeader><CardContent className="space-y-4"><div><Label>Spreadsheet ID</Label><Input value={sheetSettings.spreadsheetId} onChange={(e) => setSheetSettings((p) => ({ ...p, spreadsheetId: e.target.value }))} placeholder="Paste your Google Sheets spreadsheet ID" className="mt-2 rounded-2xl" /></div><div className="grid gap-4 md:grid-cols-2"><div><Label>Inventory sheet</Label><Input value={sheetSettings.inventorySheet} onChange={(e) => setSheetSettings((p) => ({ ...p, inventorySheet: e.target.value }))} className="mt-2 rounded-2xl" /></div><div><Label>Sales sheet</Label><Input value={sheetSettings.salesSheet} onChange={(e) => setSheetSettings((p) => ({ ...p, salesSheet: e.target.value }))} className="mt-2 rounded-2xl" /></div><div><Label>Restock sheet</Label><Input value={sheetSettings.restockSheet} onChange={(e) => setSheetSettings((p) => ({ ...p, restockSheet: e.target.value }))} className="mt-2 rounded-2xl" /></div><div><Label>Labels sheet</Label><Input value={sheetSettings.labelsSheet} onChange={(e) => setSheetSettings((p) => ({ ...p, labelsSheet: e.target.value }))} className="mt-2 rounded-2xl" /></div></div><div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4"><Switch checked={sheetSettings.autoSync} onCheckedChange={(value) => setSheetSettings((p) => ({ ...p, autoSync: value }))} /><div><p className="font-medium">Enable auto-sync structure</p><p className="text-sm text-slate-500">Keeps inventory, sales, restock, and print rows ready for Google Sheets.</p></div></div><div className="rounded-2xl bg-slate-50 p-4 text-slate-600">Last synced: {sheetSettings.lastSynced}</div></CardContent></Card>
                <Card className="rounded-3xl border-slate-200 shadow-none"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-2xl">Print and Label Queue</CardTitle><Button variant="outline" className="rounded-2xl" onClick={() => printLabels()}><Printer className="mr-2 h-4 w-4" />Print labels</Button></div></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-2 rounded-2xl bg-violet-50 p-4 text-violet-700"><FileSpreadsheet className="h-4 w-4" /><span>Print-friendly rows are prepared from your inventory data.</span></div><div className="max-h-72 overflow-auto rounded-2xl border border-slate-200"><Table><TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Barcode</TableHead><TableHead>Name</TableHead><TableHead>Stock</TableHead></TableRow></TableHeader><TableBody>{printRows.map((row) => <TableRow key={row.SKU}><TableCell>{row.SKU}</TableCell><TableCell>{row.Barcode}</TableCell><TableCell>{row.Name}</TableCell><TableCell>{row.Stock}</TableCell></TableRow>)}</TableBody></Table></div><div className="space-y-2 text-sm text-slate-600">{syncLog.map((entry, index) => <div key={index} className="rounded-xl bg-slate-50 px-4 py-3">{entry}</div>)}</div></CardContent></Card>
              </div>
            </div>
          )}

          {currentPage === "Users" && (
            <div className="p-8"><Card className="rounded-3xl border-slate-200 shadow-none"><CardHeader><div className="flex items-center justify-between"><div><CardTitle className="text-2xl">Users</CardTitle><p className="mt-1 text-slate-500">Manage users and user permissions</p></div><div className="flex gap-2"><Button variant="outline" className="rounded-2xl">Sync with database</Button><Button className="rounded-2xl bg-violet-600 hover:bg-violet-700">Add user</Button></div></div></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>First used app</TableHead><TableHead>Last active</TableHead></TableRow></TableHeader><TableBody>{users.map((user) => <TableRow key={user.id}><TableCell><div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback></Avatar><span>{user.name}</span></div></TableCell><TableCell>{user.email}</TableCell><TableCell>{user.firstUsed}</TableCell><TableCell>{user.lastActive}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>
          )}
        </main>
      </div>

      <Dialog open={!!qrDialogItem} onOpenChange={(open) => !open && setQrDialogItem(null)}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader><DialogTitle>QR Code</DialogTitle></DialogHeader>
          {qrDialogItem && (
            <div className="space-y-5 py-2 text-center">
              <div className="mx-auto rounded-3xl bg-white p-4">
                <QRCode
                  value={JSON.stringify({
                    sku: qrDialogItem.id,
                    name: qrDialogItem.name,
                    category: qrDialogItem.category,
                    material: qrDialogItem.material,
                    price: qrDialogItem.price,
                    stock: qrDialogItem.stock,
                    barcode: qrDialogItem.barcode,
                    location: qrDialogItem.location,
                    description: qrDialogItem.description,
                  })}
                  size={208}
                />
              </div>
              <div>
                <p className="text-2xl font-semibold">{qrDialogItem.id}</p>
                <p className="mt-1 text-slate-500">{qrDialogItem.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Button variant="outline" className="rounded-2xl" onClick={() => copyBarcode(qrDialogItem.barcode)}><Copy className="mr-2 h-4 w-4" />Copy Code</Button>
                <Button variant="outline" className="rounded-2xl" onClick={() => openItemDetailsFromQr(qrDialogItem)}><Eye className="mr-2 h-4 w-4" />Item Details</Button>
                <Button className="rounded-2xl bg-violet-600 hover:bg-violet-700" onClick={() => printLabels(qrDialogItem)}><Printer className="mr-2 h-4 w-4" />Print Label</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!itemDetailsDialogItem} onOpenChange={(open) => !open && setItemDetailsDialogItem(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-2xl">
          {itemDetailsDialogItem && (
            <>
              <DialogHeader>
                <DialogTitle>Item Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <div className="flex h-44 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                    {itemDetailsDialogItem.image ? (
                      <img src={itemDetailsDialogItem.image} alt={itemDetailsDialogItem.name} className="h-full w-full rounded-3xl object-cover" />
                    ) : (
                      <Gem className="h-14 w-14" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-3xl font-semibold text-slate-900">{itemDetailsDialogItem.name}</h3>
                        <p className="mt-1 text-slate-500">{itemDetailsDialogItem.id}</p>
                      </div>
                      <Badge className={`${itemDetailsDialogItem.status === "In Stock" ? "bg-emerald-100 text-emerald-700" : itemDetailsDialogItem.status === "Low Stock" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"} rounded-full px-4 py-2 text-sm hover:bg-inherit`}>
                        {itemDetailsDialogItem.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ["Category", itemDetailsDialogItem.category],
                        ["Material", itemDetailsDialogItem.material],
                        ["Price", `$${itemDetailsDialogItem.price.toLocaleString()}`],
                        ["Stock", `${itemDetailsDialogItem.stock}/${itemDetailsDialogItem.capacity}`],
                        ["Location", itemDetailsDialogItem.location],
                        ["Weight", itemDetailsDialogItem.weight],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 p-3">
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 p-4">
                  <div className="space-y-0">
                    {[
                      ["Description", itemDetailsDialogItem.description],
                      ["Stone", itemDetailsDialogItem.stone],
                      ["Ring Size", itemDetailsDialogItem.ringSize],
                      ["Barcode", itemDetailsDialogItem.barcode],
                      ["Supplier", itemDetailsDialogItem.supplier],
                      ["Date Added", itemDetailsDialogItem.dateAdded],
                      ["Last Updated", itemDetailsDialogItem.updatedAt],
                    ].map(([label, value]) => (
                      <div key={label} className="grid grid-cols-[140px_1fr] gap-4 border-b border-slate-100 py-3 last:border-b-0">
                        <span className="text-sm text-slate-500">{label}</span>
                        <span className="text-sm text-slate-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" className="rounded-2xl" onClick={() => setItemDetailsDialogItem(null)}>Close</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => printLabels(itemDetailsDialogItem)}><Printer className="mr-2 h-4 w-4" />Print Label</Button>
                  <Button className="rounded-2xl bg-violet-600 hover:bg-violet-700" onClick={() => { const current = itemDetailsDialogItem; setItemDetailsDialogItem(null); editItem(current); }}><Pencil className="mr-2 h-4 w-4" />Edit Item</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-3xl">
          <DialogHeader><DialogTitle>{editingItemId ? "Edit Inventory Item" : "Add Inventory Item"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Item Image</Label>
              <div className="flex items-center gap-4 rounded-2xl border border-dashed p-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">{itemForm.image ? <img src={itemForm.image} alt="preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-slate-400" />}</div>
                <div><Label htmlFor="item-image-upload" className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium"><Upload className="h-4 w-4" /> Upload photo</Label><input id="item-image-upload" type="file" accept="image/*" className="hidden" onChange={uploadItemImage} /></div>
              </div>
            </div>
            {[
              ["SKU", "id"], ["Name", "name"], ["Material", "material"], ["Price", "price"], ["Stock", "stock"], ["Capacity", "capacity"], ["Barcode", "barcode"], ["Location", "location"], ["Weight", "weight"], ["Stone Details", "stone"], ["Supplier", "supplier"], ["Ring Size", "ringSize"], ["Date Added", "dateAdded"], ["Updated At", "updatedAt"]
            ].map(([label, field]) => (
              <div key={field} className="space-y-2"><Label>{label}</Label><Input value={itemForm[field]} onChange={(e) => setItemForm((p) => ({ ...p, [field]: e.target.value }))} className="rounded-xl" /></div>
            ))}
            <div className="space-y-2"><Label>Category</Label><Select value={itemForm.category} onValueChange={(value) => setItemForm((p) => ({ ...p, category: value }))}><SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{inventoryCategories.filter((x) => x !== "All").map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={itemForm.description} onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-2 md:col-span-2"><Label>Notes</Label><Textarea value={itemForm.notes} onChange={(e) => setItemForm((p) => ({ ...p, notes: e.target.value }))} className="rounded-xl" /></div>
            <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" className="rounded-xl" onClick={() => setItemDialogOpen(false)}>Cancel</Button><Button className="rounded-xl bg-violet-600 hover:bg-violet-700" onClick={submitItem}>Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
