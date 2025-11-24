import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  LayoutDashboard, 
  Sun, 
  CheckCircle, 
  Circle, 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Moon, 
  Trophy, 
  ListTodo,
  Menu,
  Search,
  RotateCcw,
  X,
  GripVertical,
  Plus,
  Save,
  Clock as ClockIcon,
  Trash2,
  Edit2,
  AlertCircle,
  Check,
  Loader2,
  Calendar,
  Tag,
  FileText,
  MoreVertical,
  Play,
  Pause,
  Download,
  Upload,
  Headphones,
  BarChart3,
  Timer,
  Settings,
  Globe,
  Youtube,
  Copy,
  Code,
  Sigma,
  AlertTriangle
} from "lucide-react";

// --- DATA STRUCTURES ---

type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

type Task = {
  id: string;
  text: string;
  initialChecked?: boolean;
  dueDate?: string; // ISO Date String
  notes?: string;
  tags?: string[];
  subtasks?: Subtask[];
  priority?: 'low' | 'medium' | 'high';
};

type Unit = {
  title: string;
  tasks: Task[];
};

type Exam = {
  id: string;
  title: string; // e.g., "Midterm 1"
  date: string;  // ISO Date-Time String (YYYY-MM-DDTHH:mm)
};

type Course = {
  id: string;
  code: string;
  title: string;
  color: string;
  bgGradient: string;
  units: Unit[];
  examDate?: string; // Legacy field
  exams: Exam[];     // New dynamic exam list
};

