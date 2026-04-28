import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import html2canvas from "html2canvas";
import {
  Gem,
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  ScanLine,
  Users,
  Cloud,
  Search,
  Plus,
  Pencil,
  Trash2,
  QrCode,
  Printer,
  Menu,
  X,
  Settings,
  Mail,
  RefreshCw,
  ClipboardList,
  ShieldCheck,
  Image as ImageIcon,
  Save,
  Camera,
  UserCog,
  Receipt,
  Undo2,
  ArrowLeft,
} from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx9D0T7Yz2oELhaD5k607MCgcxGfG6G4qzfQUQzxR3TK82als1J-8zqcxY7LGYMhXt4IA/exec";

const STORAGE_KEY = "jewelryIMSData";
const BANGKOK_TIMEZONE = "Asia/Bangkok";

const categories = ["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Gems"];

const navItems = [
  { key: "Dashboard", icon: LayoutDashboard },
  { key: "Inventory", icon: Package },
  { key: "Restock", icon: RotateCcw },
  { key: "Sales", icon: ShoppingCart },
  { key: "Document Scanning", icon: ScanLine },
  { key: "Operation Hub", icon: ClipboardList },
];

const roles = {
  admin: {
    label: "Admin",
    canEditPrice: true,
    canEditStock: true,
    canDelete: true,
    canViewLogs: true,
    canReorder: true,
    canCreateItem: true,
    canEditItem: true,
    canManageUsers: true,
    canSync: true,
    canProcessSales: true,
  },
  warehouse: {
    label: "Staff",
    canEditPrice: false,
    canEditStock: true,
    canDelete: false,
    canViewLogs: true,
    canReorder: true,
    canCreateItem: false,
    canEditItem: false,
    canManageUsers: false,
    canSync: true,
    canProcessSales: true,
  },
  viewer: {
    label: "Viewer",
    canEditPrice: false,
    canEditStock: false,
    canDelete: false,
    canViewLogs: true,
    canReorder: false,
    canCreateItem: false,
    canEditItem: false,
    canManageUsers: false,
    canSync: false,
    canProcessSales: false,
  },
};

const emptyItemForm = {
  id: "",
  name: "",
  category: "Rings",
  material: "",
  price: "",
  stock: "",
  minStock: "",
  capacity: "",
  barcode: "",
  location: "",
  weight: "",
  stone: "",
  supplier: "",
  supplierEmail: "",
  ringSize: "—",
  description: "",
  dateAdded: "",
  updatedAt: "",
  image: "",
};

const emptySaleForm = {
  sku: "",
  quantity: 1,
  customer: "",
  soldBy: "Warehouse Staff",
};

const emptyUserForm = {
  id: "",
  name: "",
  username: "",
  email: "",
  password: "",
  role: "warehouse",
  active: true,
  isDeleted: false,
};

const emptyOperationForm = {
  type: "Job Order",
  title: "",
  amount: "",
  dueDate: "",
  customer: "",
  status: "Pending",
  notes: "",
};

function bangkokNow() {
  return new Date().toLocaleString("sv-SE", { timeZone: BANGKOK_TIMEZONE }).replace(" ", "T");
}

function bangkokDate() {
  return bangkokNow().slice(0, 10);
}

function readSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error("Local storage read failed:", error);
    return {};
  }
}

function writeSavedData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Local storage write failed:", error);
  }
}

function isDeletedFlag(value) {
  return value === true || String(value || "").toLowerCase() === "true";
}

function normalizeUser(user = {}) {
  const username = String(user.username || user.Username || user.email || user.Email || user.name || user.Name || "").trim();
  return {
    id: user.id || user.ID || user.email || user.Email || username || Date.now(),
    name: user.name || user.Name || username,
    username,
    email: user.email || user.Email || username,
    password: user.password || user.Password || "",
    role: user.role || user.Role || "warehouse",
    active: user.active === undefined ? true : user.active === true || String(user.active).toLowerCase() === "true",
    isDeleted: isDeletedFlag(user.isDeleted || user["Is Deleted"]),
  };
}

function normalizeItem(row = {}) {
  const id = row.id || row.ID || row.SKU || row.sku || "";
  return {
    id: String(id).trim(),
    name: row.name || row.Name || "",
    category: row.category || row.Category || "Rings",
    material: row.material || row.Material || "",
    price: Number(row.price || row.Price || 0),
    stock: Number(row.stock || row.Stock || 0),
    minStock: Number(row.minStock || row["Min Stock"] || row.min_stock || 0),
    capacity: Number(row.capacity || row.Capacity || 0),
    barcode: row.barcode || row.Barcode || "",
    location: row.location || row.Location || "",
    weight: row.weight || row.Weight || "",
    stone: row.stone || row.Stone || "",
    supplier: row.supplier || row.Supplier || "",
    supplierEmail: row.supplierEmail || row["Supplier Email"] || "",
    ringSize: row.ringSize || row["Ring Size"] || "—",
    description: row.description || row.Description || "",
    dateAdded: row.dateAdded || row["Date Added"] || bangkokDate(),
    updatedAt: row.updatedAt || row["Last Updated"] || row.updated_at || bangkokNow(),
    image: row.image || row.Image || "",
    isDeleted: isDeletedFlag(row.isDeleted || row["Is Deleted"]),
    deletedAt: row.deletedAt || row["Deleted At"] || "",
    deletedBy: row.deletedBy || row["Deleted By"] || "",
    deleteReason: row.deleteReason || row["Delete Reason"] || "",
  };
}

function normalizeLog(row = {}) {
  return {
    id: row.id || row.ID || Date.now(),
    sku: row.sku || row.SKU || "",
    itemName: row.itemName || row["Item Name"] || row.name || "",
    previousQty: Number(row.previousQty || row["Previous Qty"] || 0),
    change: Number(row.change || row.Change || 0),
    newQty: Number(row.newQty || row["New Qty"] || 0),
    reason: row.reason || row.Reason || "",
    type: row.type || row.Type || "",
    updatedBy: row.updatedBy || row["Updated By"] || "",
    timestamp: row.timestamp || row.Timestamp || bangkokNow(),
  };
}

function normalizeSale(row = {}) {
  return {
    id: row.id || row.ID || Date.now(),
    sku: row.sku || row.SKU || "",
    itemName: row.itemName || row["Item Name"] || "",
    quantity: Number(row.quantity || row.Quantity || 0),
    price: Number(row.price || row.Price || 0),
    total: Number(row.total || row.Total || 0),
    soldBy: row.soldBy || row["Sold By"] || "",
    customer: row.customer || row.Customer || "Walk-in Customer",
    timestamp: row.timestamp || row.Timestamp || bangkokNow(),
  };
}

function normalizeOperation(row = {}) {
  return {
    id: row.id || row.ID || Date.now(),
    type: row.type || row.Type || "Job Order",
    title: row.title || row.Title || "",
    amount: Number(row.amount || row.Amount || 0),
    dueDate: row.dueDate || row["Due Date"] || "",
    customer: row.customer || row.Customer || "",
    status: row.status || row.Status || "Pending",
    notes: row.notes || row.Notes || "",
    createdAt: row.createdAt || row["Created At"] || bangkokNow(),
  };
}

function mergeRowsById(localRows = [], sheetRows = [], normalizer = (row) => row) {
  const map = new Map();
  localRows.map(normalizer).forEach((row) => {
    const key = String(row.id || row.sku || row.email || "");
    if (key) map.set(key, row);
  });
  sheetRows.map(normalizer).forEach((row) => {
    const key = String(row.id || row.sku || row.email || "");
    if (key) map.set(key, { ...(map.get(key) || {}), ...row });
  });
  return Array.from(map.values());
}

function getStockStatus(item) {
  if (Number(item.stock) <= 0) return "Critical";
  if (Number(item.stock) <= Number(item.minStock)) return "Low";
  return "Healthy";
}

function statusClasses(status) {
  if (status === "Critical") return "bg-rose-100 text-rose-700";
  if (status === "Low") return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function progressClasses(status) {
  if (status === "Critical") return "bg-rose-500";
  if (status === "Low") return "bg-amber-500";
  return "bg-emerald-500";
}

function AppButton({ children, className = "", variant = "solid", ...props }) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      : "bg-violet-600 text-white hover:bg-violet-700";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          <p className="mt-2 text-xs font-medium text-violet-600">Click to view</p>
        </div>
        <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </button>
  );
}

