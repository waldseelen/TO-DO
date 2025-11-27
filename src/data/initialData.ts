import { Course } from '@/types';

export const INITIAL_DATA: Course[] = [
    {
        id: "diff-eq",
        code: "285",
        title: "Differential Equations",
        color: "bg-blue-500",
        customColor: "#3b82f6",
        bgGradient: "from-blue-500 to-cyan-400",
        exams: [
            { id: "285-vize2", title: "2. Vize", date: "2025-12-15", time: "15:20" },
            { id: "285-final", title: "Diff Final", date: "2026-01-06", time: "13:30" }
        ],
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
        customColor: "#6366f1",
        bgGradient: "from-indigo-500 to-purple-500",
        exams: [
            { id: "241-vize2", title: "2. Vize", date: "2025-12-19", time: "15:20" },
            { id: "241-final", title: "Final", date: "2026-01-08", time: "13:30" }
        ],
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
        customColor: "#10b981",
        bgGradient: "from-emerald-500 to-teal-500",
        exams: [
            { id: "283-vize2", title: "2. Vize", date: "2025-12-09", time: "13:30" },
            { id: "283-final", title: "Prob Final", date: "2026-01-05", time: "10:00" }
        ],
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
                    { id: "283-2-7", text: "PMF ve CDF ilişkisi" },
                    { id: "283-2-8", text: "Definition: A function that assigns numerical value to each outcome" },
                    { id: "283-2-9", text: "Defining events from RV: (X=x), (X ≤ x), (x1 < X ≤ x2)" },
                    { id: "283-2-10", text: "CDF Properties (ranges from 0 to 1, non-decreasing, right-continuous)" },
                    { id: "283-2-11", text: "CDF for Discrete RV's (staircase shape)" },
                    { id: "283-2-12", text: "Finding probability using CDF: P(a < X ≤ b) = F_X(b) - F_X(a)" },
                    { id: "283-2-13", text: "PMF Properties (sum of p_X(x_k) = 1)" },
                    { id: "283-2-14", text: "Transition from PMF to CDF: F_X(x) = sum of p_X(x_k)" }
                ]
            },
            {
                title: "Modül 3: Sürekli RV'ler ve Özel Dağılımlar (Ders 5-6)",
                tasks: [
                    { id: "283-3-1", text: "Probability Density Function (PDF) definition" },
                    { id: "283-3-2", text: "PDF Properties: f_X(x) ≥ 0 and integral of f_X(x) dx = 1" },
                    { id: "283-3-3", text: "Probability Calculation: P(a < X ≤ b) = integral from a to b" },
                    { id: "283-3-4", text: "PDF ↔ CDF relationship: F_X(x) = integral and f_X(x) = dF_X(x)/dx" },
                    { id: "283-3-5", text: "Expected Value (Mean) for Discrete: μ_X = sum of x_k p_X(x_k)" },
                    { id: "283-3-6", text: "Expected Value (Mean) for Continuous: μ_X = integral of x f_X(x) dx" },
                    { id: "283-3-7", text: "Variance definition: σ_X² = E[(X - μ_X)²]" },
                    { id: "283-3-8", text: "Variance calculation formula: σ_X² = E[X²] - (E[X])²" },
                    { id: "283-3-9", text: "Standard Deviation: σ_X = sqrt(Var(X))" },
                    { id: "283-3-10", text: "Bernoulli Distribution: PMF, Mean, Variance" },
                    { id: "283-3-11", text: "Binomial Distribution: PMF, Mean, Variance" },
                    { id: "283-3-12", text: "Geometric Distribution: PMF, Mean, Variance" },
                    { id: "283-3-13", text: "Poisson Distribution: PMF, Mean, Variance" },
                    { id: "283-3-14", text: "Uniform Distribution: PDF, CDF, Mean, Variance" },
                    { id: "283-3-15", text: "Exponential Distribution: PDF, CDF, Mean, Variance" },
                    { id: "283-3-16", text: "Normal (Gaussian) Distribution: PDF formula, Standard Normal" }
                ]
            },
            {
                title: "Modül 4: Çoklu Rastgele Değişkenler (Ders 8)",
                tasks: [
                    { id: "283-4-1", text: "Bivariate RV (X, Y) definition" },
                    { id: "283-4-2", text: "Joint CDF: F_XY(x, y) = P(X ≤ x, Y ≤ y)" },
                    { id: "283-4-3", text: "Marginal CDF: F_X(x) = F_XY(x, ∞)" },
                    { id: "283-4-4", text: "Joint PMF: p_XY(x_i, y_j) = P(X = x_i, Y = y_j)" },
                    { id: "283-4-5", text: "Marginal PMF: p_X(x_i) = sum of p_XY(x_i, y_j)" },
                    { id: "283-4-6", text: "Joint PDF: f_XY(x, y) = ∂²F_XY(x, y)/∂x∂y" },
                    { id: "283-4-7", text: "Marginal PDF: f_X(x) = integral of f_XY(x, y) dy" },
                    { id: "283-4-8", text: "Independent Random Variables: F_XY(x, y) = F_X(x) F_Y(y)" }
                ]
            }
        ]
    },
    {
        id: "circuit-analysis",
        code: "201",
        title: "Circuit Analysis",
        color: "bg-orange-500",
        customColor: "#f97316",
        bgGradient: "from-orange-500 to-amber-500",
        exams: [
            { id: "201-vize2", title: "2. Vize", date: "2025-12-11", time: "10:20" },
            { id: "201-final", title: "Circuit Final", date: "2026-01-02", time: "13:30" }
        ],
        units: [
            {
                title: "Chapter 1: Fundamentals and Circuit Laws",
                tasks: [
                    { id: "201-1-1", text: "Ideal Basic Circuit Elements (R, V, I)" },
                    { id: "201-1-2", text: "Independent and Dependent Sources & Power Balance" },
                    { id: "201-1-3", text: "Ohm's Law, KVL and KCL" },
                    { id: "201-1-4", text: "Series/Parallel Resistors and Equivalent Resistance" },
                    { id: "201-1-5", text: "Voltage Divider and Current Divider Equations" },
                    { id: "201-1-6", text: "Wye-Delta (Y-Δ) Transformation" }
                ]
            },
            {
                title: "Chapter 2: Circuit Analysis Methods",
                tasks: [
                    { id: "201-2-1", text: "Node-Voltage Method (KCL at each node)" },
                    { id: "201-2-2", text: "Supern ode concept (voltage source between two nodes)" },
                    { id: "201-2-3", text: "Mesh-Current Method (KVL at each mesh)" },
                    { id: "201-2-4", text: "Supermesh concept (current source in a mesh)" },
                    { id: "201-2-5", text: "Circuit Analysis with Dependent Sources" }
                ]
            },
            {
                title: "Chapter 3: Circuit Theorems",
                tasks: [
                    { id: "201-3-1", text: "Source Transformation (V_s and R_s ↔ I_s and R_s)" },
                    { id: "201-3-2", text: "Thevenin's Theorem: Model circuit as V_TH and R_TH" },
                    { id: "201-3-3", text: "Norton's Theorem: Model circuit as I_N and R_N" },
                    { id: "201-3-4", text: "Test Source Method for circuits with dependent sources" },
                    { id: "201-3-5", text: "Maximum Power Transfer: R_L = R_TH" },
                    { id: "201-3-6", text: "Superposition Theorem: Sum effects of each source" }
                ]
            },
            {
                title: "Chapter 4: Operational Amplifiers",
                tasks: [
                    { id: "201-4-1", text: "Ideal Op-Amp Model: Virtual Short Circuit (V+ = V-)" },
                    { id: "201-4-2", text: "Input currents are zero (I+ = I- = 0)" },
                    { id: "201-4-3", text: "Inverting Amplifier Circuit" },
                    { id: "201-4-4", text: "Non-Inverting Amplifier Circuit" },
                    { id: "201-4-5", text: "Summing Amplifier Circuit" },
                    { id: "201-4-6", text: "Difference Amplifier Circuit" },
                    { id: "201-4-7", text: "Op-Amp Saturation Regions" }
                ]
            },
            {
                title: "Chapter 5: Capacitors, Inductors and Transient Analysis",
                tasks: [
                    { id: "201-5-1", text: "Capacitor: i = C dv/dt and stored energy W = (1/2)CV²" },
                    { id: "201-5-2", text: "Inductor: v = L di/dt and stored energy W = (1/2)LI²" },
                    { id: "201-5-3", text: "Under DC: Capacitor = Open Circuit, Inductor = Short Circuit" },
                    { id: "201-5-4", text: "First Order RC Circuit: Natural Response" },
                    { id: "201-5-5", text: "First Order RC Circuit: Step Response" },
                    { id: "201-5-6", text: "First Order RL Circuit: Natural and Step Response" },
                    { id: "201-5-7", text: "Time Constant: τ = RC for RC, τ = L/R for RL" },
                    { id: "201-5-8", text: "General Solution: x(t) = x(∞) + [x(0) - x(∞)]e^(-t/τ)" },
                    { id: "201-5-9", text: "Second Order RLC: Series and Parallel equations" },
                    { id: "201-5-10", text: "Damping Coefficient (α) and Resonance Frequency (ω_0)" },
                    { id: "201-5-11", text: "Overdamped Response: α > ω_0" },
                    { id: "201-5-12", text: "Critically Damped Response: α = ω_0" },
                    { id: "201-5-13", text: "Underdamped / Oscillatory Response: α < ω_0" },
                    { id: "201-5-14", text: "Op-Amp Integrator Circuits" }
                ]
            }
        ]
    },
    {
        id: "signals",
        code: "301",
        title: "Signals and Systems",
        color: "bg-red-500",
        customColor: "#ef4444",
        bgGradient: "from-red-500 to-pink-600",
        exams: [
            { id: "301-vize2", title: "2. Vize", date: "2025-12-12", time: "08:30" },
            { id: "301-final", title: "Signal Final", date: "2026-01-07", time: "08:30" }
        ],
        units: [
            {
                title: "1. Introduction and Classification of Signals (pages 4–8)",
                tasks: [
                    { id: "301-1-1", text: "Define Continuous-Time vs. Discrete-Time Signals" },
                    { id: "301-1-2", text: "Distinguish between Analog and Digital Signals" },
                    { id: "301-1-3", text: "Understand Real vs. Complex and Deterministic vs. Random Signals" },
                    { id: "301-1-4", text: "Identify Even and Odd Signals" },
                    { id: "301-1-5", text: "Determine Periodic vs. Nonperiodic Signals" },
                    { id: "301-1-6", text: "Calculate Energy and Power of Signals" }
                ]
            },
            {
                title: "2. Basic Continuous-Time Signals (pages 9–13)",
                tasks: [
                    { id: "301-2-1", text: "Study the Unit Step Function u(t) and its properties" },
                    { id: "301-2-2", text: "Study the Unit Impulse Function δ(t) and delta properties" },
                    { id: "301-2-3", text: "Review Complex Exponential e^(jωt) and Sinusoidal Signals" }
                ]
            },
            {
                title: "3. Basic Discrete-Time Signals (pages 14–18)",
                tasks: [
                    { id: "301-3-1", text: "Study the Unit Step Sequence u[n]" },
                    { id: "301-3-2", text: "Study the Unit Impulse Sequence δ[n]" },
                    { id: "301-3-3", text: "Analyze Complex Exponential and Sinusoidal Sequences" },
                    { id: "301-3-4", text: "Understand Periodicity conditions for discrete exponentials" }
                ]
            },
            {
                title: "4. Signal Manipulations (pages 19–21)",
                tasks: [
                    { id: "301-4-1", text: "Perform Time Shifting x(t-t₀) transformations" },
                    { id: "301-4-2", text: "Perform Time Reversal x(-t) transformations" },
                    { id: "301-4-3", text: "Perform Time Scaling x(at) transformations" },
                    { id: "301-4-4", text: "Understand Amplitude transformations (Addition, Multiplication, Scaling)" }
                ]
            },
            {
                title: "5. Classification of Systems (pages 22–24)",
                tasks: [
                    { id: "301-5-1", text: "Distinguish Memoryless Systems vs. Systems with Memory" },
                    { id: "301-5-2", text: "Analyze Causal vs. Noncausal Systems" },
                    { id: "301-5-3", text: "Check for Linearity (Additivity and Homogeneity)" },
                    { id: "301-5-4", text: "Check for Time-Invariance vs. Time-Varying" },
                    { id: "301-5-5", text: "Determine BIBO Stability" },
                    { id: "301-5-6", text: "Understand Feedback structures" }
                ]
            },
            {
                title: "6. Continuous-Time LTI Systems (pages 36–39)",
                tasks: [
                    { id: "301-6-1", text: "Define Impulse Response h(t)" },
                    { id: "301-6-2", text: "Master the Convolution Integral y(t) = x(t) * h(t)" },
                    { id: "301-6-3", text: "Review Convolution properties (Commutative, Associative, Distributive)" },
                    { id: "301-6-4", text: "Derive Step Response from Impulse Response" },
                    { id: "301-6-5", text: "Determine Causality and Stability from h(t)" }
                ]
            },
            {
                title: "7. Differential and Difference Equations (pages 40–45)",
                tasks: [
                    { id: "301-7-1", text: "Solve Linear Constant-Coefficient Differential Equations" },
                    { id: "301-7-2", text: "Distinguish Zero-Input vs. Zero-State Response" },
                    { id: "301-7-3", text: "Define Impulse Response h[n] for discrete systems" },
                    { id: "301-7-4", text: "Master the Convolution Sum y[n] = x[n] * h[n]" },
                    { id: "301-7-5", text: "Solve Linear Constant-Coefficient Difference Equations" },
                    { id: "301-7-6", text: "Understand Recursive vs. Nonrecursive Systems (FIR vs. IIR)" }
                ]
            },
            {
                title: "8. Laplace Transform (pages 54–69)",
                tasks: [
                    { id: "301-8-1", text: "Define Bilateral Laplace Transform" },
                    { id: "301-8-2", text: "Determine the Region of Convergence (ROC)" },
                    { id: "301-8-3", text: "Sketch Poles and Zeros in the s-plane" },
                    { id: "301-8-4", text: "Master the Properties of the ROC" },
                    { id: "301-8-5", text: "Memorize Common Transform Pairs (Table 3-1)" },
                    { id: "301-8-6", text: "Apply Linearity, Time Shifting, and s-Domain Shifting" },
                    { id: "301-8-7", text: "Apply Time Scaling, Time Reversal" },
                    { id: "301-8-8", text: "Understand Differentiation and Integration properties" },
                    { id: "301-8-9", text: "Apply the Convolution Property" },
                    { id: "301-8-10", text: "Perform Partial-Fraction Expansion (Simple and Multiple Poles)" },
                    { id: "301-8-11", text: "Define System Function H(s) - Transfer function" },
                    { id: "301-8-12", text: "Relate H(s) to Causality and Stability (pole locations)" },
                    { id: "301-8-13", text: "Understand Unilateral Laplace Transform" },
                    { id: "301-8-14", text: "Solve Differential Equations with Initial Conditions" },
                    { id: "301-8-15", text: "Analyze Transform Circuits (R, L, C models)" }
                ]
            },
            {
                title: "9. Z-Transform (pages 86–98)",
                tasks: [
                    { id: "301-9-1", text: "Define Bilateral z-Transform" },
                    { id: "301-9-2", text: "Determine the Region of Convergence (ROC) in z-plane" },
                    { id: "301-9-3", text: "Sketch Poles and Zeros in z-plane" },
                    { id: "301-9-4", text: "Memorize Common z-Transform Pairs (Table 4-1)" },
                    { id: "301-9-5", text: "Apply Linearity, Time Shifting, and Scaling" },
                    { id: "301-9-6", text: "Apply Time Reversal and Differentiation" },
                    { id: "301-9-7", text: "Use Power Series Expansion method" },
                    { id: "301-9-8", text: "Use Partial-Fraction Expansion method" },
                    { id: "301-9-9", text: "Define System Function H(z)" },
                    { id: "301-9-10", text: "Relate H(z) to Causality and Stability (pole analysis)" },
                    { id: "301-9-11", text: "Solve Difference Equations using unilateral transform" }
                ]
            },
            {
                title: "10. Fourier Analysis (pages 107–122)",
                tasks: [
                    { id: "301-10-1", text: "Represent Periodic Signals with Fourier series" },
                    { id: "301-10-2", text: "Calculate Complex Exponential Fourier Series coefficients c_n" },
                    { id: "301-10-3", text: "Understand Trigonometric Fourier Series (a_n and b_n coefficients)" },
                    { id: "301-10-4", text: "Define Fourier Transform X(jω) and Inverse Fourier Transform" },
                    { id: "301-10-5", text: "Check Convergence (Dirichlet Conditions)" },
                    { id: "301-10-6", text: "Relate Fourier Transform to Laplace Transform (s = jω)" },
                    { id: "301-10-7", text: "Apply Linearity, Time Shifting, and Frequency Shifting" },
                    { id: "301-10-8", text: "Apply Time Scaling, Time Reversal, and Duality" },
                    { id: "301-10-9", text: "Understand Convolution and Multiplication (Modulation)" },
                    { id: "301-10-10", text: "Apply Parseval's Relation (Energy conservation)" },
                    { id: "301-10-11", text: "Determine Magnitude and Phase Response" },
                    { id: "301-10-12", text: "Analyze Ideal Filters (Low-Pass, High-Pass, Band-Pass/Stop)" },
                    { id: "301-10-13", text: "Define Absolute Bandwidth" },
                    { id: "301-10-14", text: "Define 3-dB (Half-Power) Bandwidth" }
                ]
            },
            {
                title: "11. Sampling Theorem (pages 123–126)",
                tasks: [
                    { id: "301-11-1", text: "Understand Nyquist Sampling Theorem (fs ≥ 2f_max)" },
                    { id: "301-11-2", text: "Study Sampling Frequency and Aliasing problems" },
                    { id: "301-11-3", text: "Learn Ideal Sampling with impulse train" },
                    { id: "301-11-4", text: "Master Reconstruction of signal from samples" },
                    { id: "301-11-5", text: "Study Practical Sampling (Zero-order hold and reconstruction filters)" }
                ]
            },
            {
                title: "12. Additional Topics",
                tasks: [
                    { id: "301-12-1", text: "Define State Variables" },
                    { id: "301-12-2", text: "Study State Equations: ẋ = Ax + Bu, y = Cx + Du" },
                    { id: "301-12-3", text: "Calculate State Transition Matrix e^(At)" },
                    { id: "301-12-4", text: "Test Controllability and Observability" },
                    { id: "301-12-5", text: "Define N-point DFT" },
                    { id: "301-12-6", text: "Study FFT (Fast Fourier Transform) algorithm" },
                    { id: "301-12-7", text: "Understand DFT Properties (Periodicity, Symmetry)" },
                    { id: "301-12-8", text: "Apply Windowing Techniques (Hamming, Hanning, Blackman)" },
                    { id: "301-12-9", text: "Study Butterworth Filters (maximally flat passband)" },
                    { id: "301-12-10", text: "Study Chebyshev Filters (Type I and Type II)" },
                    { id: "301-12-11", text: "Study Elliptic (Cauer) Filters (optimum design)" },
                    { id: "301-12-12", text: "Study Bessel Filters (linear phase response)" },
                    { id: "301-12-13", text: "Learn FIR Filter Design (window method, frequency sampling)" },
                    { id: "301-12-14", text: "Learn IIR Filter Design (bilinear transformation, impulse invariance)" }
                ]
            }
        ]
    },
    {
        id: "personal",
        code: "KŞSL",
        title: "Kişisel & Teknoloji",
        color: "bg-gray-800 dark:bg-gray-600",
        customColor: "#475569",
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

export const INITIAL_COMPLETED_TASK_IDS = INITIAL_DATA.flatMap(course =>
    course.units.flatMap(unit =>
        unit.tasks.filter(task => task.initialChecked).map(task => task.id)
    )
);