// --- INITIAL DATA ---
const INITIAL_DATA: Course[] = [
  {
    id: "diff-eq",
    code: "285",
    title: "Differential Equations",
    color: "bg-blue-500",
    bgGradient: "from-blue-500 to-cyan-400",
    exams: [],
    units: [
      {
        title: "1. Basic Definitions (pages 1–2)",
        tasks: [
          { id: "285-1-1", text: "Understand the differential equation concept" },
          { id: "285-1-2", text: "Review independent and dependent variables" },
          { id: "285-1-3", text: "Grasp the goal: finding solutions for the equation" }
        ]
      },
      {
        title: "2. Classification of Differential Equations (pages 2–3)",
        tasks: [
          { id: "285-2-1", text: "Ordinary vs Partial Differential Equations" },
          { id: "285-2-2", text: "Linear vs Nonlinear Differential Equations" },
          { id: "285-2-3", text: "Constant vs Variable coefficients" },
          { id: "285-2-4", text: "Determine the order of a differential equation" }
        ]
      },
      {
        title: "3. Mathematical Modelling (pages 3–5)",
        tasks: [
          { id: "285-3-1", text: "Newton's Law of Cooling formulation" },
          { id: "285-3-2", text: "Torricelli's Law of Draining" },
          { id: "285-3-3", text: "Population models with constant birth/death rates" },
          { id: "285-3-4", text: "Convert physical models into differential equation form" }
        ]
      },
      {
        title: "4. Solution Types & Initial Value Problems (pages 5–8)",
        tasks: [
          { id: "285-4-1", text: "Distinguish between general and particular solutions" },
          { id: "285-4-2", text: "Study initial value problem (IVP) steps" },
          { id: "285-4-3", text: "Learn existence and uniqueness theorem for DEs" },
          { id: "285-4-4", text: "Understand solution pattern for 1st order IVP" }
        ]
      },
      {
        title: "5. Slope Fields and Isoclines (pages 8–9)",
        tasks: [
          { id: "285-5-1", text: "Visualize solution behavior with slope fields" },
          { id: "285-5-2", text: "Understand isoclines concept" },
          { id: "285-5-3", text: "Study solution curves through slope fields" }
        ]
      },
      {
        title: "6. First Order Differential Equations (pages 9–23)",
        tasks: [
          { id: "285-6-1", text: "Separable equations: structure and solution algorithm" },
          { id: "285-6-2", text: "Linear equations: integrating factor method" },
          { id: "285-6-3", text: "Homogeneous equations: substitution y=vx" },
          { id: "285-6-4", text: "Bernoulli equations: reduction process, transformation" },
          { id: "285-6-5", text: "Exact equations: test for exactness, general solution form" }
        ]
      },
      {
        title: "7. Substitution Methods (pages 15–17)",
        tasks: [
          { id: "285-7-1", text: "Master substitution techniques for nonseparable cases" },
          { id: "285-7-2", text: "Practice variable changes for simplification" }
        ]
      },
      {
        title: "8. Numerical Methods (pages 24–31)",
        tasks: [
          { id: "285-8-1", text: "Euler Method: Explore basic Euler steps for IVP approximation" },
          { id: "285-8-2", text: "Euler Method: Calculate error estimation for Euler solutions" },
          { id: "285-8-3", text: "Improved Euler (Heun's) Method: Learn two-slope prediction-correction formula" },
          { id: "285-8-4", text: "Improved Euler: Implement stepwise table for result comparison" },
          { id: "285-8-5", text: "Taylor Series Method: Apply Taylor series expansion for numerical solution" },
          { id: "285-8-6", text: "Taylor Series Method: Understand truncation error and order concept" },
          { id: "285-8-7", text: "Runge-Kutta (4th order): Study formula and algorithm" },
          { id: "285-8-8", text: "Runge-Kutta: Compare RK accuracy with Euler and Taylor methods" }
        ]
      },
      {
        title: "9. Second and Higher Order Equations (pages 32–38)",
        tasks: [
          { id: "285-9-1", text: "Classification: Homogeneous vs Nonhomogeneous" },
          { id: "285-9-2", text: "Distinct Real Roots: Solve characteristic equation" },
          { id: "285-9-3", text: "Repeated Real Roots: Handle repeated roots and general solutions" },
          { id: "285-9-4", text: "Complex Conjugate Roots: Solve using Euler's formula" },
          { id: "285-9-5", text: "Linearly independent solution construction" },
          { id: "285-9-6", text: "Compute the Wronskian for independence checking" }
        ]
      },
      {
        title: "10. Methods for Nonhomogeneous Equations (pages 38–52)",
        tasks: [
          { id: "285-10-1", text: "Undetermined Coefficients: Polynomial forcing terms" },
          { id: "285-10-2", text: "Undetermined Coefficients: Exponential forcing terms" },
          { id: "285-10-3", text: "Undetermined Coefficients: Trigonometric forcing terms" },
          { id: "285-10-4", text: "Variation of Parameters: General solution construction" },
          { id: "285-10-5", text: "Inverse Operators: Process for particular solution finding" }
        ]
      },
      {
        title: "11. Laplace Transform Applications (pages 53–62)",
        tasks: [
          { id: "285-11-1", text: "Laplace transform definition and properties" },
          { id: "285-11-2", text: "Study common Laplace transform pairs" },
          { id: "285-11-3", text: "Usage in IVP solving" },
          { id: "285-11-4", text: "Convolution theorem" },
          { id: "285-11-5", text: "Inverse Laplace transformation steps" }
        ]
      },
      {
        title: "12. RLC Circuit Modeling (pages 70–71)",
        tasks: [
          { id: "285-12-1", text: "Formulate RLC circuit equations with DEs" },
          { id: "285-12-2", text: "Voltage-current-capacitance relationships" },
          { id: "285-12-3", text: "Apply DE solution methods to find circuit behavior" }
        ]
      },
      {
        title: "13. Boundary Value Problems (BVP) (pages 71–72)",
        tasks: [
          { id: "285-13-1", text: "Difference between IVP and BVP" },
          { id: "285-13-2", text: "Analyze solution existence and multiplicity" },
          { id: "285-13-3", text: "Study boundary condition types" }
        ]
      },
      {
        title: "14. Eigenvalues and Eigenfunctions",
        tasks: [
          { id: "285-14-1", text: "Setup and solve eigenvalue problems" },
          { id: "285-14-2", text: "Find corresponding eigenfunctions for BVP" }
        ]
      }
    ]
  },
  {
    id: "logical-design",
    code: "241",
    title: "Logical Design",
    color: "bg-indigo-500",
    bgGradient: "from-indigo-500 to-purple-500",
    exams: [],
    units: [
      {
        title: "1. Birim: Temel Kavramlar ve Sayı Sistemleri (Syf 1-47)",
        tasks: [
          { id: "241-1-1", text: "Dersin hedeflerini ve içeriğini gözden geçir.", initialChecked: true },
          { id: "241-1-2", text: "Dijital ve Analog sistemler arasındaki farkları öğren.", initialChecked: true },
          { id: "241-1-3", text: "Dijitalleştirme (ADC/DAC) kavramlarını anla.", initialChecked: true },
          { id: "241-1-4", text: "İkili (binary) sistemin voltajla temsilini öğren.", initialChecked: true },
          { id: "241-1-5", text: "Ağırlıklı (konumsal) sayı sistemlerinin mantığını kavra.", initialChecked: true },
          { id: "241-1-6", text: "Radix, MSD, LSD ve kesirli sayı gösterimlerini öğren.", initialChecked: true },
          { id: "241-1-7", text: "İkili (Binary - Taban-2) sistemi çalış.", initialChecked: true },
          { id: "241-1-8", text: "Sekizli (Octal - Taban-8) sistemi çalış.", initialChecked: true },
          { id: "241-1-9", text: "Onaltılı (Hexadecimal - Taban-16) sistemi çalış.", initialChecked: true },
          { id: "241-1-10", text: "2^n tablosu ve r^n - 1 gibi özellikleri öğren.", initialChecked: true },
          { id: "241-1-11", text: "Farklı tabanlardan onluk tabana dönüşüm yap.", initialChecked: true }
        ]
      },
      {
        title: "2. Birim: Taban Dönüşümleri ve İkili Aritmetik (Syf 48-77)",
        tasks: [
          { id: "241-2-1", text: "Ondalık tamsayıların diğer tabanlara dönüşümü (bölme)", initialChecked: true },
          { id: "241-2-2", text: "Ondalık kesirli sayıların diğer tabanlara dönüşümü (çarpma)", initialChecked: true },
          { id: "241-2-3", text: "İkili -> Sekizli (3-bit gruplama)", initialChecked: true },
          { id: "241-2-4", text: "İkili -> Onaltılı (4-bit gruplama)", initialChecked: true },
          { id: "241-2-5", text: "Onaltılı <-> Sekizli arası dönüşümler", initialChecked: true },
          { id: "241-2-6", text: "Genel taban dönüşüm metodu", initialChecked: true },
          { id: "241-2-7", text: "İkili (Binary) toplama işlemi", initialChecked: true },
          { id: "241-2-8", text: "İkili (Binary) çıkarma ve borç kavramı", initialChecked: true },
          { id: "241-2-9", text: "İkili (Binary) çarpma işlemi", initialChecked: true },
          { id: "241-2-10", text: "Onaltılı (Hex) toplama işlemi", initialChecked: true },
          { id: "241-2-11", text: "Sekizli (Octal) çarpma işlemi", initialChecked: true }
        ]
      },
      {
        title: "3. Birim: İşaretli Sayılar ve İkili Kodlar (Syf 78-145)",
        tasks: [
          { id: "241-3-1", text: "Register ve İşaretli/İşaretsiz sayıları öğren", initialChecked: true },
          { id: "241-3-2", text: "İşaret-Büyüklük (Signed-Magnitude) gösterimi", initialChecked: true },
          { id: "241-3-3", text: "Tümleyen (Complement) mantığı", initialChecked: true },
          { id: "241-3-4", text: "1'e Tümleyen (1's Complement) aritmetiği", initialChecked: true },
          { id: "241-3-5", text: "2'ye Tümleyen (2's Complement) aritmetiği", initialChecked: true },
          { id: "241-3-6", text: "2'ye tümleyen kullanarak çıkarma işlemi", initialChecked: true },
          { id: "241-3-7", text: "İşaretli sayılarda Taşma (Overflow) tespiti", initialChecked: true },
          { id: "241-3-8", text: "Aritmetik Kaydırma (Arithmetic Shift)", initialChecked: true },
          { id: "241-3-9", text: "9'a ve 10'a tümleyen kavramları", initialChecked: true },
          { id: "241-3-10", text: "BCD (Binary Coded Decimal) kodu", initialChecked: true },
          { id: "241-3-11", text: "BCD Toplaması ve geçersiz kod düzeltme", initialChecked: true },
          { id: "241-3-12", text: "Gray Kodu yapısı", initialChecked: true },
          { id: "241-3-13", text: "ASCII Karakter Kodu", initialChecked: true },
          { id: "241-3-14", text: "Hata Tespit Kodu (Parity Bit)", initialChecked: true }
        ]
      },
      {
        title: "4. Birim: Boolean Cebiri ve Mantık Kapıları (Syf 146-179)",
        tasks: [
          { id: "241-4-1", text: "Temel mantık kapıları (AND, OR, NOT)", initialChecked: true },
          { id: "241-4-2", text: "Boolean Cebiri postulatları", initialChecked: true },
          { id: "241-4-3", text: "Operatör öncelik sırası", initialChecked: true },
          { id: "241-4-4", text: "İkilik (Duality) Prensibi", initialChecked: true },
          { id: "241-4-5", text: "Yutma (Absorption) kuralı", initialChecked: true },
          { id: "241-4-6", text: "DeMorgan Teoremi", initialChecked: true },
          { id: "241-4-7", text: "Boolean ifadelerini sadeleştirme", initialChecked: true },
          { id: "241-4-8", text: "Bir fonksiyonun Tümleyenini alma", initialChecked: true }
        ]
      },
      {
        title: "5. Birim: Kombinasyonel Mantık Tasarımı (Syf 180-210)",
        tasks: [
          { id: "241-5-1", text: "Minterm ve Maxterm kavramları", initialChecked: true },
          { id: "241-5-2", text: "Minterm ve Maxterm arası ilişki", initialChecked: true },
          { id: "241-5-3", text: "Doğruluk tablosundan Minterm Toplamı (SOP)", initialChecked: true },
          { id: "241-5-4", text: "Doğruluk tablosundan Maxterm Çarpımı (POS)", initialChecked: true },
          { id: "241-5-5", text: "Kanonik ve Standart formlar", initialChecked: true },
          { id: "241-5-6", text: "SOP ve POS formları arasında dönüşüm", initialChecked: true },
          { id: "241-5-7", text: "SOP formunu iki seviyeli devre olarak çizme", initialChecked: true },
          { id: "241-5-8", text: "POS formunu iki seviyeli devre olarak çizme", initialChecked: true },
          { id: "241-5-9", text: "Yayılma Gecikmesi kavramı", initialChecked: true },
          { id: "241-5-10", text: "Üç Durumlu (Tri-State) Kapılar", initialChecked: true }
        ]
      },
      {
        title: "6. Birim: Diğer Kapılar ve Karnaugh Haritaları (Syf 211-274)",
        tasks: [
          { id: "241-6-1", text: "NAND ve NOR Evrensel Kapıları", initialChecked: true },
          { id: "241-6-2", text: "Diğer kapıları sadece NAND ile çizme", initialChecked: true },
          { id: "241-6-3", text: "Diğer kapıları sadece NOR ile çizme", initialChecked: true },
          { id: "241-6-4", text: "XOR ve XNOR kapıları", initialChecked: true },
          { id: "241-6-5", text: "Çoklu girişli kapıların mantığı", initialChecked: true },
          { id: "241-6-6", text: "Karnaugh Haritası temelleri", initialChecked: true },
          { id: "241-6-7", text: "2 ve 3 Değişkenli K-Map", initialChecked: true },
          { id: "241-6-8", text: "4 Değişkenli K-Map ve komşuluklar", initialChecked: true },
          { id: "241-6-9", text: "1'leri gruplama kuralları", initialChecked: true },
          { id: "241-6-10", text: "Don't Cares (Umursanmayan) durumlar", initialChecked: true },
          { id: "241-6-11", text: "PI ve EPI tanımları ve Minimum SOP bulma", initialChecked: true },
          { id: "241-6-12", text: "5-Değişkenli K-Map", initialChecked: true },
          { id: "241-6-13", text: "Minimum POS bulma (0'ları gruplama)", initialChecked: true }
        ]
      },
      {
        title: "7. Birim: Kombinasyonel Devre Analizi ve Tasarımı (Syf 321-336)",
        tasks: [
          { id: "241-7-1", text: "Kombinasyonel devrelerin tanımını ve analiz yöntemlerini öğren." },
          { id: "241-7-2", text: "Verilen bir lojik devrenin analizini yapmayı öğren." },
          { id: "241-7-3", text: "Tasarım prosedürünü (Problem -> Tablo -> Sadeleştirme -> Devre) kavra." },
          { id: "241-7-4", text: "BCD'den 3-Fazlalık koduna dönüştürücü devresini incele." },
          { id: "241-7-5", text: "Yedi Segmentli Gösterge için doğruluk tablosu oluşturmayı öğren." }
        ]
      },
      {
        title: "8. Birim: Aritmetik Devreler (Syf 337-362)",
        tasks: [
          { id: "241-8-1", text: "Yarım Toplayıcı (Half Adder) devresi ve denklemleri" },
          { id: "241-8-2", text: "Tam Toplayıcı (Full Adder) devresi ve yapısı" },
          { id: "241-8-3", text: "Paralel Toplayıcı ve elde yayılma gecikmesi" },
          { id: "241-8-4", text: "Elde Öngörülü Toplayıcı (Carry Look-ahead)" },
          { id: "241-8-5", text: "BCD Toplayıcı tasarımı" },
          { id: "241-8-6", text: "İkili Çıkarıcı devresi (2'ye tümleyen ile)" },
          { id: "241-8-7", text: "Toplayıcı/Çıkarıcı Birleşik Devre" },
          { id: "241-8-8", text: "Taşma (Overflow) tespiti" }
        ]
      },
      {
        title: "9. Birim: MSI Bileşenleri (Syf 363-388)",
        tasks: [
          { id: "241-9-1", text: "İkili Çarpıcı (Binary Multiplier) mantığı" },
          { id: "241-9-2", text: "Büyüklük Karşılaştırıcı (Comparator) devresi" },
          { id: "241-9-3", text: "Kod Çözücü (Decoder) yapısı" },
          { id: "241-9-4", text: "Kod Çözücü Genişletme ve Enable girişi" },
          { id: "241-9-5", text: "Decoder ve OR kapıları ile devre tasarımı" },
          { id: "241-9-6", text: "Kodlayıcı (Encoder) ve Öncelikli Kodlayıcı" }
        ]
      },
      {
        title: "10. Birim: Çoklayıcılar (MUX) (Syf 389-418)",
        tasks: [
          { id: "241-10-1", text: "Çoklayıcı (MUX) yapısı ve seçme hatları" },
          { id: "241-10-2", text: "MUX iç yapısını çizmeyi öğren" },
          { id: "241-10-3", text: "Dörtlü (Quad) 2-to-1 MUX" },
          { id: "241-10-4", text: "Boolean fonksiyonlarını MUX ile gerçekleme" },
          { id: "241-10-5", text: "Azlayıcı (DeMultiplexer) yapısı" },
          { id: "241-10-6", text: "Üç Durumlu tamponlar ve Yüksek Empedans" }
        ]
      },
      {
        title: "11. Birim: HDL - Verilog (Syf 419-432)",
        tasks: [
          { id: "241-11-1", text: "HDL kavramı ve modül yapısı" },
          { id: "241-11-2", text: "Kapı Seviyesi (Gate-Level) modelleme" },
          { id: "241-11-3", text: "Tasarım metodolojileri (Top-down, Bottom-up)" },
          { id: "241-11-4", text: "Üç durumlu kapıların Verilog modellemesi" },
          { id: "241-11-5", text: "Veri Akışı (Dataflow) modellemesi (assign)" },
          { id: "241-11-6", text: "Davranışsal (Behavioral) modelleme (always)" },
          { id: "241-11-7", text: "Test Bench oluşturma" }
        ]
      }
    ]
  },
  {
    id: "probability",
    code: "283",
    title: "Probability",
    color: "bg-emerald-500",
    bgGradient: "from-emerald-500 to-teal-500",
    exams: [],
    units: [
      {
        title: "Modül 1: Olasılığın Temelleri (Ders 1-2)",
        tasks: [
          { id: "283-1-1", text: "Olasılığın kullanım alanlarını anlama", initialChecked: true },
          { id: "283-1-2", text: "Küme Teorisi: Temel kavramlar", initialChecked: true },
          { id: "283-1-3", text: "Küme Operasyonları (Birleşim, Kesişim...)", initialChecked: true },
          { id: "283-1-4", text: "Venn Diyagramları", initialChecked: true },
          { id: "283-1-5", text: "De Morgan ve Dağılma Yasaları", initialChecked: true },
          { id: "283-1-6", text: "Rastgele Deney ve Olay kavramları", initialChecked: true },
          { id: "283-1-7", text: "Olasılığın Aksiyomları", initialChecked: true },
          { id: "283-1-8", text: "Olasılığın Temel Özellikleri", initialChecked: true },
          { id: "283-1-9", text: "Klasik Olasılık Tanımı", initialChecked: true },
          { id: "283-1-10", text: "Koşullu Olasılık Tanımı", initialChecked: true },
          { id: "283-1-11", text: "Çarpma Kuralı", initialChecked: true },
          { id: "283-1-12", text: "Toplam Olasılık Teoremi", initialChecked: true },
          { id: "283-1-13", text: "Bayes Kuralı", initialChecked: true },
          { id: "283-1-14", text: "Bağımsız Olaylar", initialChecked: true }
        ]
      },
      {
        title: "Modül 2: Rastgele Değişkenler ve Dağılımlar (Ders 3-4)",
        tasks: [
          { id: "283-2-1", text: "Problem Saati: Schaum's Problemleri" },
          { id: "283-2-2", text: "ÖDEV: Schaum's Chapter 1 çözümleri" },
          { id: "283-2-3", text: "Rastgele Değişkenler (RV) Tanımı" },
          { id: "283-2-4", text: "Ayrık vs Sürekli RV" },
          { id: "283-2-5", text: "Kümülatif Dağılım Fonksiyonu (CDF)" },
          { id: "283-2-6", text: "Olasılık Kütle Fonksiyonu (PMF)" },
          { id: "283-2-7", text: "PMF ve CDF ilişkisi" }
        ]
      }
    ]
  },
  {
    id: "circuit-analysis",
    code: "201",
    title: "Circuit Analysis",
    color: "bg-orange-500",
    bgGradient: "from-orange-500 to-amber-500",
    exams: [],
    units: [
      {
        title: "Bölüm 1: Temeller ve Devre Yasaları",
        tasks: [
          { id: "201-1-1", text: "İdeal Temel Devre Elemanları" },
          { id: "201-1-2", text: "Bağımsız ve Bağımlı Kaynaklar & Güç Dengesi" },
          { id: "201-1-3", text: "Ohm Yasası, KVL ve KCL" },
          { id: "201-1-4", text: "Seri/Paralel Dirençler ve Eşdeğer Direnç" }
        ]
      }
    ]
  },
  {
    id: "signals",
    code: "S301",
    title: "Signals and Systems",
    color: "bg-red-500",
    bgGradient: "from-red-500 to-pink-600",
    exams: [],
    units: [
      {
        title: "1. Introduction and Classification of Signals (pages 4–8)",
        tasks: [
          { id: "301-1-1", text: "Continuous-Time vs. Discrete-Time Signals" },
          { id: "301-1-2", text: "Analog vs. Digital Signals" },
          { id: "301-1-3", text: "Deterministic vs. Random Signals" }
        ]
      }
    ]
  },
  {
    id: "personal",
    code: "KŞSL",
    title: "Kişisel & Teknoloji",
    color: "bg-gray-800 dark:bg-gray-600",
    bgGradient: "from-slate-700 to-slate-900",
    exams: [],
    units: [
      {
        title: "AI & Technology",
        tasks: [
          { id: "p-ai-1", text: "Colab general fundamentals" },
          { id: "p-ai-2", text: "n8n RSS reading" }
        ]
      }
    ]
  }
];

