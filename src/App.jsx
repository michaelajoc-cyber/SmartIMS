import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ExternalLink, JapaneseYen } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import imsLogo from "./assets/ims-logo.png";
import autoTable from "jspdf-autotable";
import {
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
  "https://script.google.com/macros/s/AKfycbwDBUKqrCstLNEXYS9Nk1lqczwiHJNHSFyytqmVyqnVV8OLVn8CcgdzgqVH6dMGeMS5Tw/exec";

const initialItems = [
  {
    id: "PRD-001",
    name: "Wireless Keyboard",
    category: "Electronics",
    material: "Plastic",
    price: 1200,
    stock: 15,
    minStock: 5,
    capacity: 30,
    barcode: "8901234567890",
    location: "A1-01",
    weight: "0.8kg",
    variant: "Bluetooth",
    size: "Standard",
    specification: "Rechargeable, USB-C",
    supplier: "Tech Supplier",
    supplierEmail: "supplier@example.com",
    description: "Wireless rechargeable keyboard for office or retail use",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image: "",
    isDeleted: false,
  },
  {
    id: "PRD-002",
    name: "Motorcycle Helmet",
    category: "Motorcycle Parts",
    material: "ABS Plastic",
    price: 2500,
    stock: 8,
    minStock: 3,
    capacity: 20,
    barcode: "8901234567891",
    location: "B1-03",
    weight: "1.2kg",
    variant: "Full Face",
    size: "Large",
    specification: "DOT Certified",
    supplier: "Moto Supplier",
    supplierEmail: "supplier@example.com",
    description: "Protective motorcycle helmet",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image: "",
    isDeleted: false,
  },
  {
    id: "PRD-003",
    name: "Cotton T-Shirt",
    category: "Clothing",
    material: "Cotton",
    price: 350,
    stock: 25,
    minStock: 10,
    capacity: 50,
    barcode: "8901234567892",
    location: "C2-04",
    weight: "0.2kg",
    variant: "Round Neck",
    size: "Medium",
    specification: "Black",
    supplier: "Apparel Supplier",
    supplierEmail: "supplier@example.com",
    description: "Basic cotton t-shirt",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image: "",
    isDeleted: false,
  },
  {
    id: "PRD-004",
    name: "Bicycle Tire",
    category: "Bicycle Parts",
    material: "Rubber",
    price: 650,
    stock: 4,
    minStock: 5,
    capacity: 25,
    barcode: "8901234567893",
    location: "D3-02",
    weight: "0.7kg",
    variant: "Mountain Bike",
    size: "26 inch",
    specification: "All-terrain tread",
    supplier: "Bike Supplier",
    supplierEmail: "supplier@example.com",
    description: "Replacement bicycle tire",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image: "",
    isDeleted: false,
  },
  {
    id: "PRD-005",
    name: "Office Storage Box",
    category: "Office Supplies",
    material: "Plastic",
    price: 180,
    stock: 0,
    minStock: 6,
    capacity: 40,
    barcode: "8901234567894",
    location: "E1-05",
    weight: "0.5kg",
    variant: "Stackable",
    size: "Medium",
    specification: "Transparent",
    supplier: "Office Supplier",
    supplierEmail: "supplier@example.com",
    description: "General-purpose storage box",
    dateAdded: "2026-05-08",
    updatedAt: "2026-05-12",
    image: "",
    isDeleted: false,
  },
];

const initialLogs = [
  {
    id: 1,
    sku: "PRD-001",
    itemName: "Wireless Keyboard",
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
    sku: "PRD-003",
    itemName: "Cotton T-Shirt",
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
    sku: "PRD-003",
    itemName: "Cotton T-Shirt",
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
  "Electronics",
  "Clothing",
  "Motorcycle Parts",
  "Bicycle Parts",
  "Accessories",
  "Office Supplies",
  "Warehouse Items",
  "Tools",
  "Others",
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
  superadmin: {
    label: "Super Admin",
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
    canCreateAdminAccount: true,
  },
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
    canCreateAdminAccount: false,
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
  category: "Electronics",
  material: "",
  price: "",
  stock: "",
  minStock: "",
  capacity: "",
  barcode: "",
  location: "",
  weight: "",
  variant: "",
  size: "",
  specification: "",
  supplier: "",
  supplierEmail: "",
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
  soldBy: "",
};

const emptyUserForm = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: "staff",
  active: true,
  isDeleted: false,
};

const STORAGE_KEY = "smartIMSData";

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
    "admin@smartims.com",
    "staff@smartims.com",
    "viewer@smartims.com",
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
  const isAdminRoute = window.location.pathname === "/admin";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      currentRole: savedUser ? savedUser.role : "viewer",
      isLoggedIn: Boolean(data.isLoggedIn && savedUser),
    };

    if (JSON.stringify(cleanedData.users) !== JSON.stringify(data.users || []) || cleanedData.isLoggedIn !== data.isLoggedIn) {
      saveLocalData(cleanedData);
    }

    return cleanedData;
  }, []);

  const handleBackupData = () => {
    const data = getSavedData() || {};
  
    const backup = {
      inventory: data.items || [],
      logs: data.logs || [],
      users: data.users || [],
      sales: data.sales || [],
      exportedAt: new Date().toISOString(),
    };
  
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
  
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
  
    a.href = url;
    a.download = `smartims-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };
  
  const exportExcelReport = () => {
    const workbook = XLSX.utils.book_new();
  
    const inventorySheet = XLSX.utils.json_to_sheet(items || []);
    const salesSheet = XLSX.utils.json_to_sheet(sales || []);
    const logsSheet = XLSX.utils.json_to_sheet(logs || []);
  
    XLSX.utils.book_append_sheet(workbook, inventorySheet, "Inventory");
    XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales");
    XLSX.utils.book_append_sheet(workbook, logsSheet, "Logs");
  
    XLSX.writeFile(workbook, `smartims-report-${Date.now()}.xlsx`);
  };
  
  const exportPDFReport = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text("Sales Report", 14, 20);
  
    autoTable(doc, {
      startY: 30,
      head: [["SKU", "Item", "Qty", "Price", "Total", "Sold By"]],
      body: (sales || []).map((sale) => [
        sale.sku || "",
        sale.itemName || "",
        sale.quantity || 0,
        sale.price || 0,
        sale.total || 0,
        sale.soldBy || "",
      ]),
    });
  
    doc.save(`smartims-sales-report-${Date.now()}.pdf`);
  };
  const handleRestoreData = (event) => {
    const file = event.target.files[0];
  
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
  
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(data)
        );
  
        alert("Backup restored successfully!");
  
        window.location.reload();
      } catch (error) {
        alert("Invalid backup file.");
      }
    };
  
    reader.readAsText(file);
  };
  const [salesReportView, setSalesReportView] = useState("daily");
  const [items, setItems] = useState(savedData?.items?.length ? savedData.items : initialItems);
  const [logs, setLogs] = useState(savedData?.logs?.length ? savedData.logs : initialLogs);
  const [users, setUsers] = useState(
    savedData?.users?.length
      ? savedData.users
      : [
          {
            id: 1,
            username: "superadmin",
            password: "superadmin123",
            role: "superadmin",
            name: "Super Admin",
          },
        ]
  );
  const [sales, setSales] = useState(savedData?.sales?.length ? savedData.sales : initialSales);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(savedData?.currentRole || "superadmin");
  const [currentUserEmail, setCurrentUserEmail] = useState(

    savedData?.currentUserEmail || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
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
    updatedBy: `${currentUserEmail || "Unknown"} (${currentRole || "staff"})`,
  });

  const [itemForm, setItemForm] = useState(emptyItemForm);
  const [saleForm, setSaleForm] = useState({
    ...emptySaleForm,
    soldBy: currentUserEmail || currentRole || "Staff",
  });
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [saleSaveStatus, setSaleSaveStatus] = useState("idle");
  const [restockSaveStatus, setRestockSaveStatus] = useState("idle");
  const [userSaveStatus, setUserSaveStatus] = useState("idle");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaveStatus, setPasswordSaveStatus] = useState("idle");
  const [operationOrders, setOperationOrders] = useState(savedData?.operationOrders || []);
  const [operationSaveStatus, setOperationSaveStatus] = useState("idle");
  const [operationForm, setOperationForm] = useState({
    type: "Customer Invoice",
    title: "",
    amount: "",
    dueDate: "",
    notes: "",
    customer: "",
    status: "Pending",
    itemDetails: "",
    quantity: 1,
    unitPrice: "",
    discount: 0,
    paymentMethod: "Cash",
    serviceAmount: "",
    staffShare: "",
    deductions: "",
    finalServiceCharge: 0,
  });
  const [documentViewModal, setDocumentViewModal] = useState(null);
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
    THB: 1 / 1,
    USD: 1 / 32.32,
    EUR: 1 / 38.30,
    GBP: 1 / 43.48, 
    SGD: 1 / 25.15,
    PHP: 1 / .50,
    JPY: 1 / 20,
    CAD: 1 / 23.54,
    AUD: 1 / 22.90,
    CNY: 1 / 4.69,

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

const operationTypes = [
  "Customer Invoice",
  "Job Order",
  "Factory Job Order Sheet",
  "Staff Service Charge",
  "Scheduled Payment",
  "Rent",
  "Tax",
  "Staff Salary",
  "Others",
];

const companyInfo = {
  name: "SmartIMS",
  address: "Street Address, City, Zip Code",
  phone: "Phone Number",
  email: "Email Address",
};

  function getDueStatus(dueDate, status) {
    if (status === "Paid") return "paid";
  
    const today = new Date();
    const due = new Date(dueDate);
  
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  
    if (diff < 0) return "overdue";
    if (diff <= 2) return "urgent";
    if (diff <= 7) return "soon";
  
    return "safe";
  }
  
  function getDueStyles(status) {
    switch (status) {
      case "paid":
        return {
          bar: "bg-emerald-500",
          badge: "bg-emerald-100 text-emerald-700",
          label: "Paid",
        };
  
      case "soon":
        return {
          bar: "bg-yellow-400",
          badge: "bg-yellow-100 text-yellow-700",
          label: "Due Soon",
        };
  
      case "urgent":
        return {
          bar: "bg-orange-500",
          badge: "bg-orange-100 text-orange-700",
          label: "Urgent",
        };
  
      case "overdue":
        return {
          bar: "bg-rose-600",
          badge: "bg-rose-100 text-rose-700",
          label: "Overdue",
        };
  
      default:
        return {
          bar: "bg-blue-500",
          badge: "bg-slate-100 text-slate-700",
          label: "Active",
        };
    }
  }
  const enrichedItems = useMemo(
    () =>
      items
        .filter((item) => item.isDeleted !== true && item.isDeleted !== "true")
        .map((item) => ({
          ...item,
          variant: item.variant ?? item.stone ?? "",
          size: item.size ?? item.ringSize ?? "",
          specification: item.specification ?? "",
          stock: Number(item.stock || 0),
          minStock: Number(item.minStock || 1),
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
        `${item.id} ${item.name} ${item.material} ${item.category} ${item.variant || ""} ${item.size || ""} ${item.specification || ""} ${item.status}`.toLowerCase();
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
    if (currentPage !== "Document Scanning") return;
  
    const timer = setTimeout(() => {
      startScanner();
    }, 500);
  
    return () => {
      clearTimeout(timer);
      stopScanner?.();
    };
  }, [currentPage]);

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
        currentRole: stillLoggedInUser ? stillLoggedInUser.role || "superadmin" : "superadmin",
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
      minStock: Number(row.minStock || row["Min Stock"] || 1),
      capacity: Number(row.capacity || row.Capacity || 0),
      image: row.image || row.Image || "",
      barcode: row.barcode || row.Barcode || "",
      supplier: row.supplier || row.Supplier || "",
      supplierEmail: row.supplierEmail || row["Supplier Email"] || "",
      location: row.location || row.Location || "",
      weight: row.weight || row.Weight || "",
      variant: row.variant || row.Variant || row.stone || row.Stone || "",
      size: row.size || row.Size || row.ringSize || row["Size"] || row["Ring Size"] || "",
      specification: row.specification || row.Specification || "",
      description: row.description || row.Description || "",
      dateAdded: row.dateAdded || row["Date Added"] || new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T").slice(0, 10),
      updatedAt: row.updatedAt || row["Last Updated"] || new Date().toLocaleString("sv-SE", {
        timeZone: "Asia/Bangkok"
      }).replace(" ", "T"),
      isDeleted:
  String(row.isDeleted ?? row["Is Deleted"] ?? "")
    .trim()
    .toLowerCase() === "true",
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
      .filter((item) => String(item.isDeleted).trim().toLowerCase() === "true")
        .map((item) => String(item.id))
    );

    const localOnlyItems = prevItems.filter(
      (item) =>
        item.id &&
        !sheetIds.has(String(item.id)) &&
        !deletedSheetIds.has(String(item.id)) &&
        String(item.isDeleted).trim().toLowerCase() !== "true"
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
      updatedBy: currentUserEmail || currentRole || "Staff",
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
      originalStock: Number(item.stock ?? 0),
      minStock: String(item.minStock ?? "1"),
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

  function printOperationDocument(doc) {
    const isViewer = currentRole !== "admin";
    const popup = window.open("", "_blank");
  
    popup.document.write(`
      <html>
        <head>
          <title>${doc.type}</title>
  
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #111827;
            }
  
            .invoice-container {
              max-width: 900px;
              margin: auto;
            }
  
            .top-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            .paid-stamp {
              display: inline-block;
              margin-top: 12px;
              border: 3px solid #dc2626;
              color: #dc2626;       
              font-size: 28px;
              font-weight: bold;
              padding: 8px 18px;
              transform: rotate(-8deg);
            }
  
            .company-name {
              font-size: 40px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
  
            .invoice-title {
              font-size: 35px;
              font-weight: bold;
              color: #2563eb;
               text-align: right;
              width: 100%;
              margin-left: auto;
              }
  
            .section-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #2563eb;
            }
  
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
  
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
  
            th {
              background: #2563eb;
              color: white;
              padding: 12px;
              text-align: left;
            }
  
            td {
              border: 1px solid #d1d5db;
              padding: 12px;
            }
  
            .totals {
              margin-top: 30px;
              width: 320px;
              margin-left: auto;
            }
  
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #d1d5db;
            }
  
            .grand-total {
              font-size: 22px;
              font-weight: bold;
              color: #2563eb;
            }
  
            .signature {
              margin-top: 80px;
              text-align: right;
            }
  
            .signature-line {
              margin-top: 50px;
              border-top: 1px solid #111;
              width: 220px;
              margin-left: auto;
              padding-top: 8px;
              text-align: center;
            }
  
            .footer {
              margin-top: 60px;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
  
        <body>
          <div class="invoice-container">
            <div class="top-header">
              <div>
                <div class="company-name">
                  ${companyInfo.name}
                </div>
  
                <div>${companyInfo.address}</div>
                <div>${companyInfo.phone}</div>
                <div>${companyInfo.email}</div>
              </div>
  
              <div class="invoice-title">
                ${doc.type}
              </div>
            </div>
  
            <div class="grid">
  
              <div>
                <div class="section-title">Bill To</div>
  
                <div>${doc.customer || "-"}</div>
              </div>
  
              <div style="margin-left:auto; text-align:right;">
              <div><strong>Reference:</strong> ${doc.reference || "-"}</div>
              <div><strong>Date:</strong> ${doc.createdAt || "-"}</div>
              <div><strong>Due Date:</strong> ${doc.dueDate || "-"}</div>
              <div><strong>Status:</strong> ${doc.status || "Pending"}</div>
              </div>
  
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
  
              <tbody>
                <tr>
                  <td>${doc.itemDetails || doc.notes || "-"}</td>
                  <td>${doc.quantity || 1}</td>
                  <td>${doc.unitPrice || 0}</td>
                  <td>${doc.amount || 0}</td>
                </tr>
              </tbody>
            </table>
  
            <div class="totals">

  ${
    doc.type === "Staff Service Charge"
      ? `
        <div class="totals-row">
          <span>Service Amount</span>
          <span>฿${doc.serviceAmount || 0}</span>
        </div>

        <div class="totals-row">
          <span>Staff Share %</span>
          <span>${doc.staffShare || 0}%</span>
        </div>

        <div class="totals-row">
          <span>Deductions</span>
          <span>฿${doc.deductions || 0}</span>
        </div>

        <div class="totals-row grand-total">
          <span>Total</span>
          <span>฿${doc.finalServiceCharge || 0}</span>
        </div>
      `
      : `
        <div class="totals-row">
          <span>Subtotal</span>
          <span>฿${doc.amount || 0}</span>
        </div>

        <div class="totals-row">
          <span>Discount</span>
          <span>${doc.discount || 0}%</span>
        </div>

        <div class="totals-row grand-total">
          <span>Total</span>
          <span>฿${doc.amount || 0}</span>
        </div>
      `
  }

</div>
  
            <div style="margin-top:40px;">
              <strong>Notes:</strong><br/>
              ${doc.notes || "-"}
            </div>

            ${doc.status === "Paid"
              ? `<div class="paid-stamp">PAID</div>`
              : ""}

            <div class="signature">
              <div class="signature-line">
                Authorized Signature
              </div>
            </div>
  
            <div class="footer">
              Thank you for your business!
            </div>
  
          </div>
  
        </body>
      </html>
    `);
  
    popup.document.close();

    popup.focus();
    
    if (currentRole === "admin", "superadmin") {
      popup.print();
    }
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
    items: Array.isArray(nextData.items) ? nextData.items : items || [],
    logs: Array.isArray(nextData.logs) ? nextData.logs : logs || [],
    users: Array.isArray(nextData.users) ? nextData.users : users || [],
    sales: Array.isArray(nextData.sales) ? nextData.sales : sales || [],
    operationOrders: Array.isArray(nextData.operationOrders)
      ? nextData.operationOrders
      : operationOrders || [],
  };

  console.log("SMARTIMS SYNC DATA:", dataToSave);

  saveLocalData({
    ...dataToSave,
    currentRole,
    currentUserEmail,
    isLoggedIn,
  });

  try {
    setSyncBusy(true);
    setSyncError("");
    setSyncStatus("Saving locally and syncing to Google Sheets...");

    const cleanedItems = dataToSave.items.map((item) => ({
      ...item,
    
      // prevent oversized Google Sheet cells
      image:
        typeof item.image === "string" &&
        item.image.length > 40000
          ? ""
          : item.image,
    
      qrCode:
        typeof item.qrCode === "string" &&
        item.qrCode.length > 40000
          ? ""
          : item.qrCode,
    
      description:
        typeof item.description === "string"
          ? item.description.slice(0, 5000)
          : item.description,
    }));

    await syncToGoogleSheet({
      action: "syncAllData",
    
      payload: {
        ...dataToSave,
        items: cleanedItems,
      },
    
      items: cleanedItems,
      logs: dataToSave.logs,
      users: dataToSave.users,
      sales: dataToSave.sales,
      operationOrders: dataToSave.operationOrders || [],
      documents: dataToSave.operationOrders || [],
    
      lastAction: extra.action || "syncAllData",
      item: extra.item || null,
      user: extra.user || null,
      sale: extra.sale || null,
      log: extra.log || null,
      timestamp: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
        .replace(" ", "T"),
    });

    const time = new Date().toLocaleTimeString();
    setLastSync(time);
    setSyncStatus(`Synced to Google Sheets at ${time}`);
    return true;
  } catch (error) {
    console.error("SYNC ERROR:", error);
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
  try {
    setIsUpdating(true);

  if (!permissions.canCreateItem && itemFormMode === "add") return;
  if (!permissions.canEditItem && itemFormMode === "edit") return;

 const oldItem = items.find(
  (item) => String(item.id) === String(itemForm.id)
);
const oldStock = Number(oldItem?.stock ?? 0);
const normalized = {
  ...itemForm,
  price: Number(itemForm.price || 0),
  stock: Number(itemForm.stock || 0),
  minStock: Number(itemForm.minStock || 1),
  capacity: Number(itemForm.capacity || 0),
  updatedAt: new Date()
    .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
    .replace(" ", "T"),
  isDeleted: false,
  deletedAt: "",
  deletedBy: "",
  deleteReason: "",
};

const updatedItems =
  itemFormMode === "add"
    ? [normalized, ...items]
    : items.map((item) =>
        String(item.id) === String(normalized.id) ? normalized : item
      );

      const itemLog =
      itemFormMode === "add"
        ? {
            id: Date.now(),
            sku: normalized.id,
            itemName: normalized.name,
            previousQty: 0,
            change: Number(normalized.stock || 0),
            newQty: Number(normalized.stock || 0),
            reason: "Item added",
            type: "add",
            updatedBy: currentUser?.name || currentUserEmail || "Admin",
            timestamp: new Date()
              .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
              .replace(" ", "T"),
          }
        : itemFormMode === "edit"
        ? {
            id: Date.now(),
            sku: normalized.id,
            itemName: normalized.name,
            previousQty: Number(itemForm.originalStock ?? oldStock),
            change:
              Number(itemForm.stock ?? 0) -
              Number(itemForm.originalStock ?? oldStock),
            newQty: Number(itemForm.stock ?? 0),
            reason: "Item edited",
            type: "edit",
            updatedBy: currentUser?.name || currentUserEmail || "Admin",
            timestamp: new Date()
              .toLocaleString("sv-SE", { timeZone: "Asia/Bangkok" })
              .replace(" ", "T"),
          }
        : null;
    
    const updatedLogs = itemLog ? [itemLog, ...logs] : logs;


  setItems(updatedItems);
  setLogs(updatedLogs);
  setSelectedItemId(normalized.id);

  await pushAllToSheets(
    {
      items: updatedItems,
      logs: updatedLogs,
      users,
      sales,
      operationOrders,
    },
    { action: itemFormMode === "add" ? "SAVE_ITEM" : "UPDATE_ITEM", item: normalized }
  );
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  setIsUpdating(false);
  setItemFormOpen(false);
  
} catch (error) {
  console.error("Save item failed:", error);
  alert("Item was not saved. Please try again.");
} finally {
  setIsUpdating(false);
}
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
  }, 800);
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
    if (userForm.role === "admin" && !roles[currentRole]?.canCreateAdminAccount) {
      setLoginError("Only Super Admin can create Admin accounts.");
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
      role: isFirstAccount ? "admin" : userForm.role || "staff",
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
    }, 800);
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

  const cleanValue = String(rawValue).trim().toLowerCase();

  let extractedValue = cleanValue;

  try {
    const parsed = JSON.parse(rawValue);
    extractedValue = String(
      parsed.sku || parsed.id || parsed.barcode || rawValue
    )
      .trim()
      .toLowerCase();
  } catch {}

  const found = enrichedItems.find((item) => {
    const values = [
      item.id,
      item.sku,
      item.barcode,
      item.name,
    ].map((v) => String(v || "").trim().toLowerCase());

    return values.some(
      (v) =>
        v &&
        (v === extractedValue ||
          cleanValue.includes(v) ||
          extractedValue.includes(v))
    );
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

  async function confirmDeleteItem() {
  if (!deleteDialog.item) return;

  const reason = deleteDialog.reason?.trim();
  if (!reason) {
    alert("Please state the reason before deleting this item.");
    return;
  }

  const itemToDelete = deleteDialog.item;

  const updatedItems = items.map((item) =>
    String(item.id) === String(itemToDelete.id)
      ? {
          ...item,
          isDeleted: true,
          deletedAt: new Date().toLocaleString("sv-SE", {
            timeZone: "Asia/Bangkok",
          }).replace(" ", "T"),
          deletedBy: currentUser?.name || currentUserEmail || "Admin",
          deleteReason: reason,
        }
      : item
  );

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
    timestamp: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Bangkok",
    }).replace(" ", "T"),
  };

  const updatedLogs = [deleteLog, ...logs];

  setItems(updatedItems);
  setLogs(updatedLogs);
  setSelectedItemId(null);
  setMobileDetailsOpen(false);

  setDeleteDialog({
    open: false,
    item: null,
    reason: "",
  });
  setUndoDelete({
    open: true,
    item: itemToDelete,
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
  const salesReportData = useMemo(() => {
    const now = new Date();
  
    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.timestamp);
  
      if (salesReportView === "daily") {
        return saleDate.toDateString() === now.toDateString();
      }
  
      if (salesReportView === "weekly") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
  
        return saleDate >= startOfWeek && saleDate <= now;
      }
  
      if (salesReportView === "monthly") {
        return (
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      }
  
      return true;
    });
  
    const totalSales = filtered.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
    const totalItems = filtered.reduce((sum, sale) => sum + Number(sale.quantity || 0), 0);
    const transactions = filtered.length;
  
    const itemCount = {};
    filtered.forEach((sale) => {
      itemCount[sale.itemName] = (itemCount[sale.itemName] || 0) + Number(sale.quantity || 0);
    });
  
    const topItem =
      Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  
    return {
      filtered,
      totalSales,
      totalItems,
      transactions,
      topItem,
    };
  }, [sales, salesReportView]);

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!isLoggedIn || !currentUser) {
      setLoginError("Please use an authorized account first.");
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
    setTimeout(() => setPasswordSaveStatus("idle"), 1000);
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

        <div className="ml-auto flex items-center gap-4">
          {["THB", "USD","PHP"].map((code) => (
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
          icon={Package}
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

      <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 -mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-slate-900">
        Sales Report
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Daily, weekly, and monthly sales overview
      </p>
    </div>

    <div className="rounded-2xl flex w-full gap-2 overflow-visible sm:w-auto sm:justify-end">
      {["daily", "weekly", "monthly"].map((view) => (
        <button
          key={view}
          type="button"
          onClick={() => setSalesReportView(view)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer ${
            salesReportView === view
              ? "bg-violet-600 text-white shadow-md border-0 outline-none ring-0 scale-105"
              : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700 hover:-translate-y-1 hover:shadow-sm border-0"
          }`}
        >
          {view.charAt(0).toUpperCase() + view.slice(1)}
        </button>
      ))}
    </div>
  </div>

  <div className="grid gap-4 md:grid-cols-4">
  <div className="rounded-2xl bg-slate-50 px-4 py-2 flex flex-col transition hover:shadow-md hover:border-violet-500 cursor-pointer">
      <p className="text-sm text-slate-800">Total Sales</p>
      <p className="text-2xl font-bold text-slate-900">
        {formatCurrency(salesReportData.totalSales)}
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 px-4 py-2 flex flex-col  transition hover:shadow-md hover:border-violet-500 cursor-pointer">
      <p className="text-sm text-slate-800">Items Sold</p>
      <p className="text-2xl font-bold text-slate-900">
        {salesReportData.totalItems}
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 px-4 py-2 flex flex-col  transition hover:shadow-md hover:border-violet-500 cursor-pointer">
      <p className="text-sm text-slate-800">Transactions</p>
      <p className="text-2xl font-bold text-slate-900">
        {salesReportData.transactions}
      </p>
    </div>

    <div className="rounded-2xl bg-slate-50 px-4 py-2 flex flex-col transition hover:shadow-md hover:border-violet-500 cursor-pointer">
      <p className="text-sm text-slate-800">Top Item</p>
      <p className="text-lg font-bold text-slate-900">
        {salesReportData.topItem}
      </p>
    </div>
  </div>
