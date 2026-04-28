import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, JapaneseYen } from "lucide-react";
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
  ChevronRight,
  Settings,
  Mail,
  RefreshCw,
  ClipboardList,
  ShieldCheck,
  Image as ImageIcon,
  Save,
  Camera,
  UserCog,
  Database,
  Upload,
  Download,
  Wifi,
  WifiOff,
  Receipt,
} from "lucide-react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx9D0T7Yz2oELhaD5k607MCgcxGfG6G4qzfQUQzxR3TK82als1J-8zqcxY7LGYMhXt4IA/exec";

const initialItems = [
  {
    id: "RNG-001",
    name: "Diamond Solitaire Ring",
    category: "Rings",
    material: "Gold 18K",
    price: 2500,
    stock: 7,
    minStock: 3,
    capacity: 10,
    barcode: "8901234567890",
    location: "A1-03",
    weight: "3.25g",
    stone: "1.00ct, VS1, G, Excellent",
    supplier: "Diamond House",
    supplierEmail: "orders@diamondhouse.com",
    ringSize: "6.5",
    description: "18K gold solitaire ring with certified diamond",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80",
    isDeleted: false,
  },
  {
    id: "NKL-001",
    name: "Pearl Necklace",
    category: "Necklaces",
    material: "Silver 925",
    price: 850,
    stock: 2,
    minStock: 4,
    capacity: 15,
    barcode: "8901234567891",
    location: "B2-01",
    weight: "12.4g",
    stone: "Freshwater pearls",
    supplier: "Pearl House",
    supplierEmail: "orders@pearlhouse.com",
    ringSize: "—",
    description: "Elegant pearl necklace with silver clasp",
    dateAdded: "2024-04-22",
    updatedAt: "2024-05-10",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80",
    isDeleted: false,
  },
  {
    id: "EAR-001",
    name: "Sapphire Drop Earrings",
    category: "Earrings",
    material: "White Gold",
    price: 1200,
    stock: 0,
    minStock: 3,
    capacity: 8,
    barcode: "8901234567892",
    location: "C1-08",
    weight: "4.8g",
    stone: "Blue sapphire pair",
    supplier: "Azure Gems",
    supplierEmail: "orders@azuregems.com",
    ringSize: "—",
    description: "White gold earrings with sapphire drops",
    dateAdded: "2024-03-19",
    updatedAt: "2024-05-09",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=600&q=80",
    isDeleted: false,
  },
  {
    id: "BRC-001",
    name: "Tennis Bracelet",
    category: "Bracelets",
    material: "Platinum",
    price: 4500,
    stock: 4,
    minStock: 2,
    capacity: 5,
    barcode: "8901234567893",
    location: "D4-02",
    weight: "8.9g",
    stone: "Round brilliant set",
    supplier: "Platinum Line",
    supplierEmail: "orders@platinumline.com",
    ringSize: "—",
    description: "Premium platinum tennis bracelet",
    dateAdded: "2024-05-01",
    updatedAt: "2024-05-12",
    image:
      "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&w=600&q=80",
    isDeleted: false,
  },
  {
    id: "PND-001",
    name: "Ruby Heart Pendant",
    category: "Pendants",
    material: "Gold 14K",
    price: 780,
    stock: 9,
    minStock: 3,
    capacity: 12,
    barcode: "8901234567894",
    location: "E3-04",
    weight: "2.9g",
    stone: "Natural ruby center",
    supplier: "Ruby Atelier",
    supplierEmail: "orders@rubyatelier.com",
    ringSize: "—",
    description: "Heart-shaped pendant with ruby center stone",
    dateAdded: "2024-04-14",
    updatedAt: "2024-05-11",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    isDeleted: false,
  },
];

const initialLogs = [
  {
    id: 1,
    sku: "RNG-001",
    itemName: "Diamond Solitaire Ring",
    previousQty: 5,
    change: 2,
    newQty: 7,
    reason: "Restock delivery",
    type: "restock",
    updatedBy: "Admin User",
    timestamp: "2026-04-19 09:30",
  },
  {
    id: 2,
    sku: "NKL-001",
    itemName: "Pearl Necklace",
    previousQty: 5,
    change: -3,
    newQty: 2,
    reason: "Sold / stock out",
    type: "sale",
    updatedBy: "Warehouse Staff",
    timestamp: "2026-04-19 14:12",
  },
];

const initialUsers = [];

const initialSales = [
  {
    id: 1,
    sku: "NKL-001",
    itemName: "Pearl Necklace",
    quantity: 1,
    price: 850,
    total: 850,
    soldBy: "Warehouse Staff",
    customer: "Walk-in Customer",
    timestamp: "2026-04-19 13:00",
  },
];

const categories = [
  "All",
  "Rings",
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Pendants",
  "Gems",
];

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
  dateAdded: new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Bangkok"
  }).replace(" ", "T").slice(0, 10),
  updatedAt: new Date().toLocaleString("sv-SE", {
    timeZone: "Asia/Bangkok"
  }).replace(" ", "T").slice(0, 10),
  image: "",
};

const emptySaleForm = {
  sku: "",
  quantity: 1,
  customer: "",
  soldBy: "Warehouse Staff",
};

const emptyUserForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "warehouse",
  active: true,
  isDeleted: false,
};

const STORAGE_KEY = "jewelryIMSData";

function getSavedData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to read saved local data:", error);
    return null;
  }
}

function saveLocalData(nextData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  } catch (error) {
    console.error("Failed to save local data:", error);
  }
}


function normalizeUserIdentity(user = {}) {
  const username = String(user.username || user.email || user.name || "").trim();
  return {
    ...user,
    username,
    email: user.email || username,
  };
}

function isSampleUser(user = {}) {
  const sampleNames = ["Admin User", "Warehouse Staff", "Manager Viewer"];
  const sampleUsernames = [
    "admin@jewelryims.com",
    "warehouse@jewelryims.com",
    "viewer@jewelryims.com",
  ];
  const identity = String(user.username || user.email || "").toLowerCase();
  return sampleNames.includes(user.name) || sampleUsernames.includes(identity);
}

function cleanUsersForLogin(users = []) {
  return users
    .map(normalizeUserIdentity)
    .filter((user) => user.username && user.password && !isSampleUser(user));
}

