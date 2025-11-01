# Flask Vulnerable App - Directory Traversal Demo

## 📋 Descripción

Esta es una aplicación Flask diseñada *intencionalmente con una vulnerabilidad de Directory Traversal* con fines educativos. El objetivo es demostrar cómo un endpoint mal implementado puede permitir que atacantes accedan a archivos fuera del directorio previsto.

## ⚠️ Advertencia

*Esta aplicación contiene vulnerabilidades intencionales y NO debe usarse en producción.* Es únicamente para propósitos educativos y de demostración de seguridad.

## 🎯 Lo que hicimos

### 1. *Backend Flask con Endpoints Básicos*
- GET / - Página principal (renderiza index.html)
- GET /api/products - API que retorna 6 productos hardcodeados en JSON
- GET /download-invoice?file=X - *Endpoint vulnerable* para descargar facturas

### 2. *La Vulnerabilidad: Directory Traversal*

El endpoint /download-invoice está intencionalmente mal implementado:

python
# CÓDIGO VULNERABLE - NO USAR EN PRODUCCIÓN
filename = request.args.get('file', '')
file_path = os.path.join('invoices/', filename)
return send_file(file_path)


*¿Qué está mal?*
- No valida que el archivo solicitado esté dentro del directorio invoices/
- No sanitiza el parámetro file recibido del usuario
- Permite el uso de secuencias ../ para navegar hacia arriba en el sistema de archivos

### 3. *Estructura de Archivos*


flask-vulnerable-app/
├── app.py                 # Backend Flask
├── secreto.txt            # Archivo "secreto" en raíz (para probar exploit)
├── invoices/              # Carpeta con facturas legítimas
│   ├── factura01.pdf
│   ├── factura02.pdf
│   ├── factura03.pdf
│   ├── factura04.pdf
│   └── factura05.pdf
├── templates/
│   └── index.html         # Frontend (opcional)
└── README.md


## 🚀 Instalación y Uso

### Requisitos
- Python 3.7+
- Flask

### Instalación

bash
# Clonar o descargar el proyecto
cd flask-vulnerable-app

# Instalar dependencias
pip install flask

# Crear archivos de ejemplo
echo "Esto es información confidencial!" > secreto.txt
mkdir -p invoices
touch invoices/factura01.pdf
touch invoices/factura02.pdf
touch invoices/factura03.pdf
touch invoices/factura04.pdf
touch invoices/factura05.pdf


### Ejecutar la aplicación

bash
python app.py


La aplicación estará disponible en http://localhost:5000

## 🔓 Demostración del Exploit

### Uso Normal (sin exploit)
bash
# Descargar una factura legítima
curl "http://localhost:5000/download-invoice?file=factura01.pdf" -o factura01.pdf


### Exploit: Directory Traversal
bash
# VULNERABILIDAD: Acceder al archivo secreto usando ../
curl "http://localhost:5000/download-invoice?file=../secreto.txt" -o secreto_robado.txt

# También podría intentar acceder a archivos del sistema
curl "http://localhost:5000/download-invoice?file=/etc/passwd"


*¿Por qué funciona?*
- El usuario envía file=../secreto.txt
- Flask construye el path: invoices/../secreto.txt
- Se resuelve a: secreto.txt (en la raíz)
- El servidor envía el archivo sin validar

## 🛡️ Cómo arreglarlo (Versión Segura)

*NUNCA uses el código vulnerable en producción.* Aquí está la forma correcta:

python
import os
from werkzeug.utils import secure_filename

@app.route('/download-invoice', methods=['GET'])
def download_invoice_secure():
    filename = request.args.get('file', '')
    
    if not filename:
        return jsonify({"error": "No file specified"}), 400
    
    # 1. Sanitizar el nombre del archivo
    filename = secure_filename(filename)
    
    # 2. Construir el path completo
    base_dir = os.path.abspath('invoices/')
    file_path = os.path.abspath(os.path.join(base_dir, filename))
    
    # 3. Verificar que el archivo esté dentro del directorio permitido
    if not file_path.startswith(base_dir):
        return jsonify({"error": "Access denied"}), 403
    
    # 4. Verificar que el archivo existe
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404
    
    return send_file(file_path, as_attachment=True)


## 📚 Conceptos de Seguridad

### ¿Qué es Directory Traversal?
Una vulnerabilidad que permite a atacantes acceder a archivos y directorios fuera del directorio raíz previsto mediante secuencias como ../ (punto punto barra).

### Impacto Real
- Robo de archivos de configuración (config.php, .env)
- Acceso a credenciales y claves API
- Lectura de código fuente
- Acceso a archivos del sistema (/etc/passwd, /etc/shadow)

### Prevención
1. *Sanitización*: Usa secure_filename() de Werkzeug
2. *Validación*: Verifica que el path esté dentro del directorio permitido
3. *Lista blanca*: Solo permite nombres de archivo predefinidos
4. *Permisos*: Configura permisos de archivos correctamente
5. *Never trust user input*: Siempre valida y sanitiza entrada del usuario

## 🎓 Propósito Educativo

Este proyecto demuestra:
- Cómo se ve una vulnerabilidad real
- Por qué la validación de entrada es crítica
- Técnicas de exploit comunes
- Cómo implementar la versión segura

## 📝 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | / | Página principal |
| GET | /api/products | Lista de 6 productos (JSON) |
| GET | /download-invoice?file=X | *VULNERABLE* - Descarga archivo |

## 🔗 Referencias

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/latest/security/)

---

*Recuerda*: Esta aplicación es vulnerable por diseño. Úsala solo en entornos de prueba aislados y nunca en producción.