function SidebarItem({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
        active ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

export default function App() {
  const savedData = useMemo(() => {
    const data = readSavedData();
    const cleanedUsers = (data.users || []).map(normalizeUser).filter((user) => user.username && user.password && !user.isDeleted);
    const savedIdentity = String(data.currentUserEmail || data.currentUsername || "").trim().toLowerCase();
    const savedUser = cleanedUsers.find(
      (user) =>
        user.active !== false &&
        String(user.username || user.email || "").toLowerCase() === savedIdentity
    );
    return {
      ...data,
      items: (data.items || []).map(normalizeItem),
      logs: (data.logs || []).map(normalizeLog),
      users: cleanedUsers,
      sales: (data.sales || []).map(normalizeSale),
      operationOrders: (data.operationOrders || []).map(normalizeOperation),
      deletedItemIds: Array.isArray(data.deletedItemIds) ? data.deletedItemIds : [],
      currentUserEmail: savedUser ? savedUser.username || savedUser.email : "",
      currentRole: savedUser ? savedUser.role || "viewer" : "viewer",
      isLoggedIn: Boolean(data.isLoggedIn && savedUser),
    };
  }, []);

  const [items, setItems] = useState(savedData.items || []);
  const [logs, setLogs] = useState(savedData.logs || []);
  const [users, setUsers] = useState(savedData.users || []);
  const [sales, setSales] = useState(savedData.sales || []);
  const [operationOrders, setOperationOrders] = useState(savedData.operationOrders || []);
  const [deletedItemIds, setDeletedItemIds] = useState(savedData.deletedItemIds || []);

  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(savedData.currentRole || "viewer");
  const [currentUserEmail, setCurrentUserEmail] = useState(savedData.currentUserEmail || "");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(savedData.isLoggedIn));

  const [syncStatus, setSyncStatus] = useState("Local mode");
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [lastSync, setLastSync] = useState("");
  const [currency, setCurrency] = useState("THB");

  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: savedData.currentUserEmail || "", password: "" });
  const [setupForm, setSetupForm] = useState({ name: "", email: "", password: "" });

  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [itemFormMode, setItemFormMode] = useState("add");
  const [itemForm, setItemForm] = useState({ ...emptyItemForm, dateAdded: bangkokDate(), updatedAt: bangkokNow() });
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockForm, setRestockForm] = useState({
    quantity: "",
    date: bangkokDate(),
    reason: "",
    type: "restock",
    updatedBy: "Warehouse Staff",
  });
  const [saleForm, setSaleForm] = useState(emptySaleForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [operationForm, setOperationForm] = useState(emptyOperationForm);

  const [saleSaveStatus, setSaleSaveStatus] = useState("idle");
  const [restockSaveStatus, setRestockSaveStatus] = useState("idle");
  const [userSaveStatus, setUserSaveStatus] = useState("idle");
  const [operationSaveStatus, setOperationSaveStatus] = useState("idle");

  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null, reason: "" });
  const [undoDelete, setUndoDelete] = useState({ open: false, item: null });
  const [qrModalItem, setQrModalItem] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState("user");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaveStatus, setPasswordSaveStatus] = useState("idle");

  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("Ready to scan");
  const [manualScan, setManualScan] = useState("");

  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const imageInputRef = useRef(null);
  const qrDownloadRef = useRef(null);

  const activeUsers = useMemo(
    () => users.map(normalizeUser).filter((user) => !user.isDeleted && user.active !== false),
    [users]
  );

  const currentUser = isLoggedIn
    ? activeUsers.find((u) => String(u.username || u.email).toLowerCase() === String(currentUserEmail).toLowerCase()) ||
      activeUsers[0] ||
      null
    : null;

  const viewOnlyPermissions = roles.viewer;
  const permissions = isLoggedIn ? roles[currentRole] || viewOnlyPermissions : viewOnlyPermissions;

  const exchangeRates = { THB: 1, USD: 1 / 36, EUR: 1 / 39, GBP: 1 / 45, SGD: 1 / 27, PHP: 1.56, JPY: 4.3, CAD: 1 / 26, AUD: 1 / 24, CNY: 1 / 5 };

  function formatCurrency(amount) {
    const converted = Number(amount || 0) * (exchangeRates[currency] || 1);
    return new Intl.NumberFormat(currency === "THB" ? "th-TH" : "en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  }

  const hiddenDeletedIds = useMemo(
    () => new Set((deletedItemIds || []).map((id) => String(id))),
    [deletedItemIds]
  );

  const enrichedItems = useMemo(
    () =>
      items
        .map(normalizeItem)
        .filter((item) => item.id && !hiddenDeletedIds.has(String(item.id)) && !isDeletedFlag(item.isDeleted))
        .map((item) => ({
          ...item,
          stock: Number(item.stock || 0),
          minStock: Number(item.minStock || 0),
          capacity: Number(item.capacity || 0),
          price: Number(item.price || 0),
          status: getStockStatus(item),
        })),
    [items, hiddenDeletedIds]
  );

  const selectedItem = selectedItemId ? enrichedItems.find((item) => String(item.id) === String(selectedItemId)) || null : null;

  const filteredItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return enrichedItems.filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const haystack = `${item.id} ${item.name} ${item.material} ${item.category} ${item.status} ${item.barcode}`.toLowerCase();
      return categoryMatch && (!needle || haystack.includes(needle));
    });
  }, [enrichedItems, category, search]);

  const itemLogs = useMemo(
    () =>
      logs
        .map(normalizeLog)
        .filter((log) => String(log.sku) === String(selectedItem?.id))
        .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp))),
    [logs, selectedItem]
  );

  const totalValue = enrichedItems.reduce((sum, item) => sum + Number(item.price) * Number(item.stock), 0);
  const totalUnits = enrichedItems.reduce((sum, item) => sum + Number(item.stock), 0);
  const lowCount = enrichedItems.filter((item) => item.status === "Low").length;
  const criticalCount = enrichedItems.filter((item) => item.status === "Critical").length;
  const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  function persistAll(overrides = {}) {
    const data = {
      items,
      logs,
      users,
      sales,
      operationOrders,
      deletedItemIds,
      currentRole,
      currentUserEmail,
      isLoggedIn,
      ...overrides,
    };
    writeSavedData(data);
  }

  async function syncToGoogleSheet(payload) {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Google Sheets sync failed: ${res.status}`);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  async function apiGet(action) {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(action)}`);
    if (!res.ok) throw new Error(`GET ${action} failed`);
    return res.json();
  }

  async function pushAllToSheets(nextData = {}, extra = {}) {
    const dataToSave = {
      items: (nextData.items ?? items).map(normalizeItem),
      logs: (nextData.logs ?? logs).map(normalizeLog),
      users: (nextData.users ?? users).map(normalizeUser),
      sales: (nextData.sales ?? sales).map(normalizeSale),
      operationOrders: (nextData.operationOrders ?? operationOrders).map(normalizeOperation),
      deletedItemIds: nextData.deletedItemIds ?? deletedItemIds,
    };

    writeSavedData({
      ...dataToSave,
      currentRole: nextData.currentRole ?? currentRole,
      currentUserEmail: nextData.currentUserEmail ?? currentUserEmail,
      isLoggedIn: nextData.isLoggedIn ?? isLoggedIn,
    });

    try {
      setSyncBusy(true);
      setSyncError("");
      setSyncStatus("Saving locally and syncing to Google Sheets...");
      await syncToGoogleSheet({
        action: "syncAllData",
        payload: dataToSave,
        ...dataToSave,
        lastAction: extra.action || "syncAllData",
        item: extra.item || null,
        user: extra.user || null,
        sale: extra.sale || null,
        log: extra.log || null,
        timestamp: bangkokNow(),
      });
      const time = new Date().toLocaleTimeString();
      setLastSync(time);
      setSyncStatus(`Synced to Google Sheets at ${time}`);
      return true;
    } catch (error) {
      console.error(error);
      setSyncError(error?.message || "Google Sheets sync failed");
      setSyncStatus("Saved locally; Google Sheets sync pending");
      return false;
    } finally {
      setSyncBusy(false);
    }
  }

  function mergeSheetItems(prevItems, sheetRows) {
    const normalizedSheet = (sheetRows || []).map(normalizeItem).filter((item) => item.id);
    const tombstones = new Set((deletedItemIds || []).map((id) => String(id)));

    const localMap = new Map(prevItems.map(normalizeItem).filter((item) => item.id).map((item) => [String(item.id), item]));
    const merged = [];

    normalizedSheet.forEach((sheetItem) => {
      const id = String(sheetItem.id);
      const localItem = localMap.get(id);
      if (tombstones.has(id) || isDeletedFlag(localItem?.isDeleted)) {
        merged.push({
          ...(localItem || sheetItem),
          ...sheetItem,
          image: sheetItem.image || localItem?.image || "",
          isDeleted: true,
          deletedAt: localItem?.deletedAt || sheetItem.deletedAt || bangkokNow(),
          deletedBy: localItem?.deletedBy || sheetItem.deletedBy || currentUser?.name || "Admin",
          deleteReason: localItem?.deleteReason || sheetItem.deleteReason || "Deleted item",
        });
      } else {
        merged.push({
          ...localItem,
          ...sheetItem,
          image: sheetItem.image || localItem?.image || "",
        });
      }
      localMap.delete(id);
    });

    localMap.forEach((localItem) => {
      if (tombstones.has(String(localItem.id)) || isDeletedFlag(localItem.isDeleted)) {
        merged.push({ ...localItem, isDeleted: true });
      } else {
        merged.unshift(localItem);
      }
    });

    return merged;
  }

  async function loadFromSheets() {
    try {
      setSyncStatus("Syncing...");
      const data = await apiGet("getAllData");

      const sheetItems = Array.isArray(data?.items) ? data.items : [];
      if (sheetItems.length > 0) {
        setItems((prev) => {
          const merged = mergeSheetItems(prev, sheetItems);
          persistAll({ items: merged });
          return merged;
        });
      }

      if (Array.isArray(data?.logs)) setLogs((prev) => mergeRowsById(prev, data.logs, normalizeLog));
      if (Array.isArray(data?.users)) setUsers((prev) => mergeRowsById(prev, data.users, normalizeUser));
      if (Array.isArray(data?.sales)) setSales((prev) => mergeRowsById(prev, data.sales, normalizeSale));
      if (Array.isArray(data?.operationOrders)) setOperationOrders((prev) => mergeRowsById(prev, data.operationOrders, normalizeOperation));

      setSyncStatus("Synced successfully");
    } catch (error) {
      console.error(error);
      setSyncError(error?.message || "Sync failed");
      setSyncStatus("Sheet load failed; keeping local data");
    }
  }

  useEffect(() => {
    loadFromSheets();
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    if (currentPage !== "Document Scanning") {
      stopScanner();
      return;
    }
    const timer = setTimeout(() => startScanner(), 500);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    persistAll();
  }, [items, logs, users, sales, operationOrders, deletedItemIds, currentRole, currentUserEmail, isLoggedIn]);

  useEffect(() => {
    const openItemFromHash = () => {
      const params = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
      const sku = params.get("item");
      if (!sku) return;
      const found = enrichedItems.find((item) => String(item.id) === String(sku) || String(item.barcode || "") === String(sku));
      if (found) {
        setSelectedItemId(found.id);
        setSearch("");
        setCategory("All");
        setCurrentPage("Inventory");
        setMobileDetailsOpen(true);
      }
    };
    openItemFromHash();
    window.addEventListener("hashchange", openItemFromHash);
    return () => window.removeEventListener("hashchange", openItemFromHash);
  }, [enrichedItems]);

  function openMetricView(metric) {
    if (metric === "Low Stock") setSearch("Low");
    else if (metric === "Critical") setSearch("Critical");
    else setSearch("");
    setCategory("All");
    setCurrentPage(metric === "Sales Value" ? "Sales" : "Inventory");
  }

  function selectItem(item) {
    setSelectedItemId(item.id);
    setMobileDetailsOpen(true);
  }

  function openAddItem() {
    setItemFormMode("add");
    setItemForm({ ...emptyItemForm, id: `SKU-${Date.now()}`, dateAdded: bangkokDate(), updatedAt: bangkokNow() });
    setItemFormOpen(true);
  }

  function openEditItem(item) {
    setItemFormMode("edit");
    setItemForm({
      ...item,
      price: String(item.price ?? ""),
      stock: String(item.stock ?? ""),
      minStock: String(item.minStock ?? ""),
      capacity: String(item.capacity ?? ""),
    });
    setItemFormOpen(true);
  }

  async function saveItem(e) {
    e.preventDefault();
    if (itemFormMode === "add" && !permissions.canCreateItem) return;
    if (itemFormMode === "edit" && !permissions.canEditItem) return;

    const normalized = normalizeItem({
      ...itemForm,
      id: itemForm.id || `SKU-${Date.now()}`,
      updatedAt: bangkokNow(),
      dateAdded: itemForm.dateAdded || bangkokDate(),
      isDeleted: false,
      deletedAt: "",
      deletedBy: "",
      deleteReason: "",
    });

    const nextDeletedIds = deletedItemIds.filter((id) => String(id) !== String(normalized.id));
    const updatedItems =
      itemFormMode === "add"
        ? [normalized, ...items.filter((item) => String(item.id) !== String(normalized.id))]
        : items.map((item) => (String(item.id) === String(normalized.id) ? normalized : item));

    setDeletedItemIds(nextDeletedIds);
    setItems(updatedItems);
    setSelectedItemId(normalized.id);
    setItemFormOpen(false);

    await pushAllToSheets(
      { items: updatedItems, logs, users, sales, operationOrders, deletedItemIds: nextDeletedIds },
      { action: itemFormMode === "add" ? "SAVE_ITEM" : "UPDATE_ITEM", item: normalized }
    );
  }

  function openRestock(item) {
    setSelectedItemId(item.id);
    setRestockForm({
      quantity: "",
      date: bangkokDate(),
      reason: "",
      type: "restock",
      updatedBy: currentUser?.name || currentUser?.username || currentUserEmail || "User",
    });
    setRestockOpen(true);
  }

  async function saveRestock(e) {
    e.preventDefault();
    if (!permissions.canEditStock) return;

    const itemToUpdate = items.find((item) => String(item.id) === String(selectedItemId));
    if (!itemToUpdate) {
      alert("Please select an item to restock.");
      return;
    }

    const quantity = Number(restockForm.quantity);
    if (!quantity || quantity <= 0 || Number.isNaN(quantity)) {
      alert("Please enter a valid quantity.");
      return;
    }

    setRestockSaveStatus("restocking");
    const previousQty = Number(itemToUpdate.stock || 0);
    const negativeTypes = ["stock_out", "damaged"];
    const change = negativeTypes.includes(restockForm.type) ? quantity * -1 : quantity;
    const newQty = Math.max(0, previousQty + change);

    const updatedItems = items.map((item) =>
      String(item.id) === String(itemToUpdate.id)
        ? { ...item, stock: newQty, updatedAt: bangkokNow() }
        : item
    );

    const logEntry = {
      id: Date.now(),
      sku: itemToUpdate.id,
      itemName: itemToUpdate.name,
      previousQty,
      change,
      newQty,
      reason: restockForm.reason || "No reason provided",
      type: restockForm.type,
      updatedBy: currentUser?.name || currentUser?.username || currentUserEmail || "Admin",
      timestamp: bangkokNow(),
    };

    const updatedLogs = [logEntry, ...logs];

    setItems(updatedItems);
    setLogs(updatedLogs);
    persistAll({ items: updatedItems, logs: updatedLogs });

    await pushAllToSheets({ items: updatedItems, logs: updatedLogs, users, sales, operationOrders }, { action: "RESTOCK", log: logEntry });

    setRestockSaveStatus("saved");
    setTimeout(() => {
      setRestockSaveStatus("idle");
      setRestockOpen(false);
    }, 900);
  }

  async function saveSale(e) {
    e.preventDefault();
    if (!permissions.canProcessSales) return;
    setSaleSaveStatus("saving");

    const item = enrichedItems.find((x) => String(x.id) === String(saleForm.sku));
    if (!item) {
      alert("Please select an item to sell.");
      setSaleSaveStatus("idle");
      return;
    }

    const qty = Number(saleForm.quantity);
    if (!qty || qty <= 0 || qty > Number(item.stock)) {
      alert("Please enter a valid sale quantity that does not exceed current stock.");
      setSaleSaveStatus("idle");
      return;
    }

    const updatedItems = items.map((x) =>
      String(x.id) === String(item.id) ? { ...x, stock: Math.max(0, Number(x.stock || 0) - qty), updatedAt: bangkokNow() } : x
    );

    const saleEntry = {
      id: Date.now(),
      sku: item.id,
      itemName: item.name,
      quantity: qty,
      price: Number(item.price),
      total: qty * Number(item.price),
      soldBy: currentUser?.name || currentUser?.username || currentUserEmail || saleForm.soldBy || "User",
      customer: saleForm.customer || "Walk-in Customer",
      timestamp: bangkokNow(),
    };

    const logEntry = {
      id: Date.now() + 1,
      sku: item.id,
      itemName: item.name,
      previousQty: Number(item.stock),
      change: qty * -1,
      newQty: Number(item.stock) - qty,
      reason: `Sale to ${saleEntry.customer}`,
      type: "sale",
      updatedBy: saleEntry.soldBy,
      timestamp: saleEntry.timestamp,
    };

    const updatedSales = [saleEntry, ...sales];
    const updatedLogs = [logEntry, ...logs];

    setItems(updatedItems);
    setSales(updatedSales);
    setLogs(updatedLogs);

    await pushAllToSheets(
      { items: updatedItems, logs: updatedLogs, users, sales: updatedSales, operationOrders },
      { action: "SALE", sale: saleEntry, log: logEntry }
    );

    setSaleSaveStatus("saved");
    setTimeout(() => {
      setSaleSaveStatus("idle");
      setSaleForm({ ...emptySaleForm, soldBy: currentUser?.name || currentUser?.username || currentUserEmail || "User" });
    }, 900);
  }

  async function confirmDeleteItem() {
    if (!deleteDialog.item) return;
    const reason = deleteDialog.reason?.trim();
    if (!reason) {
      alert("Please state the reason before deleting this item.");
      return;
    }

    const itemToDelete = deleteDialog.item;
    const deletedItem = {
      ...itemToDelete,
      isDeleted: true,
      deletedAt: bangkokNow(),
      deletedBy: currentUser?.name || currentUserEmail || "Admin",
      deleteReason: reason,
    };

    const updatedItems = items.some((item) => String(item.id) === String(itemToDelete.id))
      ? items.map((item) => (String(item.id) === String(itemToDelete.id) ? { ...item, ...deletedItem } : item))
      : [deletedItem, ...items];

    const nextDeletedIds = Array.from(new Set([...deletedItemIds.map(String), String(itemToDelete.id)]));

    const deleteLog = {
      id: Date.now(),
      sku: itemToDelete.id,
      itemName: itemToDelete.name,
      previousQty: itemToDelete.stock,
      change: 0,
      newQty: itemToDelete.stock,
      reason: `Deleted item - ${reason}`,
      type: "delete",
      updatedBy: currentUser?.name || currentUserEmail || "Admin",
      timestamp: bangkokNow(),
    };

    const updatedLogs = [deleteLog, ...logs];

    setItems(updatedItems);
    setLogs(updatedLogs);
    setDeletedItemIds(nextDeletedIds);
    setDeleteDialog({ open: false, item: null, reason: "" });
    setUndoDelete({ open: true, item: deletedItem });
    setSelectedItemId(null);
    setMobileDetailsOpen(false);

    await pushAllToSheets(
      { items: updatedItems, logs: updatedLogs, users, sales, operationOrders, deletedItemIds: nextDeletedIds },
      { action: "DELETE_ITEM", item: deletedItem, log: deleteLog }
    );
  }

  async function handleUndoDelete(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!undoDelete.item) return;

    const itemToRestore = {
      ...undoDelete.item,
      isDeleted: false,
      deletedAt: "",
      deletedBy: "",
      deleteReason: "",
      updatedAt: bangkokNow(),
    };

    const updatedItems = items.some((item) => String(item.id) === String(itemToRestore.id))
      ? items.map((item) => (String(item.id) === String(itemToRestore.id) ? itemToRestore : item))
      : [itemToRestore, ...items];

    const nextDeletedIds = deletedItemIds.filter((id) => String(id) !== String(itemToRestore.id));
    const undoLog = {
      id: Date.now(),
      sku: itemToRestore.id,
      itemName: itemToRestore.name,
      previousQty: itemToRestore.stock,
      change: 0,
      newQty: itemToRestore.stock,
      reason: `Undo delete: ${itemToRestore.name}`,
      type: "undo_delete",
      updatedBy: currentUser?.name || currentUserEmail || "Admin",
      timestamp: bangkokNow(),
    };

    const updatedLogs = [undoLog, ...logs];

    setItems(updatedItems);
    setLogs(updatedLogs);
    setDeletedItemIds(nextDeletedIds);
    setUndoDelete({ open: false, item: null });

    await pushAllToSheets(
      { items: updatedItems, logs: updatedLogs, users, sales, operationOrders, deletedItemIds: nextDeletedIds },
      { action: "UNDO_DELETE", item: itemToRestore, log: undoLog }
    );
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setItemForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function triggerImagePicker() {
    imageInputRef.current?.click();
  }

  async function saveUser(e) {
    e.preventDefault();
    setUserSaveStatus("saving");
    setLoginError("");

    const hasExistingUsers = activeUsers.filter((u) => u.active !== false).length > 0;
    const isAdminCreatingStaff = isLoggedIn && permissions.canManageUsers;
    const isFirstAccount = !hasExistingUsers;

    if (!isAdminCreatingStaff && !isFirstAccount) {
      setLoginError("Only an Admin can create staff login accounts.");
      setUserSaveStatus("idle");
      return;
    }

    const cleanUsername = String(userForm.username || userForm.email || "").trim();
    if (!userForm.name.trim() || !cleanUsername || !userForm.password.trim()) {
      setLoginError("Please complete the name, username, and password.");
      setUserSaveStatus("idle");
      return;
    }

    const duplicate = users.some(
      (user) =>
        !user.isDeleted &&
        String(user.id) !== String(userForm.id || "") &&
        String(user.username || user.email || "").toLowerCase() === cleanUsername.toLowerCase()
    );
    if (duplicate) {
      setLoginError("This username already has an account.");
      setUserSaveStatus("idle");
      return;
    }

    const newUser = normalizeUser({
      ...userForm,
      id: userForm.id || Date.now(),
      name: userForm.name.trim(),
      username: cleanUsername,
      email: cleanUsername,
      password: userForm.password.trim(),
      role: isFirstAccount ? "admin" : userForm.role || "warehouse",
      active: true,
      isDeleted: false,
    });

    const updatedUsers = users.some((user) => String(user.id) === String(newUser.id))
      ? users.map((user) => (String(user.id) === String(newUser.id) ? newUser : user))
      : [...users, newUser];

    setUsers(updatedUsers);
    await pushAllToSheets({ items, logs, users: updatedUsers, sales, operationOrders }, { action: "SAVE_USER", user: newUser });

    setUserForm(emptyUserForm);
    setUserFormOpen(false);
    setLoginError("");
    setUserSaveStatus("saved");
    setTimeout(() => setUserSaveStatus("idle"), 1200);
  }

  async function toggleUserActive(id) {
    if (!permissions.canManageUsers) return;
    const updatedUsers = users.map((u) =>
      String(u.id) === String(id) ? { ...u, active: !u.active, updatedAt: bangkokNow() } : u
    );
    setUsers(updatedUsers);
    await pushAllToSheets({ items, logs, users: updatedUsers, sales, operationOrders }, { action: "TOGGLE_USER" });
  }

  async function deleteUser(id) {
    if (!permissions.canManageUsers) return;
    const userToDelete = users.find((u) => String(u.id) === String(id));
    if (!userToDelete) return;
    if (String(userToDelete.username || userToDelete.email || "") === String(currentUserEmail || "")) {
      setLoginError("You cannot delete the account currently logged in.");
      return;
    }
    const updatedUsers = users.map((u) =>
      String(u.id) === String(id) ? { ...u, active: false, isDeleted: true, deletedAt: bangkokNow() } : u
    );
    setUsers(updatedUsers);
    await pushAllToSheets({ items, logs, users: updatedUsers, sales, operationOrders }, { action: "DELETE_USER", user: userToDelete });
  }

  async function handleCreateAdmin(e) {
    e.preventDefault();
    const username = setupForm.email.trim();
    const password = setupForm.password.trim();

    if (!setupForm.name.trim() || !username || !password) {
      setLoginError("Please complete the name, username, and password.");
      return;
    }

    const adminUser = normalizeUser({
      id: Date.now(),
      name: setupForm.name.trim(),
      username,
      email: username,
      password,
      role: "admin",
      active: true,
      isDeleted: false,
    });

    const updatedUsers = [adminUser];
    setUsers(updatedUsers);
    setCurrentUserEmail(adminUser.username);
    setCurrentRole("admin");
    setIsLoggedIn(true);
    setLoginOpen(false);
    setLoginError("");
    setSetupForm({ name: "", email: "", password: "" });

    await pushAllToSheets(
      { items, logs, users: updatedUsers, sales, operationOrders, currentRole: "admin", currentUserEmail: adminUser.username, isLoggedIn: true },
      { action: "CREATE_ADMIN", user: adminUser }
    );
  }

  function handleLogin(e) {
    e.preventDefault();
    const selectedEmail = loginForm.email || activeUsers[0]?.username || activeUsers[0]?.email || "";
    const found = users.map(normalizeUser).find(
      (u) =>
        !u.isDeleted &&
        u.active !== false &&
        String(u.username || u.email || "").toLowerCase() === String(selectedEmail).toLowerCase() &&
        String(u.password || "") === String(loginForm.password || "")
    );

    if (!found) {
      setLoginError("Invalid username or password.");
      return;
    }

    setCurrentUserEmail(found.username || found.email);
    setCurrentRole(found.role);
    setIsLoggedIn(true);
    setLoginOpen(false);
    setLoginError("");
    setLoginForm((prev) => ({ ...prev, email: found.username || found.email, password: "" }));
    writeSavedData({ items, logs, users, sales, operationOrders, deletedItemIds, currentRole: found.role, currentUserEmail: found.username || found.email, isLoggedIn: true });
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentUserEmail("");
    setCurrentRole("viewer");
    setCurrentPage("Dashboard");
    setSelectedItemId(null);
    setMobileDetailsOpen(false);
    writeSavedData({ items, logs, users, sales, operationOrders, deletedItemIds, currentRole: "viewer", currentUserEmail: "", isLoggedIn: false });
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (!isLoggedIn || !currentUser) {
      setLoginError("Please log in first.");
      return;
    }
    if (String(currentUser.password || "") !== String(passwordForm.currentPassword || "")) {
      setLoginError("Current password is incorrect.");
      return;
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 4) {
      setLoginError("New password must be at least 4 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setLoginError("New passwords do not match.");
      return;
    }

    setPasswordSaveStatus("saving");
    const updatedUsers = users.map((u) =>
      String(u.id) === String(currentUser.id) ? { ...u, password: passwordForm.newPassword, updatedAt: bangkokNow() } : u
    );

    setUsers(updatedUsers);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLoginError("");
    await pushAllToSheets({ items, logs, users: updatedUsers, sales, operationOrders }, { action: "CHANGE_PASSWORD" });
    setPasswordSaveStatus("saved");
    setTimeout(() => setPasswordSaveStatus("idle"), 1200);
  }

  function handleScanValue(rawValue) {
    if (!rawValue) return;
    const cleanValue = String(rawValue).trim().toLowerCase();

    let extractedValue = cleanValue;
    try {
      const parsed = JSON.parse(rawValue);
      extractedValue = String(parsed.sku || parsed.id || parsed.barcode || rawValue).trim().toLowerCase();
    } catch {}

    const found = enrichedItems.find((item) => {
      const values = [item.id, item.sku, item.barcode, item.name].map((v) => String(v || "").trim().toLowerCase());
      return values.some((v) => v && (v === extractedValue || cleanValue.includes(v) || extractedValue.includes(v)));
    });

    if (found) {
      setSelectedItemId(found.id);
      setScannerStatus(`Matched item: ${found.id}`);
      setCurrentPage("Inventory");
      setMobileDetailsOpen(true);
      setTimeout(() => stopScanner(), 300);
    } else {
      setScannerStatus(`No matching item found: ${rawValue}`);
    }
  }

  async function startScanner() {
    try {
      if (!scannerRef.current) return;
      if (scannerInstanceRef.current) return;
      const html5QrCode = new Html5Qrcode(scannerRef.current.id);
      scannerInstanceRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 220 },
        (decodedText) => {
          setScannerStatus(`Scanned: ${decodedText}`);
          handleScanValue(decodedText);
          stopScanner();
        },
        () => {}
      );
      setScannerEnabled(true);
      setScannerStatus("Camera scanning started");
    } catch (error) {
      console.error(error);
      setScannerStatus("Unable to start camera scanner");
    }
  }

  async function stopScanner() {
    try {
      if (scannerInstanceRef.current) {
        await scannerInstanceRef.current.stop();
        await scannerInstanceRef.current.clear();
        scannerInstanceRef.current = null;
      }
    } catch {}
    setScannerEnabled(false);
  }

  function sendReorderEmail(item) {
    if (!permissions.canReorder) return;
    const subject = encodeURIComponent(`Reorder Request - ${item.id} ${item.name}`);
    const body = encodeURIComponent(`Hello,

Please prepare a reorder for the following item:

SKU: ${item.id}
Item: ${item.name}
Current Stock: ${item.stock}
Minimum Stock: ${item.minStock}
Preferred Quantity:

Thank you.`);
    window.location.href = `mailto:${item.supplierEmail || ""}?subject=${subject}&body=${body}`;
  }

  function printLabel(item) {
    const html = `
      <html><head><title>Print Label</title><style>
        body { font-family: Arial, sans-serif; padding: 24px; }
        .label { border: 1px solid #ccc; border-radius: 16px; padding: 16px; width: 320px; }
        .sku { font-size: 12px; color: #666; }
        .name { font-size: 20px; font-weight: bold; margin: 8px 0; }
        .meta { margin-top: 6px; font-size: 14px; }
      </style></head><body>
        <div class="label">
          <div class="sku">${item.id}</div>
          <div class="name">${item.name}</div>
          <div class="meta">${item.material}</div>
          <div class="meta">${formatCurrency(item.price)}</div>
          <div class="meta">${item.barcode || ""}</div>
        </div>
        <script>window.onload = () => window.print()</script>
      </body></html>
    `;
    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
  }

  async function downloadQrCode() {
    if (!qrDownloadRef.current || !qrModalItem) return;
    const canvas = await html2canvas(qrDownloadRef.current);
    const link = document.createElement("a");
    link.download = `${qrModalItem.id}-qr.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function saveOperationOrder(e) {
    e.preventDefault();
    if (!permissions.canManageUsers) return;
    setOperationSaveStatus("saving");
    const order = normalizeOperation({ ...operationForm, id: Date.now(), createdAt: bangkokNow() });
    const updatedOrders = [order, ...operationOrders];
    setOperationOrders(updatedOrders);
    await pushAllToSheets({ items, logs, users, sales, operationOrders: updatedOrders }, { action: "SAVE_OPERATION", item: order });
    setOperationForm(emptyOperationForm);
    setOperationSaveStatus("saved");
    setTimeout(() => setOperationSaveStatus("idle"), 1000);
  }

  function goPage(page) {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setMobileDetailsOpen(false);
  }

  const renderHeader = (title, subtitle) => (
    <div className="mb-6 flex items-center gap-3">
      <button onClick={() => setMobileMenuOpen(true)} className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      {currentPage !== "Dashboard" && (
        <button onClick={() => goPage("Dashboard")} className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-500 sm:text-lg">{subtitle}</p>}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        {renderHeader("Dashboard", "Track stock reliability, value, and recent activity")}
        <div className="ml-auto flex items-center gap-3">
          {["THB", "USD"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                currency === code ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {code}
            </button>
          ))}
          <select value={currency === "THB" || currency === "USD" ? "" : currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
            <option value="" disabled>More</option>
            {["EUR", "GBP", "SGD", "JPY", "PHP", "CAD", "CNY", "AUD"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="Inventory Value" value={formatCurrency(totalValue)} subtitle="Current total value" icon={Gem} onClick={() => openMetricView("Inventory Value")} />
        <MetricCard title="Total Units" value={totalUnits} subtitle="All stock on hand" icon={Package} onClick={() => openMetricView("Total Units")} />
        <MetricCard title="Low Stock" value={lowCount} subtitle="Needs attention" icon={ClipboardList} onClick={() => openMetricView("Low Stock")} />
        <MetricCard title="Critical" value={criticalCount} subtitle="Restock urgently" icon={RotateCcw} onClick={() => openMetricView("Critical")} />
        <MetricCard title="Sales Value" value={formatCurrency(totalSalesValue)} subtitle="Recorded sales" icon={Receipt} onClick={() => openMetricView("Sales Value")} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Latest</span>
          </div>
          <div className="space-y-3">
            {logs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{log.itemName || log.sku}</p>
                    <p className="mt-1 text-sm text-slate-500">{log.type} • {log.updatedBy} • {log.timestamp}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${Number(log.change) >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {Number(log.change) >= 0 ? `+${log.change}` : log.change}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Previous: {log.previousQty} → New: {log.newQty} • {log.reason}</p>
              </div>
            ))}
            {logs.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No recent activity yet.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Stock Overview</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Live</span>
          </div>
          <div className="space-y-4">
            {enrichedItems.slice(0, 7).map((item) => {
              const width = item.capacity > 0 ? Math.max(8, Math.min(100, (item.stock / item.capacity) * 100)) : 8;
              return (
                <button key={item.id} type="button" onClick={() => selectItem(item)} className="w-full rounded-2xl border border-slate-100 p-3 text-left hover:border-violet-300 hover:bg-violet-50">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <span className="text-slate-500">{item.stock}/{item.capacity}</span>
                  </div>
                  <div className="h-4 rounded-full bg-slate-100">
                    <div className={`h-4 rounded-full ${progressClasses(item.status)}`} style={{ width: `${width}%` }} />
                  </div>
                </button>
              );
            })}
            {enrichedItems.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No inventory items yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className={`grid gap-6 ${selectedItem ? "xl:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>
      <div className="min-w-0">
        <div className="border-b border-slate-200 px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            {renderHeader("Inventory", `${filteredItems.length} of ${enrichedItems.length} items`)}
            <div className="flex flex-wrap items-center gap-3">
              <AppButton className="h-12 px-6" onClick={openAddItem} disabled={!permissions.canCreateItem}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </AppButton>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SKU, name, material..." className="h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-base outline-none" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-600">
              <ShieldCheck className="h-4 w-4" /> {roles[currentRole]?.label}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-4 py-2 text-sm sm:px-5 sm:text-base ${category === c ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="overflow-x-auto rounded-[28px] border border-slate-200">
            <table className="min-w-[980px] w-full border-collapse text-xs xl:text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs text-slate-500">
                  <th className="px-3 py-3"></th>
                  {["SKU", "Name", "Category", "Material", "Price", "Stock", "Location", "Status", "Actions"].map((head) => (
                    <th key={head} className="px-3 py-3 font-medium">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const progress = item.capacity > 0 ? `${Math.max(0, Math.min(100, (item.stock / item.capacity) * 100))}%` : "0%";
                  return (
                    <tr key={item.id} id={`item-row-${item.id}`} className={`border-t border-slate-200 transition hover:bg-violet-50/40 ${selectedItem?.id === item.id ? "bg-violet-100" : "bg-white"}`}>
                      <td className="px-3 py-3">
                        <button onClick={() => selectItem(item)} className="rounded-2xl outline-none focus:ring-2 focus:ring-violet-500">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                            {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <Gem className="h-6 w-6 text-slate-400" />}
                          </div>
                        </button>
                      </td>
                      <td className="px-3 py-3"><button onClick={() => selectItem(item)} className="font-semibold text-violet-700 underline">{item.id}</button></td>
                      <td className="px-3 py-3"><button onClick={() => selectItem(item)} className="font-semibold text-violet-700 underline">{item.name}</button></td>
                      <td className="px-3 py-3 text-slate-500">{item.category}</td>
                      <td className="px-3 py-3 text-slate-500">{item.material}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{formatCurrency(item.price)}</td>
                      <td className="px-3 py-3"><span className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${statusClasses(item.status)}`}>{item.stock}</span></td>
                      <td className="px-3 py-3 text-slate-500">{item.location || "—"}</td>
                      <td className="px-3 py-3">
                        <div className="min-w-[140px]">
                          <div className="h-4 w-full rounded-full bg-slate-100">
                            <div className={`h-4 rounded-full ${progressClasses(item.status)}`} style={{ width: progress }} />
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(item.status)}`}>{item.status}</span>
                            <span className="text-xs text-slate-500">{item.stock}/{item.capacity}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQrModalItem(item)} className="rounded-xl border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"><QrCode className="h-4 w-4" /></button>
                          <button disabled={!permissions.canEditStock} onClick={() => openRestock(item)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                          <button disabled={!permissions.canReorder} onClick={() => sendReorderEmail(item)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"><Mail className="h-4 w-4" /></button>
                          <button disabled={!permissions.canEditItem} onClick={() => openEditItem(item)} className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"><Pencil className="h-4 w-4" /></button>
                          <button disabled={!permissions.canDelete} onClick={() => setDeleteDialog({ open: true, item, reason: "" })} className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredItems.length === 0 && (
                  <tr><td colSpan="10" className="px-4 py-8 text-center text-slate-500">No matching items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-slate-500">Showing {filteredItems.length} of {enrichedItems.length} items</p>
        </div>
      </div>

      {selectedItem && (
        <aside className={`${mobileDetailsOpen ? "fixed inset-0 z-40 overflow-y-auto bg-white p-4 xl:static xl:z-auto xl:p-0" : "hidden xl:block"} border-l border-slate-200 bg-white`}>
          <div className="sticky top-0 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Item Details</h2>
              <button className="rounded-xl p-2 hover:bg-slate-100" onClick={() => setMobileDetailsOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
                  {selectedItem.image ? <img src={selectedItem.image} alt={selectedItem.name} className="h-full w-full object-cover" /> : <Gem className="h-10 w-10 text-slate-400" />}
                </div>
                <div>
                  <p className="text-sm text-slate-500">{selectedItem.id}</p>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedItem.name}</h3>
                  <p className="text-sm text-slate-500">{selectedItem.category} • {selectedItem.material}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <SummaryCard label="Price" value={formatCurrency(selectedItem.price)} />
                <SummaryCard label="Stock" value={`${selectedItem.stock}/${selectedItem.capacity}`} />
                <SummaryCard label="Location" value={selectedItem.location || "—"} />
                <SummaryCard label="Status" value={selectedItem.status} />
                <SummaryCard label="Barcode" value={selectedItem.barcode || "—"} />
                <SummaryCard label="Supplier" value={selectedItem.supplier || "—"} />
              </div>

              <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{selectedItem.description || "No description."}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <AppButton variant="outline" onClick={() => printLabel(selectedItem)}><Printer className="mr-2 h-4 w-4" /> Print</AppButton>
                <AppButton onClick={() => openRestock(selectedItem)} disabled={!permissions.canEditStock}><RotateCcw className="mr-2 h-4 w-4" /> Restock</AppButton>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">Stock Adjustment History</h3>
              <div className="mt-3 space-y-3">
                {itemLogs.slice(0, 7).map((log) => (
                  <div key={log.id} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-800">{log.type} • {Number(log.change) >= 0 ? `+${log.change}` : log.change}</p>
                    <p className="text-slate-500">{log.timestamp} • {log.updatedBy}</p>
                    <p className="text-slate-600">{log.reason}</p>
                  </div>
                ))}
                {itemLogs.length === 0 && <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">No logs yet.</p>}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );

  const renderRestockPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Restock Form", "View stock adjustments. Staff login is required to save changes.")}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold text-slate-900">Select an item to adjust</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {enrichedItems.map((item) => (
            <button key={item.id} onClick={() => openRestock(item)} className="rounded-2xl border border-slate-200 p-4 text-left hover:border-violet-300 hover:bg-violet-50">
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{item.id} • Stock {item.stock}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSalesPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Sales", "View sales records. Staff login is required to record a sale.")}
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={saveSale} className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Record Sale</h2>
          <div className="mt-4 space-y-4">
            <Field label="Item">
              <select value={saleForm.sku} onChange={(e) => setSaleForm((prev) => ({ ...prev, sku: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option value="">Select item</option>
                {enrichedItems.map((item) => <option key={item.id} value={item.id}>{item.id} - {item.name}</option>)}
              </select>
            </Field>
            <Field label="Quantity"><input type="number" min="1" value={saleForm.quantity} onChange={(e) => setSaleForm((prev) => ({ ...prev, quantity: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <Field label="Customer"><input value={saleForm.customer} onChange={(e) => setSaleForm((prev) => ({ ...prev, customer: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Walk-in Customer" /></Field>
            <AppButton type="submit" className={`h-12 w-full ${saleSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`} disabled={!permissions.canProcessSales || saleSaveStatus === "saving"}>
              {saleSaveStatus === "saving" ? "Saving..." : saleSaveStatus === "saved" ? "Saved ✓" : "Save Sale"}
            </AppButton>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Sales Records</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead><tr className="text-left text-slate-500">{["Date", "SKU", "Item", "Qty", "Total", "Sold By"].map((h) => <th key={h} className="py-3">{h}</th>)}</tr></thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-t border-slate-100">
                    <td className="py-3">{sale.timestamp}</td><td>{sale.sku}</td><td>{sale.itemName}</td><td>{sale.quantity}</td><td>{formatCurrency(sale.total)}</td><td>{sale.soldBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sales.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No sales yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderScanPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Document Scanning", "Scan QR codes to find items instantly")}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">QR Scanner</h2>
          <span className="text-sm text-slate-500">{scannerStatus}</span>
        </div>
        <div id="qr-reader" ref={scannerRef} className="min-h-[320px] overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50" />
        <div className="mt-5 flex flex-wrap gap-3">
          <AppButton type="button" onClick={startScanner} disabled={scannerEnabled}><Camera className="mr-2 h-4 w-4" /> Start Camera</AppButton>
          <AppButton type="button" variant="outline" onClick={stopScanner}><X className="mr-2 h-4 w-4" /> Stop</AppButton>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 p-4">
          <Field label="Manual SKU / Barcode / QR text">
            <div className="flex gap-3">
              <input value={manualScan} onChange={(e) => setManualScan(e.target.value)} className="h-12 flex-1 rounded-2xl border border-slate-200 px-4 outline-none" placeholder="Paste scanned value here" />
              <AppButton type="button" onClick={() => handleScanValue(manualScan)}>Find</AppButton>
            </div>
          </Field>
        </div>
      </div>
    </div>
  );

  const renderUsersPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Users", "Role management UI for internal stock access")}
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={saveUser} className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">{activeUsers.length === 0 ? "Create Admin Account" : "Create Staff Account"}</h2>
          <div className="mt-4 space-y-4">
            <Field label="Name"><input value={userForm.name} onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <Field label="Username / Email"><input value={userForm.email} onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value, username: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <Field label="Password"><input type="password" value={userForm.password} onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <Field label="Role">
              <select value={userForm.role} onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                <option value="warehouse">Staff</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </Field>
            {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
            <AppButton type="submit" className={`h-12 w-full ${userSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`} disabled={userSaveStatus === "saving" || (activeUsers.length > 0 && !permissions.canManageUsers)}>
              <UserCog className="mr-2 h-4 w-4" /> {userSaveStatus === "saving" ? "Saving..." : userSaveStatus === "saved" ? "Saved ✓" : activeUsers.length === 0 ? "Create Admin Account" : "Create Staff Account"}
            </AppButton>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Active Users</h2>
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.username || user.email} • {roles[user.role]?.label || user.role}</p>
                </div>
                <div className="flex gap-2">
                  <AppButton type="button" variant="outline" disabled={!permissions.canManageUsers} onClick={() => toggleUserActive(user.id)}>{user.active !== false ? "Disable" : "Activate"}</AppButton>
                  <AppButton type="button" variant="outline" disabled={!permissions.canManageUsers} onClick={() => deleteUser(user.id)}>Delete</AppButton>
                </div>
              </div>
            ))}
            {users.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No users yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOperationHub = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Operation Hub", "View job orders, payables, salaries, tax, rent, and customer information")}
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={saveOperationOrder} className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Create Document</h2>
          <div className="mt-4 space-y-4">
            <Field label="Type"><select value={operationForm.type} onChange={(e) => setOperationForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3"><option>Job Order</option><option>Payable</option><option>Salary</option><option>Tax</option><option>Rent</option><option>Customer Info</option></select></Field>
            <Field label="Title"><input value={operationForm.title} onChange={(e) => setOperationForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" /></Field>
            <Field label="Amount"><input type="number" value={operationForm.amount} onChange={(e) => setOperationForm((p) => ({ ...p, amount: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" /></Field>
            <Field label="Due Date"><input type="date" value={operationForm.dueDate} onChange={(e) => setOperationForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" /></Field>
            <Field label="Notes"><textarea value={operationForm.notes} onChange={(e) => setOperationForm((p) => ({ ...p, notes: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" rows={3} /></Field>
            <AppButton type="submit" className="h-12 w-full" disabled={!permissions.canManageUsers || operationSaveStatus === "saving"}>{operationSaveStatus === "saving" ? "Saving..." : operationSaveStatus === "saved" ? "Saved ✓" : "Save Document"}</AppButton>
          </div>
        </form>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-semibold text-slate-900">Documents</h2>
          <div className="mt-4 space-y-3">
            {operationOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold text-slate-900">{order.type}: {order.title}</p>
                <p className="text-sm text-slate-500">{formatCurrency(order.amount)} • Due {order.dueDate || "—"} • {order.status}</p>
                <p className="mt-2 text-sm text-slate-600">{order.notes}</p>
              </div>
            ))}
            {operationOrders.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No documents yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSyncPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      {renderHeader("Google Sheets Sync", "Real control panel for data load, push, and sheet health")}
      <div className="rounded-3xl border border-slate-200 bg-white p-5">
        <p className="text-slate-600">{syncStatus}</p>
        {syncError && <p className="mt-2 text-sm text-rose-600">{syncError}</p>}
        <p className="mt-2 text-sm text-slate-500">Last sync: {lastSync || "—"}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AppButton onClick={loadFromSheets} disabled={!permissions.canSync || syncBusy}><RefreshCw className="mr-2 h-4 w-4" /> Load from Sheet</AppButton>
          <AppButton variant="outline" onClick={() => pushAllToSheets({ items, logs, users, sales, operationOrders, deletedItemIds })} disabled={!permissions.canSync || syncBusy}><Cloud className="mr-2 h-4 w-4" /> Push to Sheet</AppButton>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-6 py-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <Gem className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[34px] font-semibold leading-none text-slate-900">Jewelry IMS</p>
              <p className="mt-2 text-xl text-slate-500">Inventory System</p>
            </div>
          </div>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={() => setMobileMenuOpen(false)}><X className="h-6 w-6" /></button>
        </div>
      </div>

      <div className="p-6">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">{isLoggedIn ? "Current User" : "View Only"}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-semibold text-slate-900">{currentUser?.name || "Not logged in"}</p>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{roles[currentRole]?.label || "View Only"}</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-6">
        {navItems.map((item) => (
          <SidebarItem key={item.key} icon={item.icon} label={item.key} active={currentPage === item.key} onClick={() => goPage(item.key)} />
        ))}
        {isLoggedIn && permissions.canManageUsers && <SidebarItem icon={Users} label="Users" active={currentPage === "Users"} onClick={() => goPage("Users")} />}
        {isLoggedIn && permissions.canSync && <SidebarItem icon={Cloud} label="Google Sheets Sync" active={currentPage === "Google Sheets Sync"} onClick={() => goPage("Google Sheets Sync")} />}
      </nav>

      <div className="space-y-4 px-6 pb-6">
        <div className="rounded-3xl border border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">{(currentUser?.name?.[0] || "A").toUpperCase()}</div>
            <div>
              <p className="font-semibold text-slate-900">{currentUser?.name || "Not logged in"}</p>
              <p className="text-sm text-slate-500">{currentUser?.username || "Please log in to make changes"}</p>
            </div>
          </div>
        </div>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-rose-600 hover:bg-rose-50">Log Out</button>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileMenuOpen(false);
              setLoginOpen(true);
            }}
            className="w-full rounded-2xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-700"
          >
            Log In
          </button>
        )}

        <button onClick={() => setSettingsOpen(true)} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-slate-600 hover:bg-slate-50">
          <Settings className="h-5 w-5" /> Settings
        </button>
      </div>
    </div>
  );

  const renderMain = () => {
    if (currentPage === "Dashboard") return renderDashboard();
    if (currentPage === "Inventory") return renderInventory();
    if (currentPage === "Restock") return renderRestockPage();
    if (currentPage === "Sales") return renderSalesPage();
    if (currentPage === "Document Scanning") return renderScanPage();
    if (currentPage === "Operation Hub") return renderOperationHub();
    if (currentPage === "Users") return renderUsersPage();
    if (currentPage === "Google Sheets Sync") return renderSyncPage();
    return renderDashboard();
  };

  const hasUsers = activeUsers.length > 0;

  return (
    <div className="min-h-screen bg-[#f8f8fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[330px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">{renderSidebar()}</aside>

        <main className="min-w-0 overflow-x-hidden">{renderMain()}</main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileMenuOpen(false)} aria-label="Close mobile menu" />
          <aside className="relative h-full w-[86vw] max-w-[370px] overflow-y-auto bg-white shadow-2xl">{renderSidebar()}</aside>
        </div>
      )}

      {restockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveRestock} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Stock Adjustment</h2>
                <p className="mt-1 text-slate-500">{selectedItem?.id} • {selectedItem?.name}</p>
              </div>
              <button type="button" onClick={() => setRestockOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Quantity"><input type="number" min="1" value={restockForm.quantity} onChange={(e) => setRestockForm((p) => ({ ...p, quantity: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Enter quantity" /></Field>
              <Field label="Date"><input type="date" value={restockForm.date} onChange={(e) => setRestockForm((p) => ({ ...p, date: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            </div>
            <div className="mt-4">
              <Field label="Adjustment Type">
                <select value={restockForm.type} onChange={(e) => setRestockForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                  <option value="restock">Restock</option>
                  <option value="correction">Correction Add</option>
                  <option value="stock_out">Stock Out</option>
                  <option value="damaged">Damaged</option>
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Reason"><textarea value={restockForm.reason} onChange={(e) => setRestockForm((p) => ({ ...p, reason: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" rows={4} placeholder="Example: delivery received, damaged item, recount" /></Field>
            </div>
            <div className="mt-4">
              <Field label="Updated By"><input value={restockForm.updatedBy} onChange={(e) => setRestockForm((p) => ({ ...p, updatedBy: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <AppButton type="button" variant="outline" className="h-12" onClick={() => setRestockOpen(false)}>Cancel</AppButton>
              <AppButton type="submit" className={`h-12 ${restockSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`} disabled={!permissions.canEditStock || restockSaveStatus === "restocking"}>
                {restockSaveStatus === "restocking" ? "Saving..." : restockSaveStatus === "saved" ? "Saved ✓" : "Save Adjustment"}
              </AppButton>
            </div>
          </form>
        </div>
      )}

      {itemFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={saveItem} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">{itemFormMode === "add" ? "Add Item" : "Edit Item"}</h2>
              <button type="button" onClick={() => setItemFormOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="SKU"><input value={itemForm.id} onChange={(e) => setItemForm((p) => ({ ...p, id: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Name"><input value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" required /></Field>
              <Field label="Category"><select value={itemForm.category} onChange={(e) => setItemForm((p) => ({ ...p, category: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">{categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Material"><input value={itemForm.material} onChange={(e) => setItemForm((p) => ({ ...p, material: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Price"><input type="number" value={itemForm.price} onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Stock"><input type="number" value={itemForm.stock} onChange={(e) => setItemForm((p) => ({ ...p, stock: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Min Stock"><input type="number" value={itemForm.minStock} onChange={(e) => setItemForm((p) => ({ ...p, minStock: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Capacity"><input type="number" value={itemForm.capacity} onChange={(e) => setItemForm((p) => ({ ...p, capacity: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Barcode"><input value={itemForm.barcode} onChange={(e) => setItemForm((p) => ({ ...p, barcode: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Location"><input value={itemForm.location} onChange={(e) => setItemForm((p) => ({ ...p, location: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Supplier"><input value={itemForm.supplier} onChange={(e) => setItemForm((p) => ({ ...p, supplier: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Supplier Email"><input value={itemForm.supplierEmail} onChange={(e) => setItemForm((p) => ({ ...p, supplierEmail: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Weight"><input value={itemForm.weight} onChange={(e) => setItemForm((p) => ({ ...p, weight: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
              <Field label="Stone"><input value={itemForm.stone} onChange={(e) => setItemForm((p) => ({ ...p, stone: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            </div>
            <div className="mt-4">
              <Field label="Description"><textarea value={itemForm.description} onChange={(e) => setItemForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" rows={3} /></Field>
            </div>
            <div className="mt-4">
              <Field label="Image">
                <div className="flex flex-wrap items-center gap-3">
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <AppButton type="button" variant="outline" onClick={triggerImagePicker}><ImageIcon className="mr-2 h-4 w-4" /> Upload Image</AppButton>
                  <input value={itemForm.image} onChange={(e) => setItemForm((p) => ({ ...p, image: e.target.value }))} placeholder="or paste image URL" className="h-10 flex-1 rounded-2xl border border-slate-200 px-4 outline-none" />
                </div>
              </Field>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <AppButton type="button" variant="outline" className="h-12" onClick={() => setItemFormOpen(false)}>Cancel</AppButton>
              <AppButton type="submit" className="h-12"><Save className="mr-2 h-4 w-4" /> Save Item</AppButton>
            </div>
          </form>
        </div>
      )}

      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Confirm Delete</h2>
            <p className="mt-2 text-sm text-slate-500">You are about to delete:</p>
            <p className="mt-1 font-medium text-slate-800">{deleteDialog.item?.name}</p>
            <div className="mt-4">
              <label className="text-sm text-slate-600">Reason for deletion (required)</label>
              <textarea value={deleteDialog.reason} onChange={(e) => setDeleteDialog((prev) => ({ ...prev, reason: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none" rows={3} placeholder="Enter reason." />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setDeleteDialog({ open: false, item: null, reason: "" })} className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100">Cancel</button>
              <button disabled={!deleteDialog.reason.trim()} onClick={confirmDeleteItem} className="rounded-xl bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50">Delete</button>
            </div>
          </div>
        </div>
      )}

      {undoDelete.open && undoDelete.item && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Item deleted</p>
              <p className="text-sm text-slate-500">{undoDelete.item.name} was removed.</p>
            </div>
            <button onClick={handleUndoDelete} className="rounded-xl bg-violet-600 px-4 py-2 text-sm text-white"><Undo2 className="mr-1 inline h-4 w-4" /> Undo</button>
            <button onClick={() => setUndoDelete({ open: false, item: null })} className="rounded-xl px-3 py-2 text-sm text-slate-500">Close</button>
          </div>
        </div>
      )}

      {loginOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={hasUsers ? handleLogin : handleCreateAdmin} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{hasUsers ? "Log In" : "Create First Admin Account"}</h2>
              <button type="button" onClick={() => { setLoginOpen(false); setLoginError(""); }} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-2 text-sm text-slate-500">{hasUsers ? "Use your staff username and password." : "No active admin exists yet. Create one to unlock editing."}</p>
            <div className="mt-5 space-y-4">
              {!hasUsers && <Field label="Name"><input value={setupForm.name} onChange={(e) => setSetupForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Full name" /></Field>}
              <Field label="Username / Email">
                <input value={hasUsers ? loginForm.email : setupForm.email} onChange={(e) => hasUsers ? setLoginForm((p) => ({ ...p, email: e.target.value })) : setSetupForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Username or email" />
              </Field>
              <Field label="Password">
                <input type="password" value={hasUsers ? loginForm.password : setupForm.password} onChange={(e) => hasUsers ? setLoginForm((p) => ({ ...p, password: e.target.value })) : setSetupForm((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Password" />
              </Field>
              {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
              <AppButton type="submit" className="h-12 w-full">{hasUsers ? "Log In" : "Create Admin Account"}</AppButton>
              {hasUsers && <AppButton type="button" variant="outline" className="h-12 w-full" onClick={() => { setLoginOpen(false); setCurrentRole("viewer"); setIsLoggedIn(false); }}>Continue in View-Only Mode</AppButton>}
            </div>
          </form>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
              <button onClick={() => setSettingsOpen(false)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 flex rounded-2xl bg-slate-100 p-1">
              <button onClick={() => setSettingsTab("user")} className={`flex-1 rounded-xl px-3 py-2 text-sm ${settingsTab === "user" ? "bg-white font-semibold" : ""}`}>User</button>
              <button onClick={() => setSettingsTab("sync")} className={`flex-1 rounded-xl px-3 py-2 text-sm ${settingsTab === "sync" ? "bg-white font-semibold" : ""}`}>Sync</button>
            </div>
            {settingsTab === "user" ? (
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <p className="text-sm text-slate-500">Logged in as: {currentUser?.name || "View only"}</p>
                <Field label="Current Password"><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="New Password"><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="Confirm New Password"><input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
                <AppButton type="submit" className="h-12 w-full" disabled={!isLoggedIn || passwordSaveStatus === "saving"}>{passwordSaveStatus === "saving" ? "Saving..." : passwordSaveStatus === "saved" ? "Saved ✓" : "Change Password"}</AppButton>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-slate-500">{syncStatus}</p>
                {syncError && <p className="text-sm text-rose-600">{syncError}</p>}
                <AppButton onClick={loadFromSheets} className="h-12 w-full" disabled={syncBusy}>Load from Google Sheets</AppButton>
              </div>
            )}
          </div>
        </div>
      )}

      {qrModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">QR Code</h2>
              <button onClick={() => setQrModalItem(null)} className="rounded-xl p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div ref={qrDownloadRef} className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 text-center">
              <QRCodeSVG value={JSON.stringify({ id: qrModalItem.id, sku: qrModalItem.id, barcode: qrModalItem.barcode })} size={180} includeMargin />
              <p className="mt-3 font-semibold text-slate-900">{qrModalItem.id}</p>
              <p className="text-sm text-slate-500">{qrModalItem.name}</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <AppButton variant="outline" onClick={() => printLabel(qrModalItem)}>Print</AppButton>
              <AppButton onClick={downloadQrCode}>Download</AppButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