</div>

      <div className="h-[300px] overflow-hidden">
        <div className="sticky top-4 z-10 bg-white border-b border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">
              Latest
              </span>
          </div>
          </div>

          <div className="h-[260px] overflow-y-auto pr-2 space-y-3">
            {logs.slice(0, 6).map((log) => (
              <div
              key={log.id}
                className="rounded-2xl border border-slate-200 p-4 transition-all duration-200 hover:shadow-md hover:border-violet-300 hover:-translate-y-1 cursor-pointer"
                >
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


        <div className="h-[300px] overflow-hidden">
        <div className="sticky top-1 z-10 bg-white border-b border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Stock Overview</h2>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600">Live

            </span>
          </div>

          <div className="h-[260px] overflow-y-auto pr-2 space-y-3">
            {enrichedItems.slice(0, 7).map((item) => {
              const width = item.capacity > 0 ? Math.max(8, Math.min(100, (item.stock / item.capacity) * 100)) : 8;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectItem(item)}
                  className="w-full rounded-2xl border border-slate-200 p-4 duration-200 hover:shadow-md hover:border-violet-300 hover:-translate-y-1 cursor-pointer"
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
     <div className="p-4 sm:p-6 xl:p-0"> 
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
      Inventory
    </h1>

    <p className="mt-1 text-slate-500">
      {filteredItems.length} of {enrichedItems.length} items
    </p>
  </div>


          <div className="flex justify-end self-start -mt-1 ml-auto pr-2">
              <AppButton
                className="h-12 w-full px-5 shrink-0 "
                onClick={openAddItem}
                disabled={!permissions.canCreateItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </AppButton>
            </div>
          </div>

      
          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SKU, name, material..."
                className="h-12 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-base outline-none"
              />
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              {roles[currentRole]?.label}
            </div>
          </div>
          
          <div className="mt-4 mb-0 flex flex-wrap gap-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-2 text-sm sm:px-5 sm:text-base ${
                  category === c ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 duration-300 hover:shadow-md hover:border-violet-300 hover:-translate-y-1 cursor-pointer"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 mt-0 px-4 sm:px-6 xl:px-8">
          <div className="rounded-[28px] border border-slate-200 overflow-hidden bg-white"> 
            <div className="overflow-x-auto overflow-y-auto max-h-[75vh]">  
            <table className="min-w-[980px] w-full border-collapse text-xs xl:text-sm">
            <thead className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
              <tr className="text-left text-[11px] sm:text-xs xl:text-sm text-slate-500">
                  <th className="px-4 py-4"></th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">SKU</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Name</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Category</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Material</th>
                  <th className="px-3 py- font-semibold bg-slate-50">Price</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Stock</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Location</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Status</th>
                  <th className="px-3 py-4 font-semibold bg-slate-50">Actions</th>
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
                              <Package className="h-6 w-6 text-slate-400" />
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
          </div>

          <p className="px-2 pt-6 text-sm text-slate-500">
            Showing {filteredItems.length} of {enrichedItems.length} items
          </p>
        </div>

        {selectedItem && (
          <div className="fixed inset-0 z-40 hidden xl:block"
                onClick={() => {
                setSelectedItemId(null);
                setMobileDetailsOpen(false);
              }}
              >
                <div className="fixed right-6 top-6 h-[calc(100vh-48px)] w-[420px] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
                    >
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

          <div className="mt-4 flex justify-center">
            <div className="h-[160px] w-[160px] overflow-hidden rounded-2xl border border-slate-300">
              {selectedItem.image ? (
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-50">
                  <Package className="h-10 w-10 text-slate-400" />
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

          <div className="mt-4 flex items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold text-slate-900">{selectedItem.name}</h3>
            <StatusBadge status={selectedItem.status} />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 mb-3">
            <SummaryCard label="SKU" value={selectedItem.id} />
            <SummaryCard label="Name" value={selectedItem.name} />
            <SummaryCard label="Price" value={formatCurrency(selectedItem.price)} />
            <SummaryCard label="Material" value={selectedItem.material} />
            <SummaryCard label="Stock" value={selectedItem.stock} />
            <SummaryCard label="Location" value={selectedItem.location || "—"} />
          </div>

          {permissions.canViewLogs && (
            <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-slate-300 bg-white p-5">
              <div className="text-xl font-semibold text-slate-900">
                Restock History
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                {itemLogs.length === 0 && (
                  <p className="text-sm text-slate-500">No history yet.</p>
                )}
                {itemLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl border border-slate-200 p-4 mb-3">
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
        </div>
      )}
    </div>
  );

  const renderRestockPage = () => (
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
            Restock Form
          </h1>
          <p className="mt-1 text-slate-500">
            View stock adjustments. Staff account is required to save changes
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
            View sales records. Staff account is required to record a sale
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

        <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-slate-900">
              Recent Sales</h2>

              <div className="absolute bottom-2 right-15">
              <div className="rounded-2xl bg-slate-5 px-5 py-2 text-sm text-slate-600 shadow-sm">
                Total:{" "}
              <span className="font-semibold text-slate-900">
          {formatCurrency(totalSalesValue)}
      </span>
    </div>
  </div>

        <div className="max-h-[320px] overflow-y-auto">
            {sales.length === 0 && (
              <p className="text-sm text-slate-500">No sales recorded yet.</p>
            )}
            {sales.map((sale) => (
              <div key={sale.id} className="rounded-2xl border border-slate-200 p-4 mb-3">
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
      <div className="flex items-center gap-3 mb-6">
  <button
    onClick={() => setMobileMenuOpen(true)}
    className="rounded-2xl border border-slate-200 p-3 text-slate-600 lg:hidden"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <div>
    <h1 className="text-3xl font-semibold text-slate-900">
      Operation Hub
    </h1>

    <p className="mt-1 text-slate-500">
      Manage invoices, job orders, dues, salaries, tax, and business operations.
    </p>
  </div>
</div>
      <div className="grid gap-6 xl:grid-cols-2">
  
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h2 className="mb-5 text-2xl font-semibold">
            Create Document
          </h2>
  
          <div className="space-y-4">
  
            <Field label="Document Type">
              <select
                value={operationForm.type}
                onChange={(e) =>
                  setOperationForm({
                    ...operationForm,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              >
                {operationTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>
  
            <Field label="Title / Reference">
              <input
                type="text"
                value={operationForm.title}
                onChange={(e) =>
                  setOperationForm({
                    ...operationForm,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
  
            <Field label="Customer / Staff Name">
              <input
                type="text"
                value={operationForm.customer}
                onChange={(e) =>
                  setOperationForm({
                    ...operationForm,
                    customer: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Unit Price">
  <input
    type="number"
    value={operationForm.unitPrice}
    onChange={(e) =>
      setOperationForm({
        ...operationForm,
        unitPrice: e.target.value,
      })
    }
    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
  />
</Field>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Amount">
                <input
                  type="number"
                  value={operationForm.amount}
                  onChange={(e) =>
                    setOperationForm({
                      ...operationForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </Field>
              
  
              <Field label="Due Date">
                <input
                  type="date"
                  value={operationForm.dueDate}
                  onChange={(e) =>
                    setOperationForm({
                      ...operationForm,
                      dueDate: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                />
              </Field>
            </div>
  
            <Field label="Item Details">
              <textarea
                rows={4}
                value={operationForm.itemDetails}
                onChange={(e) =>
                  setOperationForm({
                    ...operationForm,
                    itemDetails: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
  
            {operationForm.type === "Staff Service Charge" && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Service Amount">
                    <input
                      type="number"
                      value={operationForm.serviceAmount}
                      onChange={(e) =>
                        setOperationForm({
                          ...operationForm,
                          serviceAmount: e.target.value,
                        })
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                  </Field>
  
                  <Field label="Staff Share %">
                    <input
                      type="number"
                      value={operationForm.staffShare}
                      onChange={(e) => {
                        const serviceAmount = Number(operationForm.serviceAmount || 0);
                        const share = Number(e.target.value || 0);
  
                        const finalAmount =
                          serviceAmount * (share / 100);
  
                        setOperationForm({
                          ...operationForm,
                          staffShare: e.target.value,
                          finalServiceCharge: finalAmount,
                        })
                      }}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                    />
                  </Field>
  
                  <Field label="Final Service Charge">
                    <input
                      type="text"
                      disabled
                      value={formatCurrency(operationForm.finalServiceCharge || 0)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3"
                    />
                  </Field>
                </div>
              </div>
            )}
  
            <Field label="Notes">
              <textarea
                rows={4}
                value={operationForm.notes}
                onChange={(e) =>
                  setOperationForm({
                    ...operationForm,
                    notes: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>
  
            <div className="flex flex-wrap gap-3">
            <AppButton
  disabled={!isLoggedIn}
  className={`${
    !isLoggedIn
      ? "opacity-50 cursor-not-allowed "
      : ""
  }${
    operationSaveStatus === "saved"
      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
      : ""
  }`}
  onClick={async() => {
    setOperationSaveStatus("saving");
    if (!isLoggedIn) return;
    let updatedOrders;
  
           if (operationForm.id) {
              // EDIT EXISTING
              updatedOrders = operationOrders.map((doc) =>
                doc.id === operationForm.id
             ? {
              ...operationForm,
              updatedAt: new Date().toLocaleString(),
            }
          : doc
      );
    } else {
      // CREATE NEW
      const newDoc = {
        id: Date.now(),
        type: operationForm.type,
        title: operationForm.title,
        customer: operationForm.customer || operationForm.title || "",
        amount: operationForm.amount,
        dueDate: operationForm.dueDate,
        notes: operationForm.notes,
        status: operationForm.status,
        createdAt: new Date().toLocaleString("sv-SE", {
          timeZone: "Asia/Bangkok",
        }).replace(" ", "T"),
      };
      updatedOrders = [newDoc, ...operationOrders];
    }
  
    setOperationOrders(updatedOrders);
  
    persistAll({
      operationOrders: updatedOrders,
    });
    
    await pushAllToSheets(
      {
        items,
        logs,
        users,
        sales,
        operationOrders: updatedOrders,
      },

      { action: "SAVE_OPERATION_ORDER" }
    );
    setOperationForm({
      type: "Customer Invoice",
      title: "",
      amount: "",
      dueDate: "",
      notes: "",
      customer: "",
      status: "Pending",
      itemDetails: "",
      quantity: 1,
      unitPrice: "",
      discount: 0,
      paymentMethod: "Cash",
      serviceAmount: "",
      staffShare: "",
      deductions: "",
      finalServiceCharge: 0,
    });

    setOperationSaveStatus("saved");
  
    setTimeout(() => {
      setOperationSaveStatus("idle");
    }, 400);
  }}
  
>
{operationSaveStatus === "saving"
  ? "Saving..."
  : operationSaveStatus === "saved"
  ? "Saved ✓"
  : "Save Document"}
</AppButton>
  
              <AppButton
              disabled={!["admin", "superadmin"].includes(currentRole)}
                variant="outline"
                onClick={() => printOperationDocument(operationForm)}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
              </AppButton>
            </div>
          </div>
        </div>
  
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">
              Operation Documents & Monthly Dues
            </h2>
          </div>
  
          <div className="space-y-4 max-h-[850px] overflow-y-auto pr-2">
  
            {operationOrders.length === 0 && (
              <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">
                No operation records yet.
              </div>
            )}
  
            {operationOrders
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((doc) => {
                const dueStatus = getDueStatus(doc.dueDate, doc.status);
                const styles = getDueStyles(dueStatus);
  
                return (
                  <div
                    key={doc.id}
                    className="rounded-3xl border border-slate-200 p-5"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">

<div>
  <h3 className="text-2xl font-bold text-slate-900">
    {doc.type}
  </h3>

  <p className="mt-1 text-slate-500">
    {doc.reference}
  </p>
</div>

<div className="flex items-center gap-2">

<span
  className={`rounded-full px-3 py-1 text-xs font-semibold ${
    styles.label === "Active"
      ? "bg-emerald-100 text-emerald-700"
      : styles.badge
  }`}
>
  {styles.label}
</span>

{["admin", "superadmin"].includes(currentRole) && (
    <button
      onClick={() => {
        const confirmed = window.confirm(
          "Delete this document?"
        );

        if (!confirmed) return;

        const updated = operationOrders.filter(
          (x) => x.id !== doc.id
        );

        setOperationOrders(updated);

        persistAll({
          operationOrders: updated,
        });
      }}
      className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
    >
      Delete
    </button>
  )}

</div>

</div>
  
                    <div className="mb-3 space-y-1 text-sm text-slate-600">
                      <p>
                        <strong>Customer / Staff:</strong> {doc.customer}
                      </p>
  
                      <p>
                        <strong>Amount:</strong> {formatCurrency(doc.amount || 0)}
                      </p>
  
                      <p>
                        <strong>Due:</strong> {doc.dueDate || "N/A"}
                      </p>
                    </div>
  
                    <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full ${styles.bar}`} style={{ width: "100%" }} />
                    </div>
  
                    <div className="flex flex-wrap gap-2">
                    <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setDocumentViewModal(doc);
  }}
  className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
>
  View
</button>
  
                      <AppButton
                      disabled={!["admin", "superadmin"].includes(currentRole)}
                        variant="outline"
                        onClick={() => printOperationDocument(doc)}
                      >
                        Print
                      </AppButton>

                    <AppButton
                      disabled={!["admin", "superadmin"].includes(currentRole)}
                        variant="outline"
                        onClick={() => {
                        setOperationForm(doc);
                        setDocumentViewModal(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                       }}
                      >
                      Edit
                    </AppButton>
                      {![
                    "Customer Invoice",
                    "Job Order",
                    "Factory Job Order Sheet",
                    ].includes(doc.type) && (
                      <AppButton
                      variant="outline"
                      disabled={!["admin", "superadmin"].includes(currentRole)}
                      onClick={() => {
                        if (!["admin", "superadmin"].includes(currentRole)) return;
                       const updated = operationOrders.map((x) =>
                       x.id === doc.id
                      ? {
                       ...x,
                       status: "Paid",
                       }
                         : x
                         );

                        setOperationOrders(updated);

                        persistAll({
                       operationOrders: updated,
                      });
                      pushAllToSheets(
                        {
                          items,
                          logs,
                          users,
                          sales,
                          operationOrders: updated,
                        },
                        { action: "UPDATE_OPERATION_STATUS" }
                      );
                       }}
                       
                       className={!["admin", "superadmin"].includes(currentRole) ? "opacity-50 cursor-not-allowed" : ""}
                      >
                      Mark Paid
                      </AppButton>
                      )}
                      {currentRole === "admin, superadmin" 
                      && doc.status === "Paid" && (
                        <AppButton
                         variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                        onClick={() => {
                         const confirmed = window.confirm(
                       "Delete this settled document?"
                        );

                        if (!confirmed) return;

                        const updated = operationOrders.filter(
                       (x) => x.id !== doc.id
                       );

                       setOperationOrders(updated);

                       persistAll({
                       operationOrders: updated,
                       });
                      }}
                     >
                     Delete
                    </AppButton>
                    )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
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

            <Field label="Account Password">
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

            <Field label="Size">
              <input
                value={itemForm.size}
                onChange={(e) => setItemForm((prev) => ({ ...prev, size: e.target.value }))}
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

            <Field label="Variant">
              <input
                value={itemForm.variant}
                onChange={(e) => setItemForm((prev) => ({ ...prev, variant: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Specification">
              <input
                value={itemForm.specification}
                onChange={(e) => setItemForm((prev) => ({ ...prev, specification: e.target.value }))}
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

            <AppButton
  type="submit"
  className="h-12 w-full"
>
  {isUpdating ? "Updating..." : "Update Item"}
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={() => setQrModalItem(null)}
>
        <div
          ref={qrDownloadRef}
          
  className="relative w-full max-w-[480px] rounded-[24px] bg-white p-4 shadow-2xl"
  onClick={(e) => e.stopPropagation()}
>
        
        
          <h2 className="text-[24px] font-semibold text-slate-900">
            QR Code — {qrModalItem.id}
          </h2>
  
          <p className="mt-1 text-lg text-slate-400">
            Scan to view full item details
          </p>
  
          <div className="mt-4 flex justify-center">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <QRCodeSVG 
              id="qr-download-svg"
              value={window.location.origin + window.location.pathname + "#item=" + encodeURIComponent(qrModalItem.id) + "&view=details"} 
              size={120} />
              
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
    );
  };

  const hasUsers = users.some(
      (u) => !u.isDeleted && u.username && u.password
    );

  return (
    <div className="min-h-screen bg-[#f8f8fb] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[330px_1fr]">
      <div className={`fixed left-0 top-0 z-40 h-full w-[330px] overflow-y-auto bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  {/* HEADER */}
<div className="border-b border-slate-200 px-6 py-7">
  <div className="flex items-start justify-between gap-4">

    {/* LEFT SIDE */}
    <div className="flex items-start gap-4 flex-1 min-w-0">

      <img
        src={imsLogo}
        alt="IMS Logo"
        className="h-14 w-14 object-contain rounded-2xl shrink-0"
      />

      <div className="flex-1 min-w-0">
      <p className="text-3xl sm:text-[34px] font-semibold leading-tight">
          Inventory Management System
        </p>

        <p className="mt-2 text-xl text-slate-500">
          Digital IMS
        </p>
      </div>
    </div>

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setMobileMenuOpen(false)}
      className="shrink-0 rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
    >
      <X className="h-6 w-6" />
    </button>
  </div>
</div>

  
{/* USER INFO - hidden until an account is logged in */}
{isLoggedIn && (
  <div className="px-6 pt-5">
    <div className="rounded-2xl bg-slate-100 p-4 transition-all duration-100 hover:bg-slate-50">
      <p className="text-xs text-slate-500">Current User</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="font-medium text-slate-900 break-words">
          {currentUser?.name || "User"}
        </p>
        <UserRoleBadge role={currentRole} />
      </div>
    </div>
  </div>
)}

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
    <div className="rounded-3xl border border-slate-200 p-2">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
          {currentUser?.name?.[0] || "A"}
        </div>
        <div>
          <p className="text-base font-semibold">
            {isLoggedIn ? currentUser?.name || "User" : "SmartIMS"}
          </p>
          <p className="text-sm text-slate-500">
            {isLoggedIn ? currentUser?.email || "Account active" : "Inventory Management System"}
          </p>
        </div>
      </div>
    </div>
    </div>

    <div className="mt-4 pb-6">
      {isLoggedIn ? (
        <button
          type="button"
          onClick={handleLogout}
          className="ml-8 flex w-[160px] items-center justify-center rounded-2xl border border-rose-200 px-4 py-4 text-rose-600 hover:bg-rose-100"
        >
          Log Out
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMobileMenuOpen(false);
            setTimeout(() => {
              setLoginOpen(true);
            }, 150);
          }}
          className="ml-8 flex w-[160px] items-center justify-center rounded-2xl bg-violet-600 px-4 py-4 text-sm text-white"
        >
          Admin Access
        </button>
      )}
    </div>

    {/* SETTINGS BUTTON */}
    
    <div className="settings-container mt-2">
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="ml-8 flex w-[160px] items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left text-slate-600 hover:bg-slate-100"
      >
        <span className="flex items-center gap-3">
          <Settings className="h-5 w-5" />
          Settings
        </span>
        <ChevronRight className="h-4 w-4" />
      </button>
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
                    <Package className="h-14 w-14 text-slate-400" />
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
  
              <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex h-[190px] w-[190px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <QRCodeSVG
                  value={window.location.origin + window.location.pathname + "#item=" + encodeURIComponent(selectedItem.id) + "&view=details"}
                  size={120}
                  />
                 <p className="mt-2 text-xs text-slate-600">
                </p>
              </div>
             </div>
                
  
              {permissions.canViewLogs && (
                 <div className="mt-4">
                  <h4 className="text-xl font-semibold text-slate-900">
                    Restock History</h4>

                    <div className="max-h-[380px] overflow-y-auto">
                    {itemLogs.length === 0 && (
                      <p className="text-sm text-slate-500">No history yet.</p>
                    )}
                    {itemLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="rounded-2xl border border-slate-200 p-4 mb-3">
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
                  <option key={u.id} value={u.username || u.email}>
                  {u.name}
                </option>
                ))}
              </select>
            </Field>
            <Field label="Password">
              <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" placeholder="Enter password" />
            </Field>
            {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
            <AppButton type="submit" className="h-12 w-full">Admin Access</AppButton>
            <button type="button" onClick={() => { setLoginOpen(false); setCurrentPage("Dashboard"); }} className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Continue in View-Only Mode
            </button>
          </div>
        </form>
      )}
    </div>
  )}

{qrModalItem && renderQrModal()}
{itemFormOpen && renderItemForm()}

{settingsOpen && (
  <div className="settings-container fixed inset-0 z-[999] bg-white">
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 p-4 sm:p-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
          <p className="text-sm text-slate-500">Manage user, sync, currency, account access and back up restore.</p>
        </div>
        <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-xl p-3 text-slate-500 hover:bg-slate-100">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3 sm:px-6">
        {["user", "sync", "currency", "signup", "backup"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSettingsTab(tab)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold capitalize ${settingsTab === tab ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}
          >
            {tab === "signup"
              ? "Create Staff Account"
              : tab === "backup"
              ? "Backup&Restore"
              : tab}
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
              <SummaryCard label="Access" value={isLoggedIn ? "Editing enabled based on role" : "View only"} />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {isLoggedIn ? <AppButton variant="outline" onClick={handleLogout}>Log Out</AppButton> : <AppButton onClick={() => setLoginOpen(true)}>Admin Access</AppButton>}
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
                  disabled={!isLoggedIn || !["admin", "superadmin"].includes(currentRole)}
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
            <h3 className="text-xl font-semibold text-slate-900">Create Staff Account</h3>
            <p className="mt-1 text-sm text-slate-500">Only Admin can create staff accounts. Staff can later change their own password from the user settings workflow.</p>
            {(!isLoggedIn || !["admin", "superadmin"].includes(currentRole)) && activeUsers.length > 0 ? (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">Please log in as Admin first.</div>
            ) : (
              <form onSubmit={saveUser} className="mt-5 space-y-4">
                <Field label="Staff Name"><input value={userForm.name} onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="Username"><input value={userForm.username || userForm.email} onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                <Field label="Role"><select value={userForm.role || "staff"}onChange={(e) =>setUserForm((prev) => ({...prev,role: e.target.value,}))}className="w-full rounded-2xl border border-slate-200 px-4 py-3">{roles[currentRole]?.canCreateAdminAccount && (<option value="admin">Admin</option>)}
                 <option value="staff">Staff</option>
                  <option value="warehouse">Warehouse</option>
                 </select>
                  </Field>
                <Field label="Temporary Password"><input type="password" value={userForm.password} onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none" /></Field>
                {loginError && <p className="text-sm text-rose-600">{loginError}</p>}
                <AppButton type="submit" className={`h-12 w-full ${userSaveStatus === "saved" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}`} disabled={userSaveStatus === "saving"}>
                  <UserCog className="mr-2 h-4 w-4" />{userSaveStatus === "saving" ? "Saving..." : userSaveStatus === "saved" ? "Saved ✓" : activeUsers.length === 0 ? "Create First Admin" : "Create Staff Account"}
                </AppButton>
              </form>
            )}
          </div>
        )}

          {settingsTab === "backup" && (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-2xl font-semibold text-slate-900">
              Backup & Restore
            </h3>

            <button
             type="button"
             disabled={!["admin", "superadmin"].includes(currentRole)}
            onClick={() => {
              if (!["admin", "superadmin"].includes(currentRole)) return;
            handleBackupData();
            }}
            className={`rounded-2xl px-5 py-3 font-semibold text-white ${
              !["admin", "superadmin"].includes(currentRole)
            ? "bg-violet-300 cursor-not-allowed opacity-50"
            : "bg-violet-600"
                  }`}
            >
            Backup Data
            </button>

            <button
              type="button"
              disabled={!["admin", "superadmin"].includes(currentRole)}
              onClick={() => {
                if (!["admin", "superadmin"].includes(currentRole)) return;

              document
              .getElementById("restoreBackupInput")
              .click();
                }}
              className={`rounded-2xl px-5 py-3 font-semibold text-white ${
                !["admin", "superadmin"].includes(currentRole)
                ? "bg-slate-400 cursor-not-allowed opacity-50"
                : "bg-slate-700"
                  }`}
                  >
                 Restore Backup
                </button>

              <input
                type="file"
                accept=".json"
                id="restoreBackupInput"
                className="hidden"
                onChange={handleRestoreData}
              />
            </div>
        )}
      </div>
   </div>
</div>
)}

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
          : "Create a staff account. Admin controls role and access from the Users page."}
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
            {activeUsers.filter((u) => u.active !== false).length === 0 ? "Admin" : "Staff"}
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
{documentViewModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
      
      <div className="mb-6 flex items-start justify-between border-b-4 border-blue-600 pb-5">
        <div>
          <h1 className="text-4xl font-bold text-blue-700">
            {documentViewModal.type === "Customer Invoice"
              ? "INVOICE"
              : documentViewModal.type}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {documentViewModal.reference || `DOC-${documentViewModal.id}`}
          </p>
        </div>

        <div className="text-right text-sm text-slate-600">
          <h2 className="text-lg font-bold text-slate-900">
            {companyInfo.name}
          </h2>
          <p>{companyInfo.address}</p>
          <p>{companyInfo.phone}</p>
          <p>{companyInfo.email}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-2 font-bold text-blue-700">Bill To</h3>
          <p className="font-semibold text-slate-900">
            {documentViewModal.customer || "-"}
          </p>
          <p className="text-sm text-slate-500">
            {documentViewModal.notes || ""}
          </p>
        </div>

        <div className="text-sm md:text-right">
          <p>
            <strong>Invoice No:</strong>{" "}
            {documentViewModal.reference || `DOC-${documentViewModal.id}`}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {documentViewModal.createdAt || "-"}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {documentViewModal.dueDate || "-"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {documentViewModal.status || "Pending"}
          </p>
        </div>
      </div>

      <table className="mb-6 w-full border-collapse text-sm">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-blue-600 px-3 py-2 text-left">Item</th>
            <th className="border border-blue-600 px-3 py-2 text-left">Description</th>
            <th className="border border-blue-600 px-3 py-2 text-center">Qty</th>
            <th className="border border-blue-600 px-3 py-2 text-right">Rate</th>
            <th className="border border-blue-600 px-3 py-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border px-3 py-2">
              {documentViewModal.title || "-"}
            </td>
            <td className="border px-3 py-2">
              {documentViewModal.itemDetails || "-"}
            </td>
            <td className="border px-3 py-2 text-center">
              {documentViewModal.quantity || 1}
            </td>
            <td className="border px-3 py-2 text-right">
              {formatCurrency(documentViewModal.unitPrice || documentViewModal.amount || 0)}
            </td>
            <td className="border px-3 py-2 text-right">
              {formatCurrency(documentViewModal.amount || 0)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-8 flex justify-end">
  <div className="w-full md:w-[380px] ml-auto space-y-2 text-sm text-right">


    {documentViewModal.type === "Staff Service Charge" ? (
      <>
        <div className="flex justify-between gap-8">
          <span>Service Amount</span>
          <strong>
            {formatCurrency(documentViewModal.serviceAmount || 0)}
          </strong>
        </div>

        <div className="flex justify-between gap-8">
          <span>Staff Share %</span>
          <strong>
            {documentViewModal.staffShare || 0}%
          </strong>
        </div>

        <div className="flex justify-between gap-8">
          <span>Deductions</span>
          <strong>
            {formatCurrency(documentViewModal.deductions || 0)}
          </strong>
        </div>

        <div className="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Final Service Charge</span>

          <span>
            {formatCurrency(
              documentViewModal.finalServiceCharge || 0
            )}
          </span>
        </div>
      </>
    ) : (
      <>
        <div className="flex justify-between gap-8">
          <span>Subtotal</span>
          <strong>
            {formatCurrency(documentViewModal.amount || 0)}
          </strong>
        </div>

        <div className="flex justify-between gap-8">
          <span>Discount</span>
          <strong>
            {formatCurrency(documentViewModal.discount || 0)}
          </strong>
        </div>

        <div className="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Total</span>

          <span>
            {formatCurrency(
              Number(documentViewModal.amount || 0) -
              Number(documentViewModal.discount || 0)
            )}
          </span>
        </div>
      </>
    )}

  </div>
</div>

      <div className="mt-10 flex justify-end">
        <div className="w-64 text-center">
          <div className="mb-2 border-t border-slate-700"></div>
          <p className="text-sm font-semibold">Authorized Signature</p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-blue-50 p-4 text-center text-sm font-medium text-blue-700">
        Thank you for your business!
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        
      <AppButton
        variant="outline"
        disabled={!["admin", "superadmin"].includes(currentRole)}
        onClick={() => {
          if (!["admin", "superadmin"].includes(currentRole)) return;
        printOperationDocument(documentViewModal);
        }}
        className={
          !["admin", "superadmin"].includes(currentRole)
        ? "opacity-50 cursor-not-allowed"
          : ""
        }
        >
        Print
        </AppButton>

        <AppButton onClick={() => setDocumentViewModal(null)}>
          Close
        </AppButton>
      </div>
    </div>
  </div>
)}
</div>
)}