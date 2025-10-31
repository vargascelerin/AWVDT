<h1>Propuesta de diseño de la aplicacion vulnerable (es un ecommerce de suplementos del gym)</h1>

<pre style="white-space: pre; overflow-x: auto; font-family: monospace;">
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
│   └── factura05.pdf               # Factura de ejemplo 5
│
└── docs/                           # 📚 Documentación del proyecto
    ├── README                      # Instrucciones generales

    Word 
    ├── PENTESTING                  # Pruebas manuales
    ├── EXPLOTACION                 # Explotación automatizada 
    ├── CORRECTIVOS                 # Soluciones aplicadas 
    ├── RETEST                      # Re-testing post-corrección
    └── INFORME_FINAL               # Reporte completo del proyecto
</pre>