function mergeById(localRows = [], sheetRows = []) {
  const merged = [...localRows];
  sheetRows.forEach((sheetRow) => {
    const rowId = sheetRow.id || sheetRow.ID || sheetRow.SKU || sheetRow.email || sheetRow.Email;
    if (!rowId) return;
    const index = merged.findIndex((row) =>
      String(row.id || row.ID || row.SKU || row.email || row.Email) === String(rowId)
    );
    const cleanedSheetRow = Object.fromEntries(
      Object.entries(sheetRow).filter(([, value]) => value !== "" && value !== null && value !== undefined)
    );
    if (index >= 0) {
      const localRow = merged[index];
      merged[index] = {
        ...localRow,
        ...cleanedSheetRow,
        image: cleanedSheetRow.image || cleanedSheetRow.Image || localRow.image || "",
      };
    } else {
      merged.unshift(cleanedSheetRow);
    }
  });
  return merged;
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
  const base =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
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

function SidebarItem({ active, icon: Icon, label, onClick }) {
  return (
    <button
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

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-900 break-words">{value}</p>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon: Icon, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md ${
        active ? "border-violet-500 ring-2 ring-violet-100" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
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

function BarChartCard({ title, subtitle, data, valueFormatter = (value) => value }) {
  const maxValue = Math.max(1, ...data.map((row) => Number(row.value || 0)));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="space-y-3">
        {data.length === 0 && (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No data yet.</p>
        )}
        {data.map((row) => {
          const width = `${Math.max(6, Math.min(100, (Number(row.value || 0) / maxValue) * 100))}%`;
          return (
            <div key={row.label} className="grid grid-cols-[76px_1fr_auto] items-center gap-3 text-sm">
              <span className="truncate text-slate-500">{row.label}</span>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-violet-500" style={{ width }} />
              </div>
              <span className="min-w-[72px] text-right font-semibold text-slate-800">
                {valueFormatter(row.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(
        status
      )}`}
    >
      {status}
    </span>
  );
}

function UserRoleBadge({ role }) {
  return (
    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      {roles[role]?.label || role}
    </span>
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

export default function App() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [activeDashboardMetric, setActiveDashboardMetric] = useState("Inventory Value");
  const savedData = useMemo(() => {
    const data = getSavedData();
    if (!data) return null;

    const cleanedUsers = cleanUsersForLogin(data.users || []);
    const savedIdentity = String(data.currentUserEmail || data.currentUsername || "").trim();
    const savedUser = cleanedUsers.find(
      (user) =>
        user.active !== false &&
        String(user.username || user.email || "").toLowerCase() === savedIdentity.toLowerCase()
    );

    const cleanedData = {
      ...data,
      users: cleanedUsers,
      currentUserEmail: savedUser ? savedUser.username || savedUser.email : "",
      currentRole: savedUser ? savedUser.role || "viewer" : "viewer",
      isLoggedIn: Boolean(data.isLoggedIn && savedUser),
    };

    if (JSON.stringify(cleanedData.users) !== JSON.stringify(data.users || []) || cleanedData.isLoggedIn !== data.isLoggedIn) {
      saveLocalData(cleanedData);
    }

    return cleanedData;
  }, []);

  const [items, setItems] = useState(savedData?.items?.length ? savedData.items : initialItems);
  const [logs, setLogs] = useState(savedData?.logs?.length ? savedData.logs : initialLogs);
  const [users, setUsers] = useState(savedData?.users?.length ? savedData.users : []);
  const [sales, setSales] = useState(savedData?.sales?.length ? savedData.sales : initialSales);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(savedData?.currentRole || "viewer");
  const [currentUserEmail, setCurrentUserEmail] = useState(

    savedData?.currentUserEmail || ""
  );

  const [restockOpen, setRestockOpen] = useState(false);
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [itemFormMode, setItemFormMode] = useState("add");
  const [userFormOpen, setUserFormOpen] = useState(false);

  const [syncStatus, setSyncStatus] = useState("Local mode");
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [currency, setCurrency] = useState("THB");
  const [qrModalItem, setQrModalItem] = useState(null);
  const qrDownloadRef = useRef(null);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    item: null,
    reason: "",
  });

  const [undoDelete, setUndoDelete] = useState({
    open: false,
    item: null,
  });

  const [restockForm, setRestockForm] = useState({
    quantity: "",
    date: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T").slice(0, 10),
    reason: "",
    type: "restock",
    updatedBy: "Warehouse Staff",
  });

  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [saleForm, setSaleForm] = useState({
    ...emptySaleForm,
    soldBy: "Warehouse Staff",
  });
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [saleSaveStatus, setSaleSaveStatus] = useState("idle");
  const [restockSaveStatus, setRestockSaveStatus] = useState("idle");
  const [userSaveStatus, setUserSaveStatus] = useState("idle");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaveStatus, setPasswordSaveStatus] = useState("idle");
  const [operationOrders, setOperationOrders] = useState(savedData?.operationOrders || []);
  const [operationForm, setOperationForm] = useState({ type: "Job Order", title: "", amount: "", dueDate: "", notes: "", customer: "", status: "Pending" });
  const [settingsTab, setSettingsTab] = useState("user");
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: savedData?.currentUserEmail || "",
    password: "",
  });
  
  const [setupForm, setSetupForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(savedData?.isLoggedIn || false);

  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [scannerStatus, setScannerStatus] = useState("Ready to scan");
  const [manualScan, setManualScan] = useState("");

  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  const activeUsers = users.filter((u) => !u.isDeleted);
  const currentUser = isLoggedIn
    ? activeUsers.find((u) => (u.email || u.username || u.name) === currentUserEmail) || activeUsers[0] || null
    : null;
  const viewOnlyPermissions = {
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
  };
  const permissions = isLoggedIn ? roles[currentRole] || viewOnlyPermissions : viewOnlyPermissions;

  const exchangeRates = {
    THB: 1,
    USD: 1 / 36,
    EUR: 1,
    GBP: 1,
    SGD: 1,
    PHP: 1,
    JPY: 1,
    CAD: 1,
    AUD: 1,
    CNY: 1,

  };

  const formatCurrency = (amount) => {
    const converted = Number(amount || 0) * exchangeRates[currency];
    return new Intl.NumberFormat(currency === "THB" ? "th-TH" : "en-US" , {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const enrichedItems = useMemo(
    () =>
      items
        .filter((item) => item.isDeleted !== true && item.isDeleted !== "true")
        .map((item) => ({
          ...item,
          stock: Number(item.stock || 0),
          minStock: Number(item.minStock || 0),
          capacity: Number(item.capacity || 0),
          price: Number(item.price || 0),
          status: getStockStatus(item),
        })),
    [items]
  );

  const selectedItem =
    selectedItemId != null
      ? enrichedItems.find((item) => item.id === selectedItemId) || null
      : null;

  const filteredItems = useMemo(() => {
    return enrichedItems.filter((item) => {
      const matchCategory = category === "All" || item.category === category;
      const haystack =
        `${item.id} ${item.name} ${item.material} ${item.category} ${item.status}`.toLowerCase();
      return matchCategory && haystack.includes(search.toLowerCase());
    });
  }, [enrichedItems, category, search]);

  const itemLogs = useMemo(
    () =>
      logs
        .filter((log) => log.sku === selectedItem?.id)
        .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)),
    [logs, selectedItem]
  );

  const totalValue = enrichedItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.stock),
    0
  );
  const totalUnits = enrichedItems.reduce((sum, item) => sum + Number(item.stock), 0);
  const lowCount = enrichedItems.filter((item) => item.status === "Low").length;
  const criticalCount = enrichedItems.filter((item) => item.status === "Critical").length;
  const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);

  const inventoryMovementData = useMemo(() => {
    const movementByDate = {};
    logs.forEach((log) => {
      const label = String(log.timestamp || "No date").slice(0, 10);
      movementByDate[label] = (movementByDate[label] || 0) + Math.abs(Number(log.change || 0));
    });
    return Object.entries(movementByDate)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-7)
      .map(([label, value]) => ({ label, value }));
  }, [logs]);

  const dailySalesTrendData = useMemo(() => {
    const salesByDate = {};
    sales.forEach((sale) => {
      const label = String(sale.timestamp || "No date").slice(0, 10);
      salesByDate[label] = (salesByDate[label] || 0) + Number(sale.total || 0);
    });
    return Object.entries(salesByDate)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-7)
      .map(([label, value]) => ({ label, value }));
  }, [sales]);

  function openMetricView(metric) {
    setActiveDashboardMetric(metric);
    if (metric === "Inventory Value" || metric === "Total Units") {
      setSearch("");
      setCategory("All");
      setCurrentPage("Inventory");
    }
    if (metric === "Low Stock") {
      setCategory("All");
      setSearch("Low");
      setCurrentPage("Inventory");
    }
    if (metric === "Critical") {
      setCategory("All");
      setSearch("Critical");
      setCurrentPage("Inventory");
    }
    if (metric === "Sales Value") {
      setCurrentPage("Sales");
    }
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  useEffect(() => {
    const cleanedUsers = cleanUsersForLogin(users);
    if (cleanedUsers.length !== users.length) {
      const stillLoggedInUser = cleanedUsers.find(
        (user) =>
          user.active !== false &&
          String(user.username || user.email || "").toLowerCase() === String(currentUserEmail || "").toLowerCase()
      );

      setUsers(cleanedUsers);
      setCurrentUserEmail(stillLoggedInUser ? stillLoggedInUser.username || stillLoggedInUser.email : "");
      setCurrentRole(stillLoggedInUser ? stillLoggedInUser.role || "viewer" : "viewer");
      setIsLoggedIn(Boolean(stillLoggedInUser && isLoggedIn));
      persistAll({
        users: cleanedUsers,
        currentUserEmail: stillLoggedInUser ? stillLoggedInUser.username || stillLoggedInUser.email : "",
        currentRole: stillLoggedInUser ? stillLoggedInUser.role || "viewer" : "viewer",
        isLoggedIn: Boolean(stillLoggedInUser && isLoggedIn),
      });
    }
  }, []);

    useEffect(() => {
      if (!savedData) return;
    
      const user = savedData.users?.find(
        (u) =>
          u.username === savedData.currentUserEmail ||
          u.email === savedData.currentUserEmail
      );
    
    }, []);


  useEffect(() => {
    loadItemsFromSheet();
  }, []);

  useEffect(() => {
    const openItemFromHash = () => {
      const params = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
      const sku = params.get("item");
      if (!sku) return;

      const found = enrichedItems.find(
        (item) => String(item.id) === String(sku) || String(item.barcode || "") === String(sku)
      );

      if (found) {
        setSelectedItemId(found.id);
        setSearch("");
        setCategory("All");
        setCurrentPage("Inventory");
        setMobileDetailsOpen(true);
        setTimeout(() => {
          document.getElementById(`item-row-${found.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
      }
    };

    openItemFromHash();
    window.addEventListener("hashchange", openItemFromHash);
    return () => window.removeEventListener("hashchange", openItemFromHash);
  }, [enrichedItems]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".settings-container")) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  async function syncToGoogleSheet(payload) {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Google Sheets sync failed: ${res.status}`);

    const text = await res.text();
    console.log("SYNC RESPONSE:", text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }

    if (parsed && typeof parsed === "object" && parsed.success === false) {
      throw new Error(parsed.message || "Google Sheets sync returned an error");
    }

    return parsed;
  }

  async function apiGet(action) {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(action)}`);
    if (!res.ok) throw new Error(`GET ${action} failed`);
    return res.json();
  }

  async function apiPost(action, payload) {
    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({ action, payload, ...(payload || {}) }),
    });
    if (!res.ok) throw new Error(`POST ${action} failed`);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  const imageInputRef = useRef(null);

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onloadend = () => {
      setItemForm((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }

  function triggerImagePicker() {
    imageInputRef.current?.click();
  }
  
  function normalizeSheetItem(row) {
    return {
      id: row.id || row.ID || row.SKU || "",
      name: row.name || row.Name || "",
      category: row.category || row.Category || "",
      material: row.material || row.Material || "",
      price: Number(row.price || row.Price || 0),
      stock: Number(row.stock || row.Stock || 0),
      minStock: Number(row.minStock || row["Min Stock"] || 0),
      capacity: Number(row.capacity || row.Capacity || 0),
      image: row.image || row.Image || "",
      barcode: row.barcode || row.Barcode || "",
      supplier: row.supplier || row.Supplier || "",
      supplierEmail: row.supplierEmail || row["Supplier Email"] || "",
      location: row.location || row.Location || "",
      weight: row.weight || row.Weight || "",
      stone: row.stone || row.Stone || "",
      ringSize: row.ringSize || row["Ring Size"] || "—",
      description: row.description || row.Description || "",
      dateAdded: row.dateAdded || row["Date Added"] || new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T").slice(0, 10),
      updatedAt: row.updatedAt || row["Last Updated"] || new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
      isDeleted:
        String(row.isDeleted || row["Is Deleted"] || "").toLowerCase() === "true",
      deletedAt: row.deletedAt || row["Deleted At"] || "",
      deletedBy: row.deletedBy || row["Deleted By"] || "",
      deleteReason: row.deleteReason || row["Delete Reason"] || "",
    };
  }

  function mergeSheetItemsPreservingLocalImages(prevItems, sheetRows) {
    const normalizedRows = sheetRows.map(normalizeSheetItem).filter((item) => item.id);
    const sheetIds = new Set(normalizedRows.map((item) => String(item.id)));
    const deletedSheetIds = new Set(
      normalizedRows
        .filter((item) => item.isDeleted === true || item.isDeleted === "true")
        .map((item) => String(item.id))
    );

    const localOnlyItems = prevItems.filter(
      (item) =>
        item.id &&
        !sheetIds.has(String(item.id)) &&
        !deletedSheetIds.has(String(item.id)) &&
        item.isDeleted !== true &&
        item.isDeleted !== "true"
    );

    const visibleSheetItems = normalizedRows
      .filter((sheetItem) => !deletedSheetIds.has(String(sheetItem.id)))
      .map((sheetItem) => {
        const localItem = prevItems.find((item) => String(item.id) === String(sheetItem.id));
        return {
          ...localItem,
          ...sheetItem,
          image: sheetItem.image || localItem?.image || "",
        };
      })
      .filter((item) => item.isDeleted !== true && item.isDeleted !== "true");

    return [...localOnlyItems, ...visibleSheetItems];
  }

  async function loadItemsFromSheet() {
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAllData`);
      const data = await res.json();

      const sheetItems = Array.isArray(data?.items) ? data.items : [];

      if (sheetItems.length > 0) {
        setItems((prevItems) => {
          const mergedItems = mergeSheetItemsPreservingLocalImages(prevItems, sheetItems);
          saveLocalData({
            items: mergedItems,
            logs,
            users,
            sales,
            operationOrders,
            currentRole,
            currentUserEmail,
            isLoggedIn,
          });
          return mergedItems;
        });
      } else {
        setSyncStatus("No sheet items found; keeping local items");
      }

      if (Array.isArray(data.logs) && data.logs.length > 0) {
        setLogs((prevLogs) => mergeById(prevLogs, data.logs));
      }
      if (Array.isArray(data.users) && data.users.length > 0) {
        setUsers((prevUsers) => cleanUsersForLogin(mergeById(prevUsers, data.users)));
      }
      if (Array.isArray(data.sales) && data.sales.length > 0) {
        setSales((prevSales) => mergeById(prevSales, data.sales));
      }

      setSyncStatus(sheetItems.length > 0 ? "Items loaded from sheet" : "Local data kept");
    } catch (error) {
      console.error("Failed to load items from sheet:", error);
      setSyncStatus("Sheet load failed; keeping local items");
    }
  }

  async function loadFromSheets() {
    if (!GOOGLE_SCRIPT_URL) {
      setSyncStatus("Google Script URL not set");
      return;
    }
    try {
      setSyncStatus("Syncing...");
      const data = await apiGet("getAllData");
      if (Array.isArray(data?.items) && data.items.length > 0) {
        setItems((prevItems) => mergeSheetItemsPreservingLocalImages(prevItems, data.items));
      }
      if (Array.isArray(data?.logs) && data.logs.length > 0) {
        setLogs((prevLogs) => mergeById(prevLogs, data.logs));
      }
      if (Array.isArray(data?.users) && data.users.length > 0) {
        setUsers((prevUsers) => cleanUsersForLogin(mergeById(prevUsers, data.users)));
      }
      if (Array.isArray(data?.sales) && data.sales.length > 0) {
        setSales((prevSales) => mergeById(prevSales, data.sales));
      }
      setSyncStatus("Synced successfully");
    } catch (error) {
      console.error(error);
      setSyncStatus("Sync failed");
    }
  }


  function selectItem(item) {
    setSelectedItemId(item.id);
    setMobileDetailsOpen(true);
  }

  function openRestock(item) {
    setSelectedItemId(item.id);
    setRestockForm({
      quantity: "",
      date: new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T").slice(0, 10),
      reason: "",
      type: "restock",
      updatedBy: currentUser?.name || currentUser?.username || currentUserEmail || "User",
    });
    setRestockOpen(true);
  }

  function openAddItem() {
    setItemFormMode("add");
    setItemForm({
      ...emptyItemForm,
      id: `SKU-${Date.now()}`,
    });
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

  function sendReorderEmail(item) {
    if (!permissions.canReorder) return;
    const subject = encodeURIComponent(`Reorder Request - ${item.id} ${item.name}`);
    const body = encodeURIComponent(
      `Hello,

Please prepare a reorder for the following item:

SKU: ${item.id}
Item: ${item.name}
Current Stock: ${item.stock}
Minimum Stock: ${item.minStock}
Preferred Quantity:

Thank you.`
    );
    window.location.href = `mailto:${item.supplierEmail}?subject=${subject}&body=${body}`;
  }

  function printLabel(item) {
    const html = `
      <html>
        <head>
          <title>Print Label</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            .label { border: 1px solid #ccc; border-radius: 16px; padding: 16px; width: 320px; }
            .sku { font-size: 12px; color: #666; }
            .name { font-size: 20px; font-weight: bold; margin: 8px 0; }
            .meta { margin-top: 6px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="sku">${item.id}</div>
            <div class="name">${item.name}</div>
            <div class="meta">${item.material}</div>
            <div class="meta">${new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
              minimumFractionDigits: 0,
            }).format(item.price)}</div>
            <div class="meta">${item.barcode}</div>
          </div>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `;
    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
  }

  const [settingsOpen, setSettingsOpen] = useState(false);
const [lastSync, setLastSync] = useState("");

function persistAll(overrides = {}) {
  const data = {
    items,
    logs,
    users,
    sales,
    operationOrders,
    currentRole,
    currentUserEmail,
    isLoggedIn,
    ...overrides,
  };
  saveLocalData(data);
}

async function pushAllToSheets(nextData = {}, extra = {}) {
  const dataToSave = {
    items: nextData.items ?? items ?? [],
    logs: nextData.logs ?? logs ?? [],
    users: nextData.users ?? users ?? [],
    sales: nextData.sales ?? sales ?? [],
    operationOrders: nextData.operationOrders ?? operationOrders ?? [],
  };

  saveLocalData({ ...dataToSave, currentRole, currentUserEmail, isLoggedIn });

  if (!GOOGLE_SCRIPT_URL) {
    setSyncStatus("Saved locally; Google Script URL not set");
    setSyncError("");
    return false;
  }

  try {
    setSyncBusy(true);
    setSyncError("");
    setSyncStatus("Saving locally and syncing to Google Sheets...");

    await syncToGoogleSheet({
      action: "syncAllData",
      payload: dataToSave,
      items: dataToSave.items,
      logs: dataToSave.logs,
      users: dataToSave.users,
      sales: dataToSave.sales,
      operationOrders: dataToSave.operationOrders,
      lastAction: extra.action || "syncAllData",
      item: extra.item || null,
      user: extra.user || null,
      sale: extra.sale || null,
      log: extra.log || null,
      timestamp: new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
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

async function handleManualSync() {
  await pushAllToSheets({ items, logs, users, sales, operationOrders }, { action: "syncAllData" });
}

async function saveItem(e) {
  e.preventDefault();

  if (!permissions.canCreateItem && itemFormMode === "add") return;
  if (!permissions.canEditItem && itemFormMode === "edit") return;

  const normalized = {
    ...itemForm,
    price: Number(itemForm.price || 0),
    stock: Number(itemForm.stock || 0),
    minStock: Number(itemForm.minStock || 0),
    capacity: Number(itemForm.capacity || 0),
    dateAdded: itemForm.dateAdded || new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T"),
    updatedAt: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T"),
    isDeleted: false,
    deletedAt: "",
    deletedBy: "",
    deleteReason: "",
  };

  const updatedItems =
    itemFormMode === "add"
      ? [normalized, ...items]
      : items.map((item) =>
          item.id === normalized.id ? normalized : item
        );

  setItems(updatedItems);
  setSelectedItemId(normalized.id);
  setItemFormOpen(false);

  await pushAllToSheets(
    {
      items: updatedItems,
      logs,
      users,
      sales,
      operationOrders,
    },
    { action: itemFormMode === "add" ? "SAVE_ITEM" : "UPDATE_ITEM", item: normalized }
  );

}

async function saveRestock(e) {
  e.preventDefault();

  if (!permissions.canEditStock) return;

  const itemToUpdate =
    items.find((item) => item.id === selectedItemId) ||
    enrichedItems.find((item) => item.id === selectedItemId);

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
  const change = negativeTypes.includes(restockForm.type)
    ? quantity * -1
    : quantity;

  const newQty = Math.max(0, previousQty + change);

  const updatedItems = items.map((item) =>
    item.id === itemToUpdate.id
      ? {
          ...item,
          stock: newQty,
          updatedAt: new Date().toLocaleString("sv-SE", {
            timeZone: "Asia/Bangkok"
          }).replace(" ", "T"),
        }
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
    updatedBy:
  currentUser?.name ||
  currentUser?.username ||
  currentUserEmail ||
  "Admin",
    timestamp: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T"),
  };

  const updatedLogs = [logEntry, ...logs];

  setItems(updatedItems);
  setLogs(updatedLogs);

  persistAll({
    items: updatedItems,
    logs: updatedLogs,
  });

  await pushAllToSheets({
    items: updatedItems,
    logs: updatedLogs,
    users,
    sales,
    operationOrders,
  });

  setRestockSaveStatus("saved");

  setTimeout(() => {
    setRestockSaveStatus("idle");
    setRestockOpen(false);
  }, 1000);
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
    String(x.id) === String(item.id)
      ? {
          ...x,
          stock: Math.max(0, Number(x.stock || 0) - qty),
          updatedAt: new Date().toLocaleString("sv-SE", {
            timeZone: "Asia/Bangkok"
          }).replace(" ", "T"),
        }
      : x
  );

  const saleEntry = {
    id: Date.now(),
    sku: item.id,
    itemName: item.name,
    quantity: qty,
    price: Number(item.price),
    total: qty * Number(item.price),
    soldBy:
      currentUser?.name ||
      currentUser?.username ||
      currentUserEmail ||
      saleForm.soldBy ||
      "User",
    customer: saleForm.customer || "Walk-in Customer",
    timestamp: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T"),
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

  persistAll({
    items: updatedItems,
    logs: updatedLogs,
    sales: updatedSales,
  });

  await pushAllToSheets(
    {
      items: updatedItems,
      logs: updatedLogs,
      users,
      sales: updatedSales,
      operationOrders,
    },
    { action: "syncAllData" }
  );

  setSaleSaveStatus("saved");
  setTimeout(() => {
    setSaleSaveStatus("idle");
    setSaleForm({
      ...emptySaleForm,
      soldBy: currentUser?.name || currentUser?.username || currentUserEmail || "User",
    });
  }, 1000);
}

async function saveUser(e) {
  e.preventDefault();
  setUserSaveStatus("saving");
  setLoginError("");

  try {
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

    const usernameExists = users.some(
      (user) =>
        !user.isDeleted &&
        String(user.username || user.email || "").toLowerCase() === cleanUsername.toLowerCase()
    );

    if (usernameExists && !userForm.id) {
      setLoginError("This username already has an account.");
      setUserSaveStatus("idle");
      return;
    }

    const newUser = {
      ...userForm,
      id: userForm.id || Date.now(),
      name: userForm.name.trim(),
      username: cleanUsername,
      email: cleanUsername,
      password: userForm.password.trim(),
      role: isFirstAccount ? "admin" : "warehouse",
      active: true,
      isDeleted: false,
    };

    const updatedUsers = users.some((user) => user.id === newUser.id)
      ? users.map((user) => (user.id === newUser.id ? { ...user, ...newUser } : user))
      : [...users, newUser];

    setUsers(updatedUsers);

    persistAll({
      users: updatedUsers,
    });

    await pushAllToSheets({
      items,
      logs,
      users: updatedUsers,
      sales,
      operationOrders,
    });

    setUserForm(emptyUserForm);
    setUserFormOpen(false);
    setLoginError("");
    setUserSaveStatus("saved");

    setTimeout(() => {
      setUserSaveStatus("idle");
    }, 1200);
  } catch (error) {
    console.error("Save user failed:", error);
    setLoginError("User was saved locally, but Google Sheet sync failed. Please check Apps Script.");
    setUserSaveStatus("idle");
  }
}

async function toggleUserActive(id) {
  if (!permissions.canManageUsers) return;

  const updatedUsers = users.map((u) =>
    u.id === id ? { ...u, active: !u.active, updatedAt: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T") } : u
  );

  setUsers(updatedUsers);

  const affectedUser = updatedUsers.find((u) => u.id === id);
  await pushAllToSheets(
    { items, logs, users: updatedUsers, sales, operationOrders },
    { action: affectedUser?.active ? "ACTIVATE_USER" : "DISABLE_USER", user: affectedUser }
  );
}

async function deleteUser(id) {
  if (!permissions.canManageUsers) return;

  const userToDelete = users.find((u) => u.id === id);
  if (!userToDelete) return;

  if (String(userToDelete.username || userToDelete.email || "") === String(currentUserEmail || "")) {
    setLoginError("You cannot delete the account currently logged in.");
    return;
  }

  const updatedUsers = users.map((u) =>
    u.id === id ? { ...u, active: false, isDeleted: true, deletedAt: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok"
    }).replace(" ", "T") } : u
  );
  setUsers(updatedUsers);
  await pushAllToSheets(
    { items, logs, users: updatedUsers, sales, operationOrders },
    { action: "DELETE_USER", user: updatedUsers.find((u) => u.id === id) }
  );
}



  function handleScanValue(rawValue) {
    if (!rawValue) return;

    let sku = rawValue;
    try {
      const parsed = JSON.parse(rawValue);
      if (parsed.sku) sku = parsed.sku;
      else if (parsed.id) sku = parsed.id;
      else if (parsed.barcode) sku = parsed.barcode;
    } catch {}

    const found = enrichedItems.find(
      (item) =>
        item.id?.toLowerCase() === String(sku).toLowerCase() ||
        String(item.barcode || "") === String(sku)
    );

    if (found) {
      setSelectedItemId(found.id);
      setScannerStatus(`Matched item: ${found.id}`);
      setCurrentPage("Inventory");
      setMobileDetailsOpen(true);
      setTimeout(() => {
        document.getElementById(`item-row-${found.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    } else {
      setScannerStatus("No matching item found");
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

  async function confirmDeleteItem() {
    if (!deleteDialog.item) return;
  
    const reason = deleteDialog.reason?.trim();
  
    if (!reason) {
      alert("Please state the reason before deleting this item.");
      return;
    }
  
    const item = deleteDialog.item;
  
    const updatedItems = items.map((row) =>
      row.id === item.id
        ? {
            ...row,
            isDeleted: true,
            deletedAt: new Date().toLocaleString("sv-SE", {
              timeZone: "Asia/Bangkok"
            }).replace(" ", "T"),
            deletedBy: currentUser?.name || currentUserEmail || "Admin",
            deleteReason: reason,
          }
        : row
    );
  
    const deleteLog = {
      id: Date.now(),
      sku: item.id,
      itemName: item.name,
      previousQty: item.stock,
      change: 0,
      newQty: item.stock,
      reason: `Deleted item - ${reason}`,
      type: "delete",
      updatedBy: currentUser?.name || currentUserEmail || "Admin",
      timestamp: new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
    };
  
    const updatedLogs = [deleteLog, ...logs];
  
    setItems(updatedItems);
    setLogs(updatedLogs);
  
    // Close delete modal immediately
    setDeleteDialog({
      open: false,
      item: null,
      reason: "",
    });
  
    // Show Undo Delete
    setUndoDelete({
      open: true,
      item: {
        ...item,
        isDeleted: true,
        deletedAt: new Date().toLocaleString("sv-SE", {
          timeZone: "Asia/Bangkok"
        }).replace(" ", "T"),
        deletedBy: currentUser?.name || currentUserEmail || "Admin",
        deleteReason: reason,
      },
    });
  
    setSelectedItemId(null);
    setMobileDetailsOpen(false);
  
    persistAll({
      items: updatedItems,
      logs: updatedLogs,
    });
  
    await pushAllToSheets({
      items: updatedItems,
      logs: updatedLogs,
      users,
      sales,
      operationOrders,
    });
  }

  async function handleUndoDelete(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
  
    if (!undoDelete.item) return;
  
    const itemToRestore = undoDelete.item;
  
    const restoredItem = {
      ...itemToRestore,
      isDeleted: false,
      deletedAt: "",
      deletedBy: "",
      deleteReason: "",
    };
  
    const updatedItems = items.some((item) => item.id === restoredItem.id)
      ? items.map((item) =>
          item.id === restoredItem.id ? restoredItem : item
        )
      : [restoredItem, ...items];
  
    const undoLog = {
      id: Date.now(),
      sku: restoredItem.id,
      itemName: restoredItem.name,
      previousQty: restoredItem.stock,
      change: 0,
      newQty: restoredItem.stock,
      reason: `Undo delete: ${restoredItem.name}`,
      type: "undo_delete",
      updatedBy: currentUser?.name || currentUserEmail || "Admin",
      timestamp: new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
    };
  
    const updatedLogs = [undoLog, ...logs];
  
    setItems(updatedItems);
    setLogs(updatedLogs);
  
    setUndoDelete({
      open: false,
      item: null,
    });
  
    persistAll({
      items: updatedItems,
      logs: updatedLogs,
    });
  
    await pushAllToSheets({
      items: updatedItems,
      logs: updatedLogs,
      users,
      sales,
      operationOrders,
    });
  }

  async function handleCreateAdmin(e) {
    e.preventDefault();

    const adminUsername = setupForm.email.trim();
    const adminPassword = setupForm.password.trim();

    if (!setupForm.name.trim() || !adminUsername || !adminPassword) {
      setLoginError("Please complete the name, username, and password.");
      return;
    }

    const adminUser = {
      id: Date.now(),
      name: setupForm.name.trim(),
      username: adminUsername,
      email: adminUsername,
      password: adminPassword,
      role: "admin",
      active: true,
      isDeleted: false,
    };

    const updatedUsers = [adminUser];
    setUsers(updatedUsers);
    setCurrentUserEmail(adminUser.username || adminUser.email);
    setCurrentRole("admin");
    setIsLoggedIn(true);
    setLoginOpen(false);
    setLoginError("");
    setSetupForm({ name: "", email: "", password: "" });

    await pushAllToSheets({
      items,
      logs,
      users: updatedUsers,
      sales,
      operationOrders,
    });
  }

  function handleLogin(e) {
    e.preventDefault();
    const selectedEmail =
      loginForm.email || activeUsers.filter((u) => u.active !== false)[0]?.username || activeUsers.filter((u) => u.active !== false)[0]?.email || "";
    const found = users.find(
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
    saveLocalData({ items, logs, users, sales, operationOrders, currentRole: found.role, currentUserEmail: found.username || found.email, isLoggedIn: true });
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
      String(u.id) === String(currentUser.id)
        ? { ...u, password: passwordForm.newPassword, updatedAt: new Date().toLocaleString("sv-SE", {
          timeZone: "Asia/Bangkok"
        }).replace(" ", "T") }
        : u
    );

    setUsers(updatedUsers);
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setLoginError("");
    persistAll({ users: updatedUsers });

    await pushAllToSheets(
      { items, logs, users: updatedUsers, sales, operationOrders },
      { action: "CHANGE_PASSWORD", user: updatedUsers.find((u) => String(u.id) === String(currentUser.id)) }
    );

    setPasswordSaveStatus("saved");
    setTimeout(() => setPasswordSaveStatus("idle"), 1500);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentUserEmail("");
    setCurrentRole("viewer");
    setCurrentPage("Dashboard");
    setSelectedItemId(null);
    setMobileDetailsOpen(false);
    saveLocalData({ items, logs, users, sales, operationOrders, currentRole: "viewer", currentUserEmail: "", isLoggedIn: false });
  }

  const renderDashboard = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-1 text-slate-500">
              Track stock reliability, value, and recent activity
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {["THB", "USD"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCurrency(code)}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold ${
                currency === code
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {code}
            </button>
          ))}

          <select
            value={currency === "THB" || currency === "USD" ? "" : currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
          >
            <option value="" disabled>More</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="SGD">SGD</option>
            <option value="JPY">JPY</option>
            <option value="PHP">PHP</option>
            <option value="CAD">CAD</option>
            <option value="CNY">CNY</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          subtitle="Current total value"
          icon={Gem}
          active={activeDashboardMetric === "Inventory Value"}
          onClick={() => openMetricView("Inventory Value")}
        />
        <MetricCard
          title="Total Units"
          value={totalUnits}
          subtitle="All stock on hand"
          icon={Package}
          active={activeDashboardMetric === "Total Units"}
          onClick={() => openMetricView("Total Units")}
        />
        <MetricCard
          title="Low Stock"
          value={lowCount}
          subtitle="Needs attention"
          icon={ClipboardList}
          active={activeDashboardMetric === "Low Stock"}
          onClick={() => openMetricView("Low Stock")}
        />
        <MetricCard
          title="Critical"
          value={criticalCount}
          subtitle="Restock urgently"
          icon={RotateCcw}
          active={activeDashboardMetric === "Critical"}
          onClick={() => openMetricView("Critical")}
        />
        <MetricCard
          title="Sales Value"
          value={formatCurrency(totalSalesValue)}
          subtitle="Recorded sales"
          icon={Receipt}
          active={activeDashboardMetric === "Sales Value"}
          onClick={() => openMetricView("Sales Value")}
        />
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
                    <p className="font-medium text-slate-900">{log.itemName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {log.type} • {log.updatedBy} • {log.timestamp}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      log.change >= 0
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {log.change >= 0 ? `+${log.change}` : log.change}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Previous: {log.previousQty} → New: {log.newQty} • {log.reason}
                </p>
              </div>
            ))}
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
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item)}
                  className="w-full rounded-2xl border border-slate-100 p-3 text-left hover:border-violet-300 hover:bg-violet-50"
                >
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
          </div>

        </div>

      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <BarChartCard
          title="Inventory Movement"
          subtitle="Stock changes from restock, sales, damage, corrections, and deletes"
          data={inventoryMovementData}
          valueFormatter={(value) => `${value} units`}
        />
        <BarChartCard
          title="Daily Sales Trends"
          subtitle="Sales value recorded by day"
          data={dailySalesTrendData}
          valueFormatter={(value) => formatCurrency(value)}
        />
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className={`grid gap-6 ${selectedItem ? "xl:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>
      <div className="min-w-0">
        <div className="border-b border-slate-200 px-4 pb-5 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Inventory
              </h1>
              <p className="mt-1 text-lg text-slate-500 sm:text-xl">
                {filteredItems.length} of {enrichedItems.length} items
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <AppButton
                className="h-12 px-6"
                onClick={openAddItem}
                disabled={!permissions.canCreateItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </AppButton>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU, name, material..."
                className="h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-base outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              {roles[currentRole]?.label}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm sm:px-5 sm:text-base ${
                  category === c ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
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
                  <th className="px-3 py-3 font-medium">SKU</th>
                  <th className="px-3 py-3 font-medium">Name</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Material</th>
                  <th className="px-3 py-3 font-medium">Price</th>
                  <th className="px-3 py-3 font-medium">Stock</th>
                  <th className="px-3 py-3 font-medium">Location</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const progress = `${
                    item.capacity > 0
                      ? Math.max(0, Math.min(100, (item.stock / item.capacity) * 100))
                      : 0
                  }%`;

                  return (
                    <tr
                      key={item.id}
                      id={`item-row-${item.id}`}
                      className={`border-t border-slate-200 transition hover:bg-violet-50/40 ${
                        selectedItem?.id === item.id ? "bg-violet-100 ring-2 ring-violet-400" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-3">
                        <button onClick={() => selectItem(item)} className="group rounded-2xl outline-none focus:ring-2 focus:ring-violet-500">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Gem className="h-6 w-6 text-slate-400" />
                            )}
                          </div>
                        </button>
                      </td>

                      <td className="px-3 py-3">
                        <button onClick={() => selectItem(item)} className="font-semibold text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900">
                          {item.id}
                        </button>
                      </td>

                      <td className="px-3 py-3">
                        <button onClick={() => selectItem(item)} className="font-semibold text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900">
                          {item.name}
                        </button>
                      </td>

                      <td className="px-3 py-3 text-slate-500">{item.category}</td>
                      <td className="px-3 py-3 text-slate-500">{item.material}</td>

                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {formatCurrency(item.price)}
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-4">
                          <span
                            className={`inline-flex min-w-[56px] items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${statusClasses(
                              item.status
                            )}`}
                          >
                            {item.stock}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-slate-500">{item.location || "—"}</td>

                      <td className="px-3 py-3">
                        <div className="min-w-[140px]">
                          <div className="h-4 w-full rounded-full bg-slate-100">
                            <div
                              className={`h-4 rounded-full ${progressClasses(item.status)}`}
                              style={{ width: progress }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between gap-3">
                            <StatusBadge status={item.status} />
                            <span className="text-sm text-slate-500">
                              {item.stock}/{item.capacity}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            title="Show QR Code"
                            onClick={() => setQrModalItem(item)}
                            className="rounded-xl border border-blue-500 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <QrCode className="h-5 w-5" />
                          </button>

                          <button
                            title="Restock"
                            onClick={() => openRestock(item)}
                            disabled={!permissions.canEditStock}
                            className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-40"
                          >
                            <Plus className="h-5 w-5" />
                          </button>

                          <button
                            title="Order More"
                            onClick={() => sendReorderEmail(item)}
                            disabled={!permissions.canReorder}
                            className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-40"
                          >
                            <Mail className="h-5 w-5" />
                          </button>

                          <button
                            title="Edit Item"
                            onClick={() => openEditItem(item)}
                            disabled={!permissions.canEditItem}
                            className="rounded-xl border border-slate-200 bg-white p-2 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-40"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>

                          <button
                            title="Delete Item"
                            onClick={() => {
                              setDeleteDialog({
                                open: true,
                                item,
                                reason: "",
                              });
                            }}
                            disabled={!permissions.canDelete}
                            className="rounded-xl border border-rose-200 bg-white p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-40"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="px-2 pt-6 text-sm text-slate-500">
            Showing {filteredItems.length} of {enrichedItems.length} items
          </p>
        </div>
      </div>

      {selectedItem && (
        <div className="hidden bg-white px-6 pb-6 pt-5 xl:block">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Item Details</h2>
            <button
              onClick={() => {
                setSelectedItemId(null);
                setMobileDetailsOpen(false);
              }}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="h-[160px] w-[160px] overflow-hidden rounded-2xl border border-slate-300">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50">
                  <Gem className="h-10 w-10 text-slate-400" />
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="flex h-[160px] w-[160px] flex-col items-center justify-center rounded-2xl border border-slate-300">
              <QRCodeSVG
                value={window.location.origin + window.location.pathname + "#item=" + encodeURIComponent(selectedItem.id) + "&view=details"}
                size={120}
              />
              <p className="mt-2 text-xs text-slate-600">{selectedItem.id}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-slate-900">{selectedItem.name}</h3>
            <StatusBadge status={selectedItem.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SummaryCard label="SKU" value={selectedItem.id} />
            <SummaryCard label="Name" value={selectedItem.name} />
            <SummaryCard label="Price" value={formatCurrency(selectedItem.price)} />
            <SummaryCard label="Material" value={selectedItem.material} />
            <SummaryCard label="Stock" value={selectedItem.stock} />
            <SummaryCard label="Location" value={selectedItem.location || "—"} />
          </div>

          {permissions.canViewLogs && (
            <div className="mt-5 rounded-[28px] border border-slate-200 p-5">
              <h4 className="mb-3 text-xl font-semibold text-slate-900">Restock History</h4>
              <div className="space-y-3">
                {itemLogs.length === 0 && (
                  <p className="text-sm text-slate-500">No history yet.</p>
                )}
                {itemLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{log.reason}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {log.timestamp} • {log.updatedBy}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          log.change >= 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {log.change >= 0 ? `+${log.change}` : log.change}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      Previous: {log.previousQty} → New: {log.newQty}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-3 gap-3">
            <AppButton
              variant="outline"
              className="h-12"
              onClick={() => openEditItem(selectedItem)}
              disabled={!permissions.canEditItem}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Item
            </AppButton>

            <AppButton variant="outline" className="h-12" onClick={() => printLabel(selectedItem)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Label
            </AppButton>

            <AppButton
              className="h-12"
              onClick={() => openRestock(selectedItem)}
              disabled={!permissions.canEditStock}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restock
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );

  const renderRestockPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Restock Form
          </h1>
          <p className="mt-1 text-slate-500">
            View stock adjustments. Staff login is required to save changes
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-5">
        <form className="space-y-4" onSubmit={saveRestock}>
          <Field label="Item">
            <select
              value={selectedItemId || ""}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            >
              {enrichedItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Quantity">
              <input
                value={restockForm.quantity}
                onChange={(e) =>
                  setRestockForm((prev) => ({ ...prev, quantity: e.target.value }))
                }
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Enter quantity"
              />
            </Field>

            <Field label="Date">
              <input
                value={restockForm.date}
                onChange={(e) =>
                  setRestockForm((prev) => ({ ...prev, date: e.target.value }))
                }
                type="date"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <Field label="Adjustment Type">
            <select
              value={restockForm.type}
              onChange={(e) =>
                setRestockForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="restock">Restock</option>
              <option value="stock_out">Stock Out</option>
              <option value="correction">Correction</option>
              <option value="damaged">Damaged</option>
            </select>
          </Field>

          <Field label="Reason">
            <textarea
              value={restockForm.reason}
              onChange={(e) =>
                setRestockForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              placeholder="Example: shelf recount, new delivery, damaged unit, customer order"
            />
          </Field>

          <Field label="Updated By">
            <input
              value={restockForm.updatedBy}
              onChange={(e) =>
                setRestockForm((prev) => ({ ...prev, updatedBy: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </Field>

          <div className="sticky bottom-0 bg-white pt-2">
          <AppButton
   type="submit"       
  className="h-12 w-full"
  disabled={!permissions.canEditStock || restockSaveStatus === "restocking"}
>
  <ClipboardList className="mr-2 h-4 w-4" />
  {restockSaveStatus === "restocking"
    ? "Restocking..."
    : restockSaveStatus === "saved"
    ? "Saved ✓"
    : "Save Stock Adjustment"}
</AppButton>
          </div>
        </form>
      </div>
    </div>
  );

  const renderSalesPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Sales</h1>
          <p className="mt-1 text-slate-500">
            View sales records. Staff login is required to record a sale
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Record Sale</h2>
          <form className="space-y-4" onSubmit={saveSale}>
            <Field label="Item">
              <select
                value={saleForm.sku}
                onChange={(e) => setSaleForm((prev) => ({ ...prev, sku: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              >
                <option value="">Select item</option>
                {enrichedItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.name} ({item.stock} in stock)
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Quantity">
                <input
                  type="number"
                  min="1"
                  value={saleForm.quantity}
                  onChange={(e) =>
                    setSaleForm((prev) => ({ ...prev, quantity: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </Field>

              <Field label="Sold By">
                <input
                  value={saleForm.soldBy}
                  onChange={(e) =>
                    setSaleForm((prev) => ({ ...prev, soldBy: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </Field>
            </div>

            <Field label="Customer">
              <input
                value={saleForm.customer}
                onChange={(e) =>
                  setSaleForm((prev) => ({ ...prev, customer: e.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Customer or sale note"
              />
            </Field>

            <AppButton
              className={`h-12 w-full ${saleSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`}
              disabled={!permissions.canProcessSales || saleSaveStatus === "saving"}
            >
              <Receipt className="mr-2 h-4 w-4" />
              {saleSaveStatus === "saving"
                ? "Saving..."
                : saleSaveStatus === "saved"
                ? "Saved ✓"
                : "Save Sale"}
            </AppButton>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Sales</h2>
            <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Total: <span className="font-semibold text-slate-900">{formatCurrency(totalSalesValue)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {sales.length === 0 && (
              <p className="text-sm text-slate-500">No sales recorded yet.</p>
            )}
            {sales.map((sale) => (
              <div key={sale.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{sale.itemName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {sale.sku} • {sale.customer} • {sale.soldBy}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{sale.timestamp}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(sale.total)}</p>
                    <p className="text-sm text-slate-500">Qty {sale.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderScanPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Document Scanning
          </h1>
          <p className="mt-1 text-slate-500">
            Scan QR codes to find items instantly
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[520px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">QR Scanner</h2>
            <span className="text-sm text-slate-500">{scannerStatus}</span>
          </div>

          <div
            id="qr-reader"
            ref={scannerRef}
            className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50"
            style={{ minHeight: "260px" }}
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <AppButton className="h-12" onClick={startScanner} disabled={scannerEnabled}>
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </AppButton>

            <AppButton variant="outline" className="h-12" onClick={stopScanner}>
              <X className="mr-2 h-4 w-4" />
              Stop
            </AppButton>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 p-4">
            <Field label="Manual SKU / Barcode / QR text">
              <div className="flex gap-3">
                <input
                  value={manualScan}
                  onChange={(e) => setManualScan(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  placeholder="Paste scanned value here"
                />
                <AppButton onClick={() => handleScanValue(manualScan)}>Find</AppButton>
              </div>
            </Field>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Matched Item</h2>

          {selectedItem ? (
            <div className="space-y-4">
              <SummaryCard label="SKU" value={selectedItem.id} />
              <SummaryCard label="Name" value={selectedItem.name} />
              <SummaryCard label="Category" value={selectedItem.category} />
              <SummaryCard label="Material" value={selectedItem.material} />
              <SummaryCard label="Price" value={formatCurrency(selectedItem.price)} />
              <SummaryCard label="Stock" value={selectedItem.stock} />
            </div>
          ) : (
            <p className="text-sm text-slate-500">No item selected.</p>
          )}
        </div>
      </div>
    </div>
  );

  function saveOperationOrder(e) {
    e.preventDefault();
    if (!isLoggedIn || currentRole !== "admin") return;
    if (!operationForm.title.trim()) return;

    const entry = {
      id: Date.now(),
      ...operationForm,
      amount: Number(operationForm.amount || 0),
      createdAt: new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
      createdBy: currentUser?.name || "Admin",
    };
    const updatedOrders = [entry, ...operationOrders];
    setOperationOrders(updatedOrders);
    setOperationForm({ type: "Job Order", title: "", amount: "", dueDate: "", notes: "", customer: "", status: "Pending" });
    pushAllToSheets({ items, logs, users, sales, operationOrders: updatedOrders }, { action: "SAVE_OPERATION", operation: entry });
  }

  function printOperationOrder(order) {
    const html = `
      <html><head><title>${order.type}</title><style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
        .box { border: 1px solid #cbd5e1; border-radius: 18px; padding: 20px; max-width: 760px; }
        h1 { margin: 0 0 12px; }
        p { margin: 8px 0; }
        .muted { color: #64748b; }
      </style></head><body>
        <div class="box">
          <h1>${order.type}</h1>
          <p class="muted">Reference: ${order.id}</p>
          <p><b>Title:</b> ${order.title}</p>
          <p><b>Customer/Payee:</b> ${order.customer || "—"}</p>
          <p><b>Amount:</b> ${formatCurrency(order.amount)}</p>
          <p><b>Due Date:</b> ${order.dueDate || "—"}</p>
          <p><b>Status:</b> ${order.status}</p>
          <p><b>Notes:</b><br/>${order.notes || "—"}</p>
        </div>
        <script>window.onload = () => window.print()</script>
      </body></html>`;
    const win = window.open("", "_blank");
    win?.document.write(html);
    win?.document.close();
  }

  const renderOperationHub = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex items-center gap-3">
        <button onClick={() => setMobileMenuOpen(true)} className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Operation Hub</h1>
          <p className="mt-1 text-slate-500">View job orders, payables, salaries, tax, rent, and customer invoices. Admin login is required to create records.</p>
        </div>
      </div>
      {currentRole !== "admin" && (<div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">View-only mode. Please log in as Admin to create or edit operation records.</div>)}
      <div className={`grid gap-6 ${currentRole === "admin" ? "xl:grid-cols-[420px_1fr]" : "grid-cols-1"}`}>
        {currentRole === "admin" && (
          <form onSubmit={saveOperationOrder} className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Create Document</h2>
            <Field label="Type"><select value={operationForm.type} onChange={(e) => setOperationForm((p) => ({ ...p, type: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"><option>Job Order</option><option>Factory Job Order Sheet</option><option>Customer Invoice</option><option>Scheduled Payment</option><option>Rent</option><option>Tax</option><option>Staff Salary</option><option>Admin Paperwork</option></select></Field>
            <Field label="Title / Reference"><input value={operationForm.title} onChange={(e) => setOperationForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Example: Factory repair order / April rent" /></Field>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Amount"><input type="number" value={operationForm.amount} onChange={(e) => setOperationForm((p) => ({ ...p, amount: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field><Field label="Due Date"><input type="date" value={operationForm.dueDate} onChange={(e) => setOperationForm((p) => ({ ...p, dueDate: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field></div>
            <Field label="Customer / Payee"><input value={operationForm.customer} onChange={(e) => setOperationForm((p) => ({ ...p, customer: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <Field label="Notes / Item Details"><textarea value={operationForm.notes} onChange={(e) => setOperationForm((p) => ({ ...p, notes: e.target.value }))} className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
            <AppButton className="h-12 w-full"><Save className="mr-2 h-4 w-4" />Save to Hub</AppButton>
          </form>)}
        <div className="rounded-3xl border border-slate-200 bg-white p-5"><h2 className="mb-4 text-xl font-semibold text-slate-900">Operation Documents</h2><div className="space-y-3">{operationOrders.length === 0 && <p className="text-sm text-slate-500">No operation records yet.</p>}{operationOrders.map((order) => (<div key={order.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="font-semibold text-slate-900">{order.title}</p><p className="text-sm text-slate-500">{order.type} • Due: {order.dueDate || "—"} • {formatCurrency(order.amount)}</p><p className="mt-2 text-sm text-slate-600">{order.notes || "No notes"}</p></div><AppButton variant="outline" onClick={() => printOperationOrder(order)}><Printer className="mr-2 h-4 w-4" />Print</AppButton></div></div>))}</div></div>
      </div>
    </div>
  );

  const renderUsersPage = () => (
    <div className="p-4 sm:p-6 xl:p-8">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Users</h1>
          <p className="mt-1 text-slate-500">Role management UI for internal stock access</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Add User</h2>
            <UserCog className="h-5 w-5 text-slate-400" />
          </div>
          <form className="space-y-4" onSubmit={saveUser}>
            <Field label="Name">
              <input
                value={userForm.name}
                onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Username">
              <input
                value={userForm.username || userForm.email}
                onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value, email: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Login Password">
              <input
                value={userForm.password}
                type="password"
                onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                placeholder="Create password"
              />
            </Field>

            <Field label="Role">
              <select
                value={userForm.role}
                onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              >
                <option value="admin">Admin</option>
                <option value="warehouse">Staff</option>
                <option value="viewer">Viewer</option>
              </select>
            </Field>

            <Field label="Active">
              <select
                value={String(userForm.active)}
                onChange={(e) =>
                  setUserForm((prev) => ({ ...prev, active: e.target.value === "true" }))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </Field>

            <AppButton
              className={`h-12 w-full ${userSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`}
              disabled={userSaveStatus === "saving"}
            >
              <Save className="mr-2 h-4 w-4" />
              {userSaveStatus === "saving"
                ? "Saving..."
                : userSaveStatus === "saved"
                ? "Saved ✓"
                : "Save User"}
            </AppButton>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">User List</h2>
          <div className="space-y-3">
            {activeUsers.filter((user) => !user.isDeleted).map((user) => (
              <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{user.username || user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <UserRoleBadge role={user.role} />
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                    <AppButton
                      variant="outline"
                      className="h-10"
                      onClick={() => deleteUser(user.id)}
                      disabled={!permissions.canManageUsers}
                    >
                      Delete
                    </AppButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSyncPage = () => {
    const lastLogs = logs.slice(0, 5);
    return (
      <div className="p-4 sm:p-6 xl:p-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Google Sheets Sync
            </h1>
            <p className="mt-1 text-slate-500">
              Real control panel for data load, push, and sheet health
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Inventory Rows" value={items.length} subtitle="Current item records" icon={Database} />
          <MetricCard title="Users Rows" value={users.length} subtitle="Role records" icon={Users} />
          <MetricCard title="Sales Rows" value={sales.length} subtitle="Sales records" icon={Receipt} />
          <MetricCard title="Log Rows" value={logs.length} subtitle="Adjustment history" icon={ClipboardList} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">Sync Controls</h2>

            <div className="space-y-3">
              <AppButton className="h-12 w-full" onClick={loadFromSheets} disabled={!permissions.canSync}>
                <Download className="mr-2 h-4 w-4" />
                Pull From Google Sheets
              </AppButton>

              <AppButton
                variant="outline"
                className="h-12 w-full"
                onClick={() => pushAllToSheets({ items, logs, users, sales })}
                disabled={!permissions.canSync}
              >
                <Upload className="mr-2 h-4 w-4" />
                Push Local Data to Sheets
              </AppButton>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                {GOOGLE_SCRIPT_URL ? (
                  <>
                    <Wifi className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-900">Connected to Apps Script</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-slate-900">No Apps Script URL set</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-500">Status: {syncStatus}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Recommended sheets</p>
              <p className="mt-2">Inventory</p>
              <p>Stock_Adjustment_Log</p>
              <p>Users</p>
              <p>Sales</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold text-slate-900">
              Recent Sync-sensitive Activity
            </h2>
            <div className="space-y-3">
              {lastLogs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{log.itemName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {log.type} • {log.updatedBy}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{log.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderItemForm = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {itemFormMode === "add" ? "Add New Item" : "Edit Item"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {itemFormMode === "add"
                ? "Create a new product in your inventory sheet"
                : "Update product details and keep stock data reliable"}
            </p>
          </div>
          <button onClick={() => setItemFormOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={saveItem}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SKU">
              <input
                value={itemForm.id}
                onChange={(e) => setItemForm((prev) => ({ ...prev, id: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Product Name">
              <input
                value={itemForm.name}
                onChange={(e) => setItemForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Category">
              <select
                value={itemForm.category}
                onChange={(e) => setItemForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              >
                {categories
                  .filter((c) => c !== "All")
                  .map((c) => (
                    <option key={c}>{c}</option>
                  ))}
              </select>
            </Field>

            <Field label="Material">
              <input
                value={itemForm.material}
                onChange={(e) => setItemForm((prev) => ({ ...prev, material: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Ring Size">
              <input
                value={itemForm.ringSize}
                onChange={(e) => setItemForm((prev) => ({ ...prev, ringSize: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Price">
              <input
                value={itemForm.price}
                disabled={!permissions.canEditPrice}
                onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))}
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none disabled:bg-slate-100"
              />
            </Field>

            <Field label="Stock">
              <input
                value={itemForm.stock}
                onChange={(e) => setItemForm((prev) => ({ ...prev, stock: e.target.value }))}
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Min Stock">
              <input
                value={itemForm.minStock}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, minStock: e.target.value }))
                }
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Capacity">
              <input
                value={itemForm.capacity}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, capacity: e.target.value }))
                }
                type="number"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Barcode">
              <input
                value={itemForm.barcode}
                onChange={(e) => setItemForm((prev) => ({ ...prev, barcode: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Location">
              <input
                value={itemForm.location}
                onChange={(e) => setItemForm((prev) => ({ ...prev, location: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Supplier">
              <input
                value={itemForm.supplier}
                onChange={(e) => setItemForm((prev) => ({ ...prev, supplier: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Supplier Email">
              <input
                value={itemForm.supplierEmail}
                onChange={(e) =>
                  setItemForm((prev) => ({ ...prev, supplierEmail: e.target.value }))
                }
                type="email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Weight">
              <input
                value={itemForm.weight}
                onChange={(e) => setItemForm((prev) => ({ ...prev, weight: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Stone / Gem">
              <input
                value={itemForm.stone}
                onChange={(e) => setItemForm((prev) => ({ ...prev, stone: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Photo">
  <div className="space-y-3">

    <input
      ref={imageInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />

    <button
      type="button"
      onClick={triggerImagePicker}
      className="flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100"
    >
      {itemForm.image ? (
        <img
          src={itemForm.image}
          alt="Item preview"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center text-slate-500">
          <ImageIcon className="mb-2 h-8 w-8" />
          <span className="text-sm font-medium">Add Photo</span>
          <span className="text-xs text-slate-400">Click to upload image</span>
        </div>
      )}
    </button>

    <input
      value={itemForm.image}
      onChange={(e) =>
        setItemForm((prev) => ({ ...prev, image: e.target.value }))
      }
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      placeholder="Or paste image URL"
    />

    {itemForm.image && (
      <div className="flex gap-2">
        <AppButton type="button" variant="outline" onClick={triggerImagePicker}>
          Change
        </AppButton>

        <AppButton
          type="button"
          variant="outline"
          onClick={() =>
            setItemForm((prev) => ({ ...prev, image: "" }))
          }
        >
          Remove
        </AppButton>
      </div>
    )}

  </div>
</Field>
          </div>

          <Field label="Description">
            <textarea
              value={itemForm.description}
              onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <AppButton
              type="button"
              variant="outline"
              className="h-12"
              onClick={() => setItemFormOpen(false)}
            >
              Cancel
            </AppButton>

            <AppButton type="submit" className="h-12">
              <Save className="mr-2 h-4 w-4" />
              {itemFormMode === "add" ? "Save New Item" : "Update Item"}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
  const renderQrModal = () => {
    if (!qrModalItem) return null;
  
    const downloadQrPng = async () => {
      if (!qrDownloadRef.current) return;
    
      try {
        const canvas = await html2canvas(qrDownloadRef.current, {
          backgroundColor: "#ffffff",
          scale: 3,
          useCORS: true,
        });
    
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `${qrModalItem?.id || "qr-code"}.png`;
    
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("PNG download failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
        <div
          ref={qrDownloadRef}
          className="relative w-full max-w-[480px] rounded-[24px] bg-white p-4 shadow-2xl"
        >
        
          <h2 className="text-[24px] font-semibold text-slate-900">
            QR Code — {qrModalItem.id}
          </h2>
  
          <p className="mt-1 text-lg text-slate-400">
            Scan to view full item details
          </p>
  
          <div className="mt-6 flex justify-center">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <QRCodeSVG 
              id="qr-download-svg"
              value={window.location.origin + window.location.pathname + "#item=" + encodeURIComponent(qrModalItem.id) + "&view=details"} 
              size={160} />
              
            </div>
          </div>
  
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-2xl font-semibold text-slate-900">
              {qrModalItem.name || "Unnamed Item"}
            </h3>
  
            <p className="mt-1 text-slate-500">{qrModalItem.id}</p>
  
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <p>Category: <b>{qrModalItem.category || "-"}</b></p>
              <p>Price: <b>{formatCurrency(qrModalItem.price)}</b></p>
              <p>Material: <b>{qrModalItem.material || "-"}</b></p>
              <p>Stock: <b>{qrModalItem.stock ?? 0} / {qrModalItem.capacity ?? 0}</b></p>
              <p>Status: <b>{qrModalItem.statusText || qrModalItem.status || "Active"}</b></p>
              <p>Location: <b>{qrModalItem.location || "-"}</b></p>

              <div className="mt-4 flex gap-2">
              <button
  type="button"
  onClick={() => {
    const svg = document.querySelector("#qr-download-svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 600;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 40, 520, 520);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${qrModalItem?.id || "qr-code"}.png`;
      link.click();
    };

    img.src = url;
  }}
  className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
>
  Download PNG
</button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedItemId(qrModalItem.id);
                      setCurrentPage("Inventory");
                      setQrModalItem(null);
                      setTimeout(() => {
                        document.getElementById(`item-row-${qrModalItem.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }, 250);
                    }}
                    className="rounded-[22px] bg-violet-600 px-3 py-2 text-white hover:bg-violet-700"
                  >
                    View Item
                  </button>

                  <button
                  type="button"
                  onClick={() => setQrModalItem(null)}
                className="rounded-[22px] border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
              close
              </button>
            </div>
            </div>
          </div>
        </div>
        </div>
    )};

    const hasUsers = users.some(
      (u) => !u.isDeleted && u.username && u.password
    );

  return (
    <div className="min-h-screen bg-[#f8f8fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[330px_1fr]">
      <div
  className={`${
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
  } fixed inset-y-0 left-0 z-30 flex w-[88vw] max-w-[330px] flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0`}
>
  {/* HEADER */}
  <div className="border-b border-slate-200 px-6 py-7">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Gem className="h-8 w-8" />
        </div>

        <div>
          <p className="text-[34px] font-semibold leading-none">Jewelry IMS</p>
          <p className="mt-2 text-xl text-slate-500">Inventory System</p>
        </div>
      </div>

      <button
        onClick={() => setMobileMenuOpen(false)}
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  </div>

  {/* USER INFO */}
  <div className="px-6 pt-5">
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{isLoggedIn ? "Current User" : "View Only"}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="font-medium text-slate-900">{currentUser?.name || "Not logged in"}</p>
        {isLoggedIn ? <UserRoleBadge role={currentRole} /> : <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">View Only</span>}
      </div>
    </div>
  </div>

  {/* NAVIGATION */}
  <div className="flex-1 space-y-3 px-6 py-6">
    {navItems.map((item) => (
      <SidebarItem
        key={item.key}
        icon={item.icon}
        label={item.key}
        active={currentPage === item.key}
        onClick={() => {
          if (item.key === "Settings") {
            setSettingsOpen(true);
            setMobileMenuOpen(false);
            return;
          }
          setCurrentPage(item.key);
          setMobileMenuOpen(false);
        }}
      />
    ))}
  </div>

  {/* FOOTER */}
  <div className="px-6 pb-6">
    <div className="rounded-3xl border border-slate-200 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
          {currentUser?.name?.[0] || "A"}
        </div>
        <div>
          <p className="text-base font-semibold">
            {currentUser?.name || "Not logged in"}
          </p>
          <p className="text-sm text-slate-500">
            {currentUser?.email || "Please log in to make changes"}
          </p>
        </div>
      </div>
    </div>

    <div className="mt-4">
      {isLoggedIn ? (
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-2xl border border-rose-200 px-4 py-3 text-rose-600 hover:bg-rose-50"
        >
          Log Out
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="flex w-full items-center justify-center rounded-2xl bg-violet-600 px-4 py-3 text-white hover:bg-violet-700"
        >
          Log In
        </button>
      )}
    </div>

    {/* SETTINGS BUTTON */}
    <div className="settings-container mt-4">
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-slate-600 hover:bg-slate-50"
      >
        <span className="flex items-center gap-3">
          <Settings className="h-5 w-5" />
          Settings
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
</div>
  
        <main className="min-w-0 bg-white pt-2">
          {currentPage === "Dashboard" && renderDashboard()}
          {currentPage === "Inventory" && renderInventory()}
          {currentPage === "Restock" && renderRestockPage()}
          {currentPage === "Sales" && renderSalesPage()}
          {currentPage === "Document Scanning" && renderScanPage()}
          {currentPage === "Operation Hub" && renderOperationHub()}
        </main>
      </div>
  
      {mobileMenuOpen && (
  <div
    className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
    onClick={() => setMobileMenuOpen(false)}
  />
)}
  
      {mobileDetailsOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 lg:hidden">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Item Details</h2>
              <button onClick={() => setMobileDetailsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
  
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Gem className="h-14 w-14 text-slate-400" />
                  )}
                </div>
  
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900">
                        {selectedItem.name}
                      </h3>
                      <p className="mt-1 text-slate-500">{selectedItem.id}</p>
                    </div>
                    <StatusBadge status={selectedItem.status} />
                  </div>
  
                  <div className="grid grid-cols-2 gap-3">
                    <SummaryCard label="Category" value={selectedItem.category} />
                    <SummaryCard label="Material" value={selectedItem.material} />
                    <SummaryCard label="Price" value={formatCurrency(selectedItem.price)} />
                    <SummaryCard
                      label="Stock"
                      value={`${selectedItem.stock}/${selectedItem.capacity}`}
                    />
                    <SummaryCard label="Location" value={selectedItem.location || "—"} />
                    <SummaryCard label="Status" value={selectedItem.status || "—"} />
                  </div>
                </div>
              </div>
  
              <div className="rounded-3xl border border-slate-200 p-4 text-center">
                <QRCodeSVG
                  value={window.location.origin + window.location.pathname + "#item=" + encodeURIComponent(selectedItem.id) + "&view=details"}
                  size={140}
                />
              </div>
  
              {permissions.canViewLogs && (
                <div className="rounded-3xl border border-slate-200 p-4">
                  <h4 className="mb-3 text-lg font-semibold text-slate-900">Restock History</h4>
                  <div className="space-y-3">
                    {itemLogs.length === 0 && (
                      <p className="text-sm text-slate-500">No history yet.</p>
                    )}
                    {itemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="rounded-2xl border border-slate-200 p-3">
                        <p className="font-medium text-slate-900">{log.reason}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {log.timestamp} • {log.updatedBy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <AppButton
                  className="h-12 w-full"
                  onClick={() => openRestock(selectedItem)}
                  disabled={!permissions.canEditStock}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restock This Item
                </AppButton>
  
                <AppButton
                  variant="outline"
                  className="h-12 w-full"
                  onClick={() => sendReorderEmail(selectedItem)}
                  disabled={!permissions.canReorder}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Order More
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {restockOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Stock Adjustment</h2>
              <button onClick={() => setRestockOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
  
            <p className="mt-2 text-sm text-slate-500">
              {selectedItem.id} • {selectedItem.name}
            </p>
  
            <form className="mt-5 space-y-4" onSubmit={saveRestock}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Quantity">
                  <input
                    value={restockForm.quantity}
                    onChange={(e) =>
                      setRestockForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    type="number"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    placeholder="Enter quantity"
                  />
                </Field>
  
                <Field label="Date">
                  <input
                    value={restockForm.date}
                    onChange={(e) =>
                      setRestockForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </Field>
              </div>
  
              <Field label="Adjustment Type">
                <select
                  value={restockForm.type}
                  onChange={(e) =>
                    setRestockForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                >
                  <option value="restock">Restock</option>
                  <option value="stock_out">Stock Out</option>
                  <option value="correction">Correction</option>
                  <option value="damaged">Damaged</option>
                </select>
              </Field>
  
              <Field label="Reason">
                <textarea
                  value={restockForm.reason}
                  onChange={(e) =>
                    setRestockForm((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="min-h-[100px] w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  placeholder="Example: delivery received, damaged item, recount"
                />
              </Field>
  
              <Field label="Updated By">
                <input
                  value={restockForm.updatedBy}
                  onChange={(e) =>
                    setRestockForm((prev) => ({ ...prev, updatedBy: e.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </Field>
  
              <div className="grid grid-cols-2 gap-3 pt-2">
                <AppButton
                  type="button"
                  variant="outline"
                  className="h-12"
                  onClick={() => setRestockOpen(false)}
                >
                  Cancel
                  </AppButton>

                  <AppButton
                     type="submit"
                      className="h-12 w-full"
                      onClick={!permissions.canEditStock || restockSaveStatus === "restocking"}
                        >
                      {restockSaveStatus === "restocking"
                    ? "Saving..."
                    : restockSaveStatus === "saved"
                     ? "Saved ✓"
                   : "Save Adjustment"}
              </AppButton>
              </div>
            </form>
          </div>
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
              <textarea
                value={deleteDialog.reason}
                onChange={(e) =>
                  setDeleteDialog({ ...deleteDialog, reason: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none"
                rows={3}
                placeholder="Enter reason..."
              />
            </div>
  
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setDeleteDialog({ open: false, item: null, reason: "" })
                }
                className="rounded-xl px-4 py-2 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
  
              <button
                disabled={!deleteDialog.reason.trim()}
                onClick={confirmDeleteItem}
                className="rounded-xl bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
  
  {undoDelete.open && undoDelete.item && (
  <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
    <p className="text-sm font-medium text-slate-900">
      Item deleted: {undoDelete.item.name}
    </p>
    <p className="mt-1 text-xs text-slate-500">
      You can undo this action.
    </p>

    <div className="mt-3 flex justify-end gap-2">
      <button
        type="button"
        onClick={() => setUndoDelete({ open: false, item: null })}
        className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600"
      >
        Dismiss
      </button>

      <button
        type="button"
        onClick={handleUndoDelete}
        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
      >
        Undo Delete
      </button>
    </div>
  </div>
)}
  
  {loginOpen && (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
      {activeUsers.filter((u) => u.active !== false).length === 0 ? (
        <form onSubmit={handleCreateAdmin} className="my-6 w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Create First Admin Account</h2>
            <button type="button" onClick={() => setLoginOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            No user account has been created yet. Create the first Admin account to unlock editing, sales, restock, users, and sync controls.
          </p>
          <div className="mt-4 space-y-4">
            <Field label="Name">
              <input value={setupForm.name} onChange={(e) => setSetupForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Admin name" />
            </Field>
            <Field label="Email">
              <input value={setupForm.email} onChange={(e) => setSetupForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Example: admin" />
            </Field>
            <Field label="Password">
              <input type="password" value={setupForm.password} onChange={(e) => setSetupForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Create password" />
            </Field>
            {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
            <AppButton type="submit" className="h-12 w-full">Create Admin Account</AppButton>
            <button type="button" onClick={() => { setLoginOpen(false); setCurrentPage("Dashboard"); }} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Continue in View-Only Mode
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="my-6 w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Log In</h2>
            <button type="button" onClick={() => setLoginOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            <Field label="Username">
              <select value={loginForm.email || activeUsers.filter((u) => u.active !== false)[0]?.username || activeUsers.filter((u) => u.active !== false)[0]?.email || ""} onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
                {activeUsers.filter((u) => u.active !== false).map((u) => (
                  <option key={u.id} value={u.username || u.email}>{u.name} ({roles[u.role]?.label || u.role})</option>
                ))}
              </select>
            </Field>
            <Field label="Password">
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Enter password" />
            </Field>
            {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
            <AppButton type="submit" className="h-12 w-full">Log In</AppButton>
            <button type="button" onClick={() => { setLoginOpen(false); setCurrentPage("Dashboard"); }} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Continue in View-Only Mode
            </button>
          </div>
        </form>
      )}
    </div>
  )}

  {settingsOpen && (
  <div className="settings-container fixed inset-0 z-[999] bg-white">
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">Manage user, sync, currency, and account access.</p>
        </div>
        <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-xl p-3 text-slate-500 hover:bg-slate-100">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3 sm:px-6">
        {["user", "sync", "currency", "signup"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSettingsTab(tab)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold capitalize ${settingsTab === tab ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            {tab === "signup" ? "Create Staff Account" : tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {settingsTab === "user" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">Current User</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SummaryCard label="Name" value={currentUser?.name || "Not logged in"} />
              <SummaryCard label="Username" value={currentUser?.username || currentUser?.email || "View-only mode"} />
              <SummaryCard label="Role" value={isLoggedIn ? roles[currentRole]?.label || currentRole : "View Only"} />
              <SummaryCard label="Access" value={isLoggedIn ? "Editing enabled based on role" : "View only; editing requires login"} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {isLoggedIn ? <AppButton variant="outline" onClick={handleLogout}>Log Out</AppButton> : <AppButton onClick={() => setLoginOpen(true)}>Log In</AppButton>}
            </div>

            {isLoggedIn && (
              <form onSubmit={handleChangePassword} className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
                  <p className="text-sm text-slate-500">Update your own login password.</p>
                </div>
                <Field label="Current Password"><input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="New Password"><input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                  <Field label="Confirm New Password"><input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                </div>
                {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
                <AppButton type="submit" disabled={passwordSaveStatus === "saving"} className={`h-12 ${passwordSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`}>
                  {passwordSaveStatus === "saving" ? "Saving..." : passwordSaveStatus === "saved" ? "Saved ✓" : "Change Password"}
                </AppButton>
              </form>
            )}

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Users</h3>
                  <p className="text-sm text-slate-500">Create and manage staff access from Settings.</p>
                </div>
                <AppButton
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSettingsTab("signup");
                    setUserForm(emptyUserForm);
                  }}
                  disabled={!isLoggedIn || currentRole !== "admin"}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Add User
                </AppButton>
              </div>

              <div className="mt-4 space-y-3">
                {activeUsers.map((u) => (
                  <div key={u.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.username || u.email} • {roles[u.role]?.label || u.role}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <UserRoleBadge role={u.role} />
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.active !== false ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        {u.active !== false ? "Active" : "Disabled"}
                      </span>
                      <AppButton
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-xs"
                        onClick={() => toggleUserActive(u.id)}
                        disabled={!permissions.canManageUsers}
                      >
                        {u.active !== false ? "Disable" : "Activate"}
                      </AppButton>
                      <AppButton
                        type="button"
                        variant="outline"
                        className="h-9 px-3 text-xs text-rose-600"
                        onClick={() => deleteUser(u.id)}
                        disabled={!permissions.canManageUsers}
                      >
                        Delete
                      </AppButton>
                    </div>
                  </div>
                ))}
                {activeUsers.length === 0 && (
                  <p className="rounded-2xl bg-white p-4 text-sm text-slate-500">No users yet. Create the first Admin account.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {settingsTab === "sync" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">Google Sheets Sync</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SummaryCard label="Sync Status" value={syncBusy ? "Syncing..." : syncStatus} />
              <SummaryCard label="Last Sync" value={lastSync || "—"} />
            </div>
            {syncError && <p className="mt-3 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{syncError}</p>}
            <AppButton className="mt-5" onClick={handleManualSync} disabled={!permissions.canSync || syncBusy}>
              {syncBusy ? "Syncing..." : "Sync Now"}
            </AppButton>
            {!permissions.canSync && <p className="mt-3 text-sm text-slate-500">Please log in as Admin to sync manually.</p>}
          </div>
        )}

        {settingsTab === "currency" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">Currency</h3>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none">
              <option value="THB">THB</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="SGD">SGD</option><option value="JPY">JPY</option><option value="PHP">PHP</option><option value="CAD">CAD</option><option value="CNY">CNY</option><option value="AUD">AUD</option>
            </select>
          </div>
        )}

        {settingsTab === "signup" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-xl font-semibold text-slate-900">Create Staff Login Account</h3>
            <p className="mt-1 text-sm text-slate-500">Only Admin can create staff accounts. Staff can later change their own password from the user settings workflow.</p>
            {(!isLoggedIn || currentRole !== "admin") && activeUsers.length > 0 ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">Please log in as Admin first.</div>
            ) : (
              <form onSubmit={saveUser} className="mt-5 space-y-4">
                <Field label="Staff Name"><input value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="Username"><input value={userForm.username || userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="Temporary Password"><input type="password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
                <AppButton type="submit" className={`h-12 w-full ${userSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`} disabled={userSaveStatus === "saving"}>
                  <UserCog className="mr-2 h-4 w-4" />{userSaveStatus === "saving" ? "Saving..." : userSaveStatus === "saved" ? "Saved ✓" : activeUsers.length === 0 ? "Create First Admin" : "Create Staff Account"}
                </AppButton>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
)}

          {qrModalItem && renderQrModal()}
         {itemFormOpen && renderItemForm()}
        {userFormOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
            <form onSubmit={saveUser} className="my-6 w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {activeUsers.filter((u) => u.active !== false).length === 0
                    ? "Create Admin Account"
                     : "Create Staff Account"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setUserForm(emptyUserForm);
                    setUserFormOpen(false);
                    setLoginError("");
                  }}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {activeUsers.filter((u) => u.active !== false).length === 0
                  ? "Create the first Admin account to unlock editing, sales, restock, users, and sync controls."
                  : "Create a staff login account. Admin controls role and access from the Users page."}
              </p>

              <div className="mt-4 space-y-4">
                <Field label="Name">
                  <input
                    value={userForm.name}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    placeholder="Full name"
                  />
                </Field>

                <Field label="Email">
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    placeholder="email@example.com"
                  />
                </Field>

                <Field label="Password">
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                    placeholder="Create password"
                  />
                </Field>

                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  Account type: <span className="font-semibold text-slate-900">
                    {activeUsers.filter((u) => u.active !== false).length === 0  ? "Admin" : "Staff"}
                  </span>
                </div>

                {loginError && <p className="text-sm text-rose-600">{loginError}</p>}

                <AppButton
                  type="submit"
                  className={`h-12 w-full ${userSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`}
                  disabled={userSaveStatus === "saving"}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  {userSaveStatus === "saving"
                    ? "Saving..."
                    : userSaveStatus === "saved"
                    ? "Saved ✓"
                    : activeUsers.filter((u) => u.active !== false).length === 0
                    ? "Create Admin Account"
                     : "Create Staff Account"}
                </AppButton>
              </div>
            </form>
          </div>
        )}
       </div>
    );
    }