// --- HELPER FUNCTIONS ---

const getCourseProgress = (course: Course, completedTasks: Set<string>) => {
  let total = 0;
  let completed = 0;
  course.units.forEach(unit => {
    unit.tasks.forEach(task => {
      total++;
      if (completedTasks.has(task.id)) completed++;
    });
  });
  return total === 0 ? 0 : Math.round((completed / total) * 100);
};

const getNextTask = (course: Course, completedTasks: Set<string>) => {
  for (const unit of course.units) {
    for (const task of unit.tasks) {
      if (!completedTasks.has(task.id)) return { unit: unit.title, task: task };
    }
  }
  return null;
};

// Markdown Generator
const generateMarkdown = (course: Course, completedTasks: Set<string>) => {
  let md = `# ${course.title} (${course.code})\n\n`;
  course.units.forEach(unit => {
    md += `## ${unit.title}\n`;
    unit.tasks.forEach(task => {
      const isDone = completedTasks.has(task.id);
      md += `- [${isDone ? 'x' : ' '}] ${task.text}\n`;
      if(task.notes) md += `  > ${task.notes.replace(/\n/g, '\n  > ')}\n`;
    });
    md += '\n';
  });
  return md;
};

const generateDailyMarkdown = (courses: Course[], completedTasks: Set<string>, history: Record<string, string>) => {
  const today = new Date().toISOString().split('T')[0];
  let md = `# Günlük Log: ${today}\n\n`;
  
  courses.forEach(course => {
     const completedToday = course.units.flatMap(u => u.tasks).filter(t => {
        const historyDate = history[t.id];
        return historyDate && historyDate.startsWith(today);
     });

     if (completedToday.length > 0) {
        md += `### ${course.title}\n`;
        completedToday.forEach(t => {
           md += `- [x] ${t.text}\n`;
        });
        md += '\n';
     }
  });
  return md;
}

