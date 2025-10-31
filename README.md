# AWVDT
Aplicación Web Vulnerable Directory Transversal

gym-supplements-shop/
│
├── app.py                          # ⚠️ Aplicación Flask VULNERABLE 
├── app_seguro.py                   # ✅ Aplicación Flask parchada
├── secreto.txt                     # 🔐 Archivo sensible para testing
├── requirements.txt                # 📦 Dependencias Python
├── .env.example                    # 🔧 Variables de entorno ejemplo
│
├── templates/                      # 📄 Templates HTML 
│   ├── base.html                   # Base template con navbar/footer 
│   ├── index.html                  # Página principal/home 
│   └── profile.html                # Perfil + descarga de facturas 
│
├── static/                         # 🎨 Archivos estáticos
│   ├── css/
│   │   └── styles.css              # Estilos CSS principales 
│   │
│   ├── js/
│   │   ├── main.js                 # JavaScript global + productos 
│   │   └── profile.js              # JavaScript de perfil/descargas 
│   │
│   └── images/
│       └── products/               # Imágenes de productos
│           ├── whey.jpg            # Proteína Whey
│           ├── creatina.jpg        # Creatina
│           ├── preworkout.jpg      # Pre-Workout
│           ├── bcaa.jpg            # BCAA
│           ├── multi.jpg           # Multivitamínico
│           └── burner.jpg          # Quemador de grasa
│
├── invoices/                       # 📄 Facturas legítimas 
│   ├── factura01.pdf               # Factura de ejemplo 1
│   ├── factura02.pdf               # Factura de ejemplo 2
│   ├── factura03.pdf               # Factura de ejemplo 3
│   ├── factura04.pdf               # Factura de ejemplo 4
│   └── factura03.pdf               # Factura de ejemplo 3
│
└── docs/                           # 📚 Documentación del proyecto
    ├── README.md                   # Instrucciones generales
    ├── PENTESTING.md               # Pruebas manuales
    ├── EXPLOTACION.md              # Explotación automatizada 
    ├── CORRECTIVOS.md              # Soluciones aplicadas 
    ├── RETEST.md                   # Re-testing post-corrección
    └── INFORME_FINAL               # Reporte completo del proyecto 