// Web Audio API White Noise Generator
const toggleWhiteNoise = (ctx: AudioContext | null, isPlaying: boolean): AudioContext | null => {
  if (isPlaying && ctx) {
    ctx.close();
    return null;
  }
  
  if (!isPlaying) {
    const newCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = 2 * newCtx.sampleRate;
    const noiseBuffer = newCtx.createBuffer(1, bufferSize, newCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Brown Noise (Lower frequency, like a waterfall)
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for gain loss
    }

    const noise = newCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    const gainNode = newCtx.createGain();
    gainNode.gain.value = 0.15; // Low volume
    
    noise.connect(gainNode);
    gainNode.connect(newCtx.destination);
    noise.start();
    return newCtx;
  }
  return null;
};

// --- COMPONENTS ---

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a beep or notification here
      if(mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 w-full">
       <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
         <Timer size={14} />
         {mode === 'work' ? 'Odaklan' : 'Mola'}
       </div>
       <div className={`text-4xl font-mono font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
         {formatTime(timeLeft)}
       </div>
       <div className="flex gap-2 w-full">
         <button onClick={toggleTimer} className={`flex-1 py-1 rounded text-sm font-medium transition-colors ${isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}>
           {isActive ? 'Duraklat' : 'Başlat'}
         </button>
         <button onClick={resetTimer} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
           <RotateCcw size={16} />
         </button>
       </div>
    </div>
  );
};

const AmbientSoundPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const toggleSound = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    audioCtxRef.current = toggleWhiteNoise(audioCtxRef.current, isPlaying);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-xl text-white shadow-lg w-full flex items-center justify-between">
       <div className="flex items-center gap-3">
         <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
           <Headphones size={20} />
         </div>
         <div>
           <p className="text-sm font-bold">Odak Sesi</p>
           <p className="text-xs text-indigo-100 opacity-80">Doğal Gürültü</p>
         </div>
       </div>
       <button 
         onClick={toggleSound}
         className="p-3 bg-white text-indigo-600 rounded-full hover:scale-110 transition-transform shadow-md"
       >
         {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
       </button>
    </div>
  );
};

const TaskDetailModal = ({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate 
}: { 
  task: Task | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onUpdate: (updatedTask: Task) => void;
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!isOpen || !editedTask) return null;

  const handleSave = () => {
    onUpdate(editedTask);
    onClose();
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const sub = { id: Date.now().toString(), text: newSubtask, completed: false };
      setEditedTask({
        ...editedTask,
        subtasks: [...(editedTask.subtasks || []), sub]
      });
      setNewSubtask("");
    }
  };

  const toggleSubtask = (subId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks?.map(s => s.id === subId ? { ...s, completed: !s.completed } : s)
    });
  };

  const removeSubtask = (subId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks?.filter(s => s.id !== subId)
    });
  };

  const addTag = () => {
    if (newTag.trim() && !editedTask.tags?.includes(newTag.trim())) {
      setEditedTask({
        ...editedTask,
        tags: [...(editedTask.tags || []), newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags?.filter(t => t !== tag)
    });
  };

  // Quick research handlers
  const searchGoogle = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(editedTask.text)}`, '_blank');
  };

  const searchYoutube = () => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(editedTask.text)}`, '_blank');
  };

  // Simple formatter for preview
  const renderRichText = (text: string) => {
     if(!text) return <p className="text-slate-400 italic">Not yok...</p>;
     
     // Very basic parsing for demo
     // $$math$$ -> Math style
     // `code` -> Code style
     
     const parts = text.split(/(`[^`]+`|\$\$[^$]+\$\$)/g);
     
     return (
       <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
         {parts.map((part, i) => {
            if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={i} className="bg-slate-200 dark:bg-slate-700 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded font-mono text-xs">{part.slice(1, -1)}</code>;
            } else if (part.startsWith('$$') && part.endsWith('$$')) {
              return <span key={i} className="font-serif italic text-lg text-indigo-700 dark:text-indigo-400 px-1">{part.slice(2, -2)}</span>;
            }
            return <span key={i}>{part}</span>;
         })}
       </div>
     )
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Edit2 size={18} className="text-indigo-500" />
            Görev Detayları
          </h2>
          <div className="flex gap-2">
             <button onClick={searchGoogle} className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors" title="Google'da Ara">
                <Globe size={18} />
             </button>
             <button onClick={searchYoutube} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors" title="Youtube'da Ara">
                <Youtube size={18} />
             </button>
             <button onClick={onClose} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500">
               <X size={20} />
             </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Title */}
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Başlık</label>
             <input 
               type="text" 
               value={editedTask.text} 
               onChange={(e) => setEditedTask({...editedTask, text: e.target.value})}
               className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white"
             />
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Calendar size={14} /> Son Tarih
                </label>
                <input 
                  type="date"
                  value={editedTask.dueDate || ""}
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <AlertCircle size={14} /> Öncelik
                </label>
                <select 
                   value={editedTask.priority || 'medium'}
                   onChange={(e) => setEditedTask({...editedTask, priority: e.target.value as any})}
                   className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm dark:text-white"
                >
                   <option value="low">Düşük</option>
                   <option value="medium">Orta</option>
                   <option value="high">Yüksek</option>
                </select>
             </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Tag size={14} /> Etiketler
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTask.tags?.map(tag => (
                <span key={tag} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs rounded-lg flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12}/></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
               <input 
                  type="text" 
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Etiket ekle..."
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
               />
               <button onClick={addTag} className="px-3 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Plus size={16}/></button>
            </div>
          </div>

          {/* Notes (Rich Text) */}
          <div>
            <div className="flex items-center justify-between mb-2">
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                 <FileText size={14} /> Akıllı Notlar
               </label>
               <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                  <button onClick={() => setActiveTab('write')} className={`px-2 py-1 text-xs rounded-md transition-all ${activeTab === 'write' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}>Yaz</button>
                  <button onClick={() => setActiveTab('preview')} className={`px-2 py-1 text-xs rounded-md transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-indigo-300' : 'text-slate-500'}`}>Önizle</button>
               </div>
            </div>
            
            {activeTab === 'write' ? (
              <div className="relative">
                 <textarea 
                    value={editedTask.notes || ""}
                    onChange={(e) => setEditedTask({...editedTask, notes: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl h-32 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none dark:text-white font-mono"
                    placeholder="Notlar... Kod için `kod`, formül için $$E=mc^2$$ kullanın."
                 ></textarea>
                 <div className="absolute bottom-2 right-2 flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-indigo-500" title="Kod Bloğu" onClick={() => setEditedTask({...editedTask, notes: (editedTask.notes || '') + " `kod` "})}><Code size={14} /></button>
                    <button className="p-1 text-slate-400 hover:text-indigo-500" title="Matematik Formülü" onClick={() => setEditedTask({...editedTask, notes: (editedTask.notes || '') + " $$fx$$ "})}><Sigma size={14} /></button>
                 </div>
              </div>
            ) : (
              <div className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl h-32 overflow-y-auto">
                 {renderRichText(editedTask.notes || "")}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ListTodo size={14} /> Alt Görevler
            </label>
            <div className="space-y-2 mb-3">
               {editedTask.subtasks?.map(sub => (
                 <div key={sub.id} className="flex items-center gap-2 group">
                    <button 
                      onClick={() => toggleSubtask(sub.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${sub.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}
                    >
                       {sub.completed && <Check size={12} />}
                    </button>
                    <span className={`flex-1 text-sm ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{sub.text}</span>
                    <button onClick={() => removeSubtask(sub.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500"><X size={14}/></button>
                 </div>
               ))}
            </div>
            <div className="flex gap-2">
               <input 
                  type="text" 
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                  placeholder="Alt görev ekle..."
                  className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
               />
               <button onClick={addSubtask} className="px-3 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"><Plus size={16}/></button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-500 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">İptal</button>
          <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">Kaydet</button>
        </div>
      </div>
    </div>
  );
};

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  onImport,
  onExport,
  onExportToday
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onExportToday: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
       <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Settings className="text-slate-500" /> Ayarlar
            </h3>
            <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
          </div>
          
          <div className="space-y-4">
             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
               <h4 className="font-bold text-indigo-700 dark:text-indigo-400 mb-1">Verileri Yedekle</h4>
               <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 mb-3">Tüm ilerlemeni bir JSON dosyası olarak indir.</p>
               <button 
                 onClick={onExport}
                 className="w-full py-2 bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-indigo-700 transition-colors"
               >
                 <Download size={16} /> Yedeği İndir
               </button>
             </div>

             <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
               <h4 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Markdown Export</h4>
               <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mb-3">Bugün tamamlananları Obsidian/Notion için kopyala.</p>
               <button 
                 onClick={onExportToday}
                 className="w-full py-2 bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-emerald-700 transition-colors"
               >
                 <Copy size={16} /> Panoya Kopyala
               </button>
             </div>

             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
               <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Yedeği Yükle</h4>
               <p className="text-xs text-slate-500 mb-3">Daha önce indirdiğin yedeği geri yükle.</p>
               <label className="w-full py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                 <Upload size={16} /> 
                 Dosya Seç
                 <input type="file" accept=".json" onChange={onImport} className="hidden" />
               </label>
             </div>
          </div>
       </div>
    </div>
  );
};

const HeaderClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col items-end text-slate-500 dark:text-slate-400 hidden md:flex">
      <div className="text-2xl font-bold font-mono text-slate-800 dark:text-white leading-none">
        {time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
      </div>
      <div className="text-xs font-medium uppercase tracking-wider mt-1 opacity-80">
        {time.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage, colorClass, size = 20 }: { percentage: number; colorClass: string; size?: number }) => {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={251.2}
          strokeDashoffset={251.2 - (251.2 * percentage) / 100}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
    </div>
  );
};

const ProgressBar = ({ percentage, colorClass }: { percentage: number; colorClass: string }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
    <div 
      className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const Checkmark = ({ checked }: { checked: boolean }) => {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-300 ${checked ? 'scale-110' : 'scale-100'}`}>
       <div className={`absolute inset-0 rounded-full ${checked ? 'bg-green-200 dark:bg-green-900/50 animate-ping' : ''}`}></div>
       {checked ? (
         <CheckCircle size={24} className="relative z-10 text-green-500 transition-transform duration-300 rotate-0" />
       ) : (
         <Circle size={24} className="relative z-10 text-slate-300 hover:text-indigo-400 transition-colors duration-300" />
       )}
    </div>
  );
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-100 dark:border-slate-700 transform transition-all scale-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
          >
            İptal
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
};

const Overview = ({ 
  courses,
  completedTasks, 
  setActiveView,
  completionHistory 
}: { 
  courses: Course[];
  completedTasks: Set<string>; 
  setActiveView: (view: string) => void;
  completionHistory: Record<string, string>; // taskId -> ISOString
}) => {
  const completedCount = completedTasks.size;
  
  // Calculate Last 7 Days Activity
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => {
     // Count tasks completed on this date
     const count = Object.values(completionHistory).filter(d => d.startsWith(date)).length;
     return { date, count };
  });

  const maxCount = Math.max(...activityData.map(d => d.count), 1); // Avoid div by zero

  // Updated to check both legacy examDate and new exams list
  const getDaysLeft = (course: Course) => {
    const now = new Date().getTime();
    let nearestDate: number | null = null;

    // Check legacy date
    if (course.examDate) {
      const d = new Date(course.examDate).getTime();
      if (d > now) nearestDate = d;
    }

    // Check new exams
    if (course.exams && course.exams.length > 0) {
      course.exams.forEach(ex => {
        const d = new Date(ex.date).getTime();
        if (d > now) {
          if (nearestDate === null || d < nearestDate) {
            nearestDate = d;
          }
        }
      });
    }

    if (nearestDate === null) return null;
    return Math.ceil((nearestDate - now) / (1000 * 3600 * 24));
  };

  return (
    <div className="p-6 space-y-8 animate-fade-in pt-16 md:pt-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Genel Bakış</h1>
        <p className="text-slate-500 dark:text-slate-400">Akademik yolculuğun ve hedeflerin tek bir yerde.</p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{completedCount}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tamamlanan Görev</p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
             <BarChart3 size={20} className="text-indigo-500"/>
             <span className="text-sm font-bold text-slate-500">Son 7 Günlük Aktivite</span>
          </div>
          <div className="flex items-end gap-2 h-12 w-full">
            {activityData.map((d, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div 
                    className="w-full bg-indigo-500/20 dark:bg-indigo-400/20 rounded-t-sm hover:bg-indigo-500 transition-colors"
                    style={{ height: `${(d.count / maxCount) * 100}%` }}
                  ></div>
                  <div className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100">{d.date.slice(5)}</div>
               </div>
            ))}
          </div>
        </div>

        <div 
          onClick={() => setActiveView('daily')}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white flex items-center justify-between group hover:shadow-lg transition-all"
        >
          <div>
            <h3 className="text-xl font-bold mb-1">Bugünü Planla</h3>
            <p className="text-indigo-100 text-sm">Rastgele 5 görev seç</p>
          </div>
          <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
            <Sun size={24} />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Ders İlerlemeleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const progress = getCourseProgress(course, completedTasks);
            const next = getNextTask(course, completedTasks);
            const isComplete = progress === 100;
            const daysLeft = getDaysLeft(course);
            const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

            return (
              <div 
                key={course.id}
                onClick={() => setActiveView(course.id)}
                className={`bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm border ${isUrgent ? 'border-red-400 dark:border-red-600 animate-pulse' : 'border-slate-100 dark:border-slate-700'} hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative`}
              >
                {/* Exam Countdown Badge */}
                {daysLeft !== null && daysLeft >= 0 && (
                   <div className={`absolute top-2 left-2 z-20 px-2 py-1 rounded text-xs font-bold shadow-sm ${isUrgent ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700'}`}>
                      {daysLeft === 0 ? 'SINAV BUGÜN' : `${daysLeft} gün kaldı`}
                   </div>
                )}

                <div className={`h-24 ${course.bgGradient} relative p-4`}>
                  <div className="absolute bottom-0 left-0 w-full h-full bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <span className="absolute top-4 right-4 bg-black/20 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                    {course.code}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-8 shadow-black drop-shadow-md">{course.title}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">İlerleme</span>
                    <span className={`text-lg font-bold ${isComplete ? 'text-green-500' : 'text-slate-800 dark:text-white'}`}>
                      %{progress}
                    </span>
                  </div>
                  <ProgressBar 
                    percentage={progress} 
                    colorClass={isComplete ? 'bg-green-500' : course.color.replace('bg-', 'bg-')} 
                  />
                  
                  {next ? (
                    <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50 mt-auto">
                      <p className="text-xs text-slate-400 uppercase font-bold mb-1">Sıradaki Görev</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{next.task.text}</p>
                    </div>
                  ) : (
                    <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30 mt-auto flex items-center gap-2">
                      <Trophy size={16} className="text-green-500" />
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Tamamlandı!</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DailyPlan = ({ 
  courses,
  completedTasks, 
  toggleTask 
}: { 
  courses: Course[];
  completedTasks: Set<string>; 
  toggleTask: (id: string) => void; 
}) => {
  // Sort tasks by due date or priority before selecting
  const planTasks = courses.map(course => {
    // Find first incomplete task
    let next: any = null;
    for (const unit of course.units) {
        for (const task of unit.tasks) {
            if (!completedTasks.has(task.id)) {
                // Check if this task is high priority or overdue
                if (task.dueDate && new Date(task.dueDate) < new Date()) {
                   return { ...task, course, unit: unit.title, isOverdue: true };
                }
                if (!next) next = { ...task, course, unit: unit.title };
            }
        }
    }
    return next;
  }).filter(Boolean);

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in pt-16 md:pt-6">
       <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-500 rounded-full mb-4">
            <Sun size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Günün Odak Planı</h1>
          <p className="text-slate-500 dark:text-slate-400">Öncelikli ve süresi yaklaşan görevlerin derlendi.</p>
       </div>

       <div className="space-y-4">
          {planTasks.length > 0 ? planTasks.map((item: any) => (
            <div 
              key={item.id}
              className={`group flex items-start gap-4 p-5 bg-white dark:bg-dark-surface rounded-xl shadow-sm border ${item.isOverdue ? 'border-red-300 dark:border-red-800' : 'border-slate-100 dark:border-slate-700'} transition-all hover:shadow-md`}
            >
              <div className={`w-1.5 self-stretch rounded-full ${item.course.color}`}></div>
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.course.title}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-400 truncate">{item.unit}</span>
                    {item.isOverdue && (
                        <span className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded-full dark:bg-red-900/30">
                            <AlertCircle size={10} /> Gecikmiş
                        </span>
                    )}
                 </div>
                 <p className={`text-lg ${completedTasks.has(item.id) ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.text}
                 </p>
                 {item.dueDate && (
                     <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                         <Calendar size={12} /> {new Date(item.dueDate).toLocaleDateString()}
                     </p>
                 )}
              </div>
              <button 
                onClick={() => toggleTask(item.id)}
                className="mt-1 p-1 rounded-full transition-colors"
              >
                <Checkmark checked={completedTasks.has(item.id)} />
              </button>
            </div>
          )) : (
            <div className="text-center p-10 bg-white dark:bg-dark-surface rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Trophy size={48} className="mx-auto text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Tüm görevler tamamlandı!</h3>
              <p className="text-slate-500">Harika iş çıkardın, şimdi dinlenme zamanı.</p>
            </div>
          )}
       </div>
    </div>
  );
};

const SearchResults = ({
  query,
  courses,
  completedTasks,
  toggleTask
}: {
  query: string;
  courses: Course[];
  completedTasks: Set<string>;
  toggleTask: (id: string) => void;
}) => {
  const lowerQuery = query.toLowerCase();
  
  const results = courses.reduce((acc: any[], course) => {
    const matchingTasks: any[] = [];
    course.units.forEach(unit => {
      unit.tasks.forEach(task => {
        if (task.text.toLowerCase().includes(lowerQuery) || task.tags?.some(t => t.toLowerCase().includes(lowerQuery))) {
          matchingTasks.push({ task, unit: unit.title });
        }
      });
    });
    
    if (matchingTasks.length > 0) {
      acc.push({ course, matchingTasks });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fade-in pt-16 md:pt-6">
      <div className="text-center mb-8">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 rounded-full mb-4">
           <Search size={32} />
         </div>
         <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Arama Sonuçları</h1>
         <p className="text-slate-500 dark:text-slate-400">"{query}" için bulunan görevler</p>
      </div>

      <div className="space-y-8">
        {results.length > 0 ? results.map(({ course, matchingTasks }: any) => (
          <div key={course.id} className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${course.color}`}></div>
              {course.title}
            </h2>
            <div className="space-y-2">
              {matchingTasks.map(({ task, unit }: any) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700/50 cursor-pointer transition-all"
                >
                   <div className="mt-0.5">
                     <Checkmark checked={completedTasks.has(task.id)} />
                   </div>
                   <div>
                     <p className={`text-sm ${completedTasks.has(task.id) ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700 dark:text-slate-200'}`}>
                       {task.text}
                     </p>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{unit}</span>
                        {task.tags?.map((t: string) => (
                           <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">{t}</span>
                        ))}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )) : (
          <div className="text-center p-12 bg-white dark:bg-dark-surface rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500">Eşleşen görev bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseDetail = ({ 
  course, 
  completedTasks, 
  toggleTask,
  updateCourse,
  updateCourseMeta,
  addTask,
  onOpenTaskDetails
}: { 
  course: Course; 
  completedTasks: Set<string>; 
  toggleTask: (id: string) => void;
  updateCourse: (courseId: string, units: Unit[]) => void;
  updateCourseMeta: (courseId: string, meta: Partial<Course>) => void;
  addTask: (courseId: string, text: string) => void;
  onOpenTaskDetails: (task: Task) => void;
}) => {
  const [openUnits, setOpenUnits] = useState<Set<number>>(new Set([0]));
  const [newTaskText, setNewTaskText] = useState("");
  
  // Local state for drag and drop reordering & editing
  const [localUnits, setLocalUnits] = useState<Unit[]>(course.units);
  
  // Drag and Drop State
  const [dragSource, setDragSource] = useState<{unitIdx: number, taskIdx: number} | null>(null);
  const [dragTarget, setDragTarget] = useState<{unitIdx: number, taskIdx: number} | null>(null);

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation State
  const [deleteModalData, setDeleteModalData] = useState<{unitIdx: number, taskIdx: number} | null>(null);

  // Exam Management State
  const [showExamManager, setShowExamManager] = useState(false);
  const [newExamLabel, setNewExamLabel] = useState("");
  const [newExamDate, setNewExamDate] = useState("");

  // Sync local units if course changes externally, but only if not dirty to avoid overwriting local changes
  useEffect(() => {
    if (!isDirty) {
      setLocalUnits(course.units);
    }
  }, [course.units, isDirty]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingTaskId]);

  // Auto-Save Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (isDirty) {
        handleSave();
      }
    }, 30000); // 30 seconds auto-save

    return () => clearInterval(timer);
  }, [isDirty, localUnits]);

  const progress = getCourseProgress(course, completedTasks);

  const toggleUnit = (idx: number) => {
    const newSet = new Set(openUnits);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setOpenUnits(newSet);
  };

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = (e: React.DragEvent, unitIdx: number, taskIdx: number) => {
    setDragSource({ unitIdx, taskIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDragEnter = (e: React.DragEvent, unitIdx: number, taskIdx: number) => {
    if (dragSource && dragSource.unitIdx === unitIdx) {
       setDragTarget({ unitIdx, taskIdx });
    }
  };

  const handleDrop = (e: React.DragEvent, targetUnitIdx: number, targetTaskIdx: number) => {
    e.preventDefault();
    
    // Ensure we are dropping in the same unit
    if (dragSource && dragSource.unitIdx === targetUnitIdx) {
        // Only reorder if indices are different
        if (dragSource.taskIdx !== targetTaskIdx) {
           const newUnits = [...localUnits];
           const tasks = [...newUnits[dragSource.unitIdx].tasks];
           
           // Remove from old index
           const [movedTask] = tasks.splice(dragSource.taskIdx, 1);
           // Insert at new index
           tasks.splice(targetTaskIdx, 0, movedTask);
           
           newUnits[dragSource.unitIdx].tasks = tasks;
           setLocalUnits(newUnits);
           setIsDirty(true);
        }
    }
    
    // Reset Drag State
    setDragSource(null);
    setDragTarget(null);
  };

  const handleDragEnd = () => {
     setDragSource(null);
     setDragTarget(null);
  };

  // --- ACTION HANDLERS ---

  const handleSave = () => {
    setIsSaving(true);
    updateCourse(course.id, localUnits);
    setIsDirty(false);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      addTask(course.id, newTaskText);
      setNewTaskText("");
      const newOpen = new Set(openUnits);
      newOpen.add(localUnits.length - 1);
      setOpenUnits(newOpen);
      
      setIsDirty(false);
    }
  };

  // Inline Editing
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const saveEditing = (unitIdx: number, taskIdx: number) => {
    if (editingTaskId) {
      const newUnits = [...localUnits];
      newUnits[unitIdx].tasks[taskIdx].text = editingText;
      setLocalUnits(newUnits);
      setIsDirty(true);
      setEditingTaskId(null);
    }
  };

  // Deletion
  const promptDelete = (unitIdx: number, taskIdx: number) => {
    setDeleteModalData({ unitIdx, taskIdx });
  };

  const confirmDelete = () => {
    if (deleteModalData) {
      const { unitIdx, taskIdx } = deleteModalData;
      const newUnits = [...localUnits];
      newUnits[unitIdx].tasks.splice(taskIdx, 1);
      setLocalUnits(newUnits);
      setIsDirty(true);
      setDeleteModalData(null);
    }
  };

  // Features
  const copySyllabus = () => {
    const md = generateMarkdown(course, completedTasks);
    navigator.clipboard.writeText(md);
    alert('Syllabus panoya kopyalandı (Markdown)');
  };

  // --- EXAM MANAGEMENT ---
  
  const handleAddExam = () => {
    if (!newExamLabel || !newExamDate) {
      alert("Lütfen sınav adı ve tarihi giriniz.");
      return;
    }
    
    const newExam: Exam = {
      id: Date.now().toString(),
      title: newExamLabel,
      date: newExamDate
    };

    const updatedExams = [...(course.exams || []), newExam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    updateCourseMeta(course.id, { exams: updatedExams });
    setNewExamLabel("");
    setNewExamDate("");
  };

  const handleDeleteExam = (examId: string) => {
    if (confirm("Bu sınavı silmek istediğinize emin misiniz?")) {
       const updatedExams = (course.exams || []).filter(e => e.id !== examId);
       updateCourseMeta(course.id, { exams: updatedExams });
    }
  };

  // Calculate days until next exam
  const getNextExamDisplay = () => {
     const now = new Date().getTime();
     if (!course.exams || course.exams.length === 0) return null;
     
     // Find first future exam
     const nextExam = course.exams.find(e => new Date(e.date).getTime() > now);
     
     if (!nextExam) return null;
     
     const days = Math.ceil((new Date(nextExam.date).getTime() - now) / (1000 * 3600 * 24));
     return { days, title: nextExam.title };
  };

  const nextExamInfo = getNextExamDisplay();

  return (
    <div className="animate-fade-in pb-20">
      <ConfirmationModal 
        isOpen={!!deleteModalData}
        onClose={() => setDeleteModalData(null)}
        onConfirm={confirmDelete}
        title="Görevi Sil"
        message="Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />

      {/* Hero Header */}
      <div className={`relative ${course.bgGradient} p-6 md:p-10 overflow-hidden`}>
         <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10 blur-3xl"></div>
         <div className="relative z-10 w-full flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                  {course.code}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white shadow-black drop-shadow-lg">{course.title}</h1>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-colors ${isDirty ? 'bg-amber-500/80 text-white' : isSaving ? 'bg-indigo-500/80 text-white' : 'bg-white/20 text-white'}`}>
                   {isSaving ? (
                     <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Kaydediliyor...</span>
                   ) : isDirty ? (
                     <span className="flex items-center gap-1">Kaydedilmedi</span>
                   ) : (
                     <span className="flex items-center gap-1"><Check size={12}/> Kaydedildi</span>
                   )}
                 </div>
                 
                 <button 
                  onClick={copySyllabus}
                  className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-md transition-colors"
                 >
                   <Copy size={12} /> Syllabus Kopyala
                 </button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-end justify-between gap-4">
              
              {/* Dynamic Exam Manager Button */}
              <div className="flex gap-3">
                <button 
                   onClick={() => setShowExamManager(!showExamManager)}
                   className="bg-white/10 backdrop-blur-md hover:bg-white/20 p-3 rounded-xl border border-white/20 flex items-center gap-3 text-white transition-colors"
                >
                    <ClockIcon size={20} />
                    <div className="text-left">
                       <p className="text-xs opacity-70 font-bold uppercase">Sınav Takvimi</p>
                       <p className="font-bold text-sm">
                         {nextExamInfo ? `${nextExamInfo.days} Gün Kaldı` : "Sınav Ekle"}
                       </p>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${showExamManager ? 'rotate-180' : ''}`} />
                </button>
                
                {nextExamInfo && nextExamInfo.days <= 3 && (
                   <div className="px-3 py-1 rounded-lg bg-red-500 text-white animate-pulse flex flex-col items-center justify-center shadow-lg">
                      <span className="text-[10px] uppercase font-bold text-red-100">Acil</span>
                      <span className="text-sm font-bold leading-none">{nextExamInfo.title}</span>
                   </div>
                 )}
              </div>

              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                  <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">İlerleme</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">%{progress}</p>
                  </div>
                  <CircularProgress percentage={progress} colorClass={course.color.replace('bg-', 'text-')} size={40} />
               </div>
            </div>

            {/* Exam Manager Panel */}
            {showExamManager && (
               <div className="bg-white dark:bg-dark-surface rounded-xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 animate-fade-in mt-2">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-white mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Sınav Listesi</h3>
                  <div className="space-y-2 mb-4">
                     {course.exams && course.exams.length > 0 ? course.exams.map(exam => (
                        <div key={exam.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                           <div>
                              <p className="text-sm font-bold text-slate-800 dark:text-white">{exam.title}</p>
                              <p className="text-xs text-slate-500">{new Date(exam.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short'})}</p>
                           </div>
                           <button onClick={() => handleDeleteExam(exam.id)} className="p-1 text-red-400 hover:text-red-600"><X size={16}/></button>
                        </div>
                     )) : (
                        <p className="text-xs text-slate-400 italic">Henüz sınav eklenmedi.</p>
                     )}
                  </div>
                  <div className="flex gap-2 items-end">
                     <div className="flex-1">
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Sınav Adı</label>
                        <input 
                           type="text" 
                           value={newExamLabel}
                           onChange={(e) => setNewExamLabel(e.target.value)}
                           placeholder="Örn: Vize 1"
                           className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                        />
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Tarih ve Saat</label>
                        <input 
                           type="datetime-local"
                           value={newExamDate}
                           onChange={(e) => setNewExamDate(e.target.value)}
                           className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-xs"
                        />
                     </div>
                     <button 
                        onClick={handleAddExam}
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                     >
                        <Plus size={16} />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto space-y-4 -mt-6 relative z-20">
         {localUnits.map((unit, unitIdx) => {
            const unitCompleted = unit.tasks.filter(t => completedTasks.has(t.id)).length;
            const isAllDone = unitCompleted === unit.tasks.length && unit.tasks.length > 0;
            const isOpen = openUnits.has(unitIdx);

            return (
              <div 
                key={unitIdx} 
                className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group/unit-header"
                >
                  <div className="flex items-center gap-3 flex-1" onClick={() => toggleUnit(unitIdx)}>
                    <div className={`p-2 rounded-lg ${isAllDone ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300'}`}>
                      {isAllDone ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                    </div>
                    <h3 className={`font-medium select-none ${isAllDone ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                      {unit.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 pl-4" onClick={() => toggleUnit(unitIdx)}>
                    <span className="text-xs text-slate-400 font-medium">
                      {unitCompleted} / {unit.tasks.length}
                    </span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
                  </div>
                </div>

                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-black/20">
                      {unit.tasks.map((task, taskIdx) => (
                        <div 
                          key={task.id}
                          draggable={editingTaskId !== task.id}
                          onDragStart={(e) => handleDragStart(e, unitIdx, taskIdx)}
                          onDragOver={handleDragOver}
                          onDragEnter={(e) => handleDragEnter(e, unitIdx, taskIdx)}
                          onDrop={(e) => handleDrop(e, unitIdx, taskIdx)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center gap-3 p-4 pl-6 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-white dark:hover:bg-slate-800 transition-colors group relative ${dragTarget?.taskIdx === taskIdx && dragTarget.unitIdx === unitIdx ? 'border-t-2 border-t-indigo-500' : ''} ${dragSource?.taskIdx === taskIdx && dragSource.unitIdx === unitIdx ? 'opacity-50 bg-slate-100 dark:bg-slate-800' : ''}`}
                        >
                          <div className="text-slate-300 dark:text-slate-600 cursor-grab hover:text-slate-500 active:cursor-grabbing">
                             <GripVertical size={16} />
                          </div>
                          <div 
                            onClick={() => toggleTask(task.id)}
                            className="cursor-pointer shrink-0"
                          >
                             <Checkmark checked={completedTasks.has(task.id)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             {editingTaskId === task.id ? (
                               <input 
                                 ref={editInputRef}
                                 type="text" 
                                 value={editingText}
                                 onChange={(e) => setEditingText(e.target.value)}
                                 onBlur={() => saveEditing(unitIdx, taskIdx)}
                                 onKeyDown={(e) => e.key === 'Enter' && saveEditing(unitIdx, taskIdx)}
                                 className="w-full px-2 py-1 bg-white dark:bg-slate-700 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                               />
                             ) : (
                               <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <p 
                                        onClick={() => startEditing(task)}
                                        className={`text-sm cursor-text truncate transition-all relative ${
                                          completedTasks.has(task.id) 
                                            ? 'text-slate-400' 
                                            : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                      {task.text}
                                      <span className={`absolute left-0 top-1/2 h-0.5 bg-slate-400 dark:bg-slate-500 transition-all duration-500 ease-in-out ${completedTasks.has(task.id) ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></span>
                                    </p>
                                    
                                    {/* Quick Research Button */}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`https://www.google.com/search?q=${encodeURIComponent(task.text)}`, '_blank');
                                      }}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-blue-500 transition-all"
                                      title="Google'da Hızlı Ara"
                                    >
                                      <Globe size={12} />
                                    </button>

                                    {task.dueDate && (
                                      <span className={`text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded ${new Date(task.dueDate) < new Date() ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                         <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                                      </span>
                                    )}
                                    {task.tags?.map(t => (
                                      <span key={t} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded hidden md:inline-block">{t}</span>
                                    ))}
                                  </div>
                                  {task.subtasks && task.subtasks.length > 0 && (
                                     <div className="flex items-center gap-2 mt-1">
                                        <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                                           <div className="h-full bg-green-400" style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400">{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
                                     </div>
                                  )}
                               </div>
                             )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                              <button 
                                onClick={() => onOpenTaskDetails(task)}
                                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                title="Detaylar & Notlar"
                              >
                                <MoreVertical size={16} />
                              </button>
                              <button 
                                onClick={() => promptDelete(unitIdx, taskIdx)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Görevi Sil"
                              >
                                <Trash2 size={16} />
                              </button>
                          </div>
                        </div>
                      ))}
                      {unit.tasks.length === 0 && (
                        <p className="p-4 text-center text-sm text-slate-400 italic">Bu ünitede henüz görev yok.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
         })}

         {/* New Task Input */}
         <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mt-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Yeni Görev Ekle (Son Üniteye)</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Görev tanımı..."
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button 
                onClick={handleAddTask}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Plus size={18} />
                Ekle
              </button>
            </div>
         </div>
      </div>

      {/* Floating Save Button */}
      {isDirty && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:scale-100"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin"/> : <Save size={20} />}
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  // State
  const [courses, setCourses] = useState<Course[]>(() => {
    // Attempt to load full course data structure from localstorage first
    try {
        const storedCourses = localStorage.getItem('planner_data_v2');
        if (storedCourses) {
            return JSON.parse(storedCourses);
        }
    } catch (e) {}
    return INITIAL_DATA;
  });

  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    INITIAL_DATA.forEach(course => 
      course.units.forEach(unit => 
        unit.tasks.forEach(task => {
          if(task.initialChecked) initial.add(task.id);
        })
      )
    );
    try {
      const stored = localStorage.getItem('planner_completed');
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (e) {}
    return initial;
  });

  // History Log for Stats (TaskId -> ISOString of completion)
  const [completionHistory, setCompletionHistory] = useState<Record<string, string>>(() => {
     try {
         const stored = localStorage.getItem('planner_history');
         return stored ? JSON.parse(stored) : {};
     } catch(e) { return {}; }
  });

  // History for Undo
  const [history, setHistory] = useState<Set<string>[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<'overview' | 'daily' | string>('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Task Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Effects
  useEffect(() => {
    localStorage.setItem('planner_completed', JSON.stringify(Array.from(completedTasks)));
    localStorage.setItem('planner_history', JSON.stringify(completionHistory));
  }, [completedTasks, completionHistory]);

  useEffect(() => {
      // Autosave courses to support custom courses/edits persistence
      localStorage.setItem('planner_data_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Helpers
  const toggleTask = (taskId: string) => {
    const currentSet = completedTasks;
    setHistory(prev => {
      const newHist = [...prev, currentSet];
      if (newHist.length > 20) return newHist.slice(1);
      return newHist;
    });

    const newSet = new Set(currentSet);
    const newHistory = { ...completionHistory };

    if (newSet.has(taskId)) {
        newSet.delete(taskId);
        delete newHistory[taskId]; // Remove from stats if uncompleted
    } else {
        newSet.add(taskId);
        newHistory[taskId] = new Date().toISOString(); // Add timestamp
    }
    
    setCompletedTasks(newSet);
    setCompletionHistory(newHistory);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setCompletedTasks(previous);
    setHistory(prev => prev.slice(0, -1));
  };

  const updateCourse = (courseId: string, newUnits: Unit[]) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, units: newUnits };
      }
      return c;
    }));
  };

  const updateCourseMeta = (courseId: string, meta: Partial<Course>) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return { ...c, ...meta };
      }
      return c;
    }));
  };

  const addTaskToCourse = (courseId: string, text: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const newUnits = [...c.units];
        if (newUnits.length > 0) {
          const lastUnitIdx = newUnits.length - 1;
          const lastUnit = { ...newUnits[lastUnitIdx] };
          const newTask: Task = {
            id: `${courseId}-custom-${Date.now()}`,
            text: text
          };
          lastUnit.tasks = [...lastUnit.tasks, newTask];
          newUnits[lastUnitIdx] = lastUnit;
          return { ...c, units: newUnits };
        }
      }
      return c;
    }));
  };

  // Add new Custom Course
  const createNewCourse = () => {
    const newId = `custom-${Date.now()}`;
    const newCourse: Course = {
        id: newId,
        code: "NEW",
        title: "Yeni Ders",
        color: "bg-pink-500",
        bgGradient: "from-pink-500 to-rose-500",
        exams: [],
        units: [{ title: "Bölüm 1", tasks: [] }]
    };
    setCourses([...courses, newCourse]);
    setActiveView(newId);
  };

  // Update Task Details from Modal
  const handleTaskUpdate = (updatedTask: Task) => {
     setCourses(prev => prev.map(c => ({
        ...c,
        units: c.units.map(u => ({
            ...u,
            tasks: u.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        }))
     })));
  };

  const handleOpenTaskDetails = (task: Task) => {
     setSelectedTask(task);
     setDetailsModalOpen(true);
  };

  // Import/Export Logic
  const handleExportData = () => {
      const data = {
          courses,
          completedTasks: Array.from(completedTasks),
          completionHistory
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planner-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
  };

  const handleExportToday = () => {
      const md = generateDailyMarkdown(courses, completedTasks, completionHistory);
      navigator.clipboard.writeText(md);
      alert('Bugünün günlüğü (Markdown) panoya kopyalandı!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target?.result as string);
              if (data.courses) setCourses(data.courses);
              if (data.completedTasks) setCompletedTasks(new Set(data.completedTasks));
              if (data.completionHistory) setCompletionHistory(data.completionHistory);
              alert("Veriler başarıyla yüklendi!");
              setIsSettingsOpen(false);
          } catch(err) {
              alert("Dosya formatı hatalı.");
          }
      };
      reader.readAsText(file);
  };

  const getTotalProgress = () => {
    let total = 0;
    let completed = 0;
    courses.forEach(c => c.units.forEach(u => u.tasks.forEach(t => {
      total++;
      if(completedTasks.has(t.id)) completed++;
    })));
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 font-inter relative overflow-hidden">
      
      <TaskDetailModal 
         isOpen={detailsModalOpen} 
         onClose={() => setDetailsModalOpen(false)} 
         task={selectedTask}
         onUpdate={handleTaskUpdate}
      />

      <SettingsModal 
         isOpen={isSettingsOpen}
         onClose={() => setIsSettingsOpen(false)}
         onExport={handleExportData}
         onImport={handleImportData}
         onExportToday={handleExportToday}
      />
      
      <HeaderClock />

      {/* Sidebar */}
      <aside className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-72 h-full bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-slate-700 transition-transform duration-300 flex flex-col`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700">
           <div className="flex justify-between items-center mb-1">
             <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Gelişim Asistanı</h1>
             <button onClick={() => setIsSettingsOpen(true)} className="text-slate-400 hover:text-slate-600">
                <Settings size={18} />
             </button>
           </div>
           <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Öğrenci Planlayıcı v2.1</p>

           {/* Search Input */}
           <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text"
               placeholder="Görev veya etiket ara..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
             />
             {searchQuery && (
               <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
               >
                 <X size={14} />
               </button>
             )}
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
           
           {/* Productivity Widgets */}
           <div className="space-y-3">
              <PomodoroTimer />
              <AmbientSoundPlayer />
           </div>

           <div>
              <button 
                onClick={() => { setActiveView('overview'); setSearchQuery(""); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeView === 'overview' && !searchQuery ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <LayoutDashboard size={20} />
                Genel Bakış
              </button>
              <button 
                onClick={() => { setActiveView('daily'); setSearchQuery(""); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl mt-1 transition-colors ${activeView === 'daily' && !searchQuery ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Sun size={20} />
                Günün Odak Planı
              </button>
           </div>

           <div>
              <div className="flex items-center justify-between px-3 mb-2">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dersler</h3>
                 <button onClick={createNewCourse} className="text-indigo-500 hover:text-indigo-700 text-xs flex items-center gap-1">
                    <Plus size={12} /> Yeni
                 </button>
              </div>
              <div className="space-y-1">
                {courses.filter(c => c.id !== 'personal').map(course => {
                  const p = getCourseProgress(course, completedTasks);
                  return (
                    <button
                      key={course.id}
                      onClick={() => { setActiveView(course.id); setSearchQuery(""); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors group ${activeView === course.id && !searchQuery ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full ${course.color}`}></div>
                         <span className="truncate max-w-[120px]">{course.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">{p}%</span>
                    </button>
                  );
                })}
              </div>
           </div>

           <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Kişisel & Hedefler</h3>
              {courses.filter(c => c.id === 'personal').map(course => {
                  const p = getCourseProgress(course, completedTasks);
                  return (
                    <button
                      key={course.id}
                      onClick={() => { setActiveView(course.id); setSearchQuery(""); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors ${activeView === course.id && !searchQuery ? 'bg-slate-800 text-white dark:bg-white dark:text-black' : 'text-slate-700 dark:text-slate-200 hover:border-slate-400'}`}
                    >
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                         <span>{course.title}</span>
                      </div>
                      <span className="text-xs opacity-70">{p}%</span>
                    </button>
                  );
              })}
           </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
             <button 
               onClick={() => setDarkMode(!darkMode)}
               className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             <div className="text-xs text-slate-400">
                {getTotalProgress()}% Tamamlandı
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative h-full w-full custom-scrollbar">
         {/* Mobile Header */}
         <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-dark-surface border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
            <h1 className="font-bold text-indigo-600 dark:text-indigo-400">Gelişim Asistanı</h1>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
         </div>

         <div className="min-h-full pb-20">
            {searchQuery ? (
              <SearchResults 
                query={searchQuery}
                courses={courses}
                completedTasks={completedTasks}
                toggleTask={toggleTask}
              />
            ) : activeView === 'overview' ? (
              <Overview 
                courses={courses}
                completedTasks={completedTasks} 
                setActiveView={setActiveView}
                completionHistory={completionHistory}
              />
            ) : activeView === 'daily' ? (
              <DailyPlan 
                courses={courses}
                completedTasks={completedTasks}
                toggleTask={toggleTask}
              />
            ) : (
              <CourseDetail 
                course={courses.find(c => c.id === activeView)!}
                completedTasks={completedTasks}
                toggleTask={toggleTask}
                updateCourse={updateCourse}
                updateCourseMeta={updateCourseMeta}
                addTask={addTaskToCourse}
                onOpenTaskDetails={handleOpenTaskDetails}
              />
            )}
         </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
