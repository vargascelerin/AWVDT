# Flask Vulnerable App - Directory Traversal Demo

## 📋 Descripción

Esta es una aplicación Flask diseñada *intencionalmente con una vulnerabilidad de Directory Traversal* con fines educativos. El objetivo es demostrar cómo un endpoint mal implementado puede permitir que atacantes accedan a archivos fuera del directorio previsto.

## ⚠️ Advertencia

*Esta aplicación contiene vulnerabilidades intencionales y NO debe usarse en producción.* Es únicamente para propósitos educativos y de demostración de seguridad.

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


## 🚀 Instalación y Uso

### Requisitos
- Python 3.7+
- Flask

### Instalación


#### Clonar repositorio o descargar el proyecto
```bash
git clone https://github.com/vargascelerin/AWVDT.git
```
#### Acceder a ruta
```bash
cd flask-vulnerable-app
```


#### Instalar dependencias
##### Entorno virtual
*NOTA:* Lo más recomendable es usar un entorno virtual, se puede crear de la siguiente manera:

🪟**WINDOWS**
1. Creación de entorno virtual
```bash
python -m venv C:\path-to-venv\
```
3. Activar entorno virtual
  Usando ejecutable
```bash
C:\> \path-to-venv\Scripts\activate.bat
```
  Usando la PowerShell
```bash
PS C:\> \path-to-venv\Scripts\activate.ps1
```
5. Desactivar (dejar activado en este caso)
```bash
deactivate
```
🐧**LINUX**
1. Creación de entorno virtual
```bash
python3 -m venv \path-to-venv\
```
3. Activar entorno virtual
```bash
source \path-to-venv\bin\activate
```
5. Desactivar (dejar activado en este caso)
```bash
deactivate
```

##### Dependencias
- *Flask*
```bash
pip install flask
```

### Ejecutar la aplicación

En windows
```bash
python app.py
```

En linux
```bash
python3 app.py
```

La aplicación estará disponible en http://localhost:5000

[Ver página web](https://localhost:5000)


### *Estructura de Archivos*

```bash
flask-vulnerable-app/
├── app.py
├── docs
│   ├── CORRECTIVOS.md
│   ├── EXPLOTACION.md
│   ├── image-1.png
│   ├── image-2.png
│   ├── image-3.png
│   ├── image-4.png
│   ├── image-5.png
│   ├── image-6.png
│   ├── image-7.png
│   ├── image.png
│   ├── retest-1.png
│   ├── retest-2.png
│   ├── retest-3.png
│   ├── retest-4.png
│   ├── RETEST.md
│   └── retest.png
├── invoices
│   ├── factura01.pdf
│   ├── factura02.pdf
│   ├── factura03.pdf
│   ├── factura04.pdf
│   └── factura05.pdf
├── requirements.txt
├── secreto.txt
├── static
│   ├── css
│   │   └── styles.css
│   └── js
│       ├── main.js
│       └── profile.js
└── templates
    ├── base.html
    ├── index.html
    └── profile.html
```


## 🎯 Lo que hicimos
### 📝 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | / | Página principal |
| GET | /api/products | Lista de 6 productos (JSON) |
| GET | /download-invoice?file=X | *VULNERABLE* - Descarga archivo |

### 1. *Backend Flask con Endpoints Básicos*
- GET / - Página principal (renderiza index.html)
- GET /api/products - API que retorna 6 productos hardcodeados en JSON
- GET /download-invoice?file=X - *Endpoint vulnerable* para descargar facturas

### 2. *La Vulnerabilidad: Directory Traversal*

El endpoint /download-invoice está intencionalmente mal implementado:


# CÓDIGO VULNERABLE
```python
filename = request.args.get('file', '')
file_path = os.path.join('invoices/', filename)
return send_file(file_path)
```

*¿Qué está mal?*
- No valida que el archivo solicitado esté dentro del directorio invoices/
- No sanitiza el parámetro file recibido del usuario
- Permite el uso de secuencias ../ para navegar hacia arriba en el sistema de archivos


## 🔓 Demostración del Exploit

### Uso Normal (sin exploit)
bash
# Descargar una factura legítima
Con curl
```bash
curl "http://localhost:5000/download-invoice?file=factura01.pdf" -o factura01.pdf
```

[Enlace equivalente](http://localhost:5000/download-invoice?file=factura01.pdf)


### Exploit: Directory Traversal

# VULNERABILIDAD: Acceder al archivo secreto usando ../
Existe una ruta que devuelve cualquier archivo de la aplicación
Con curl
```bash
curl "http://localhost:5000/download-invoice?file=../secreto.txt" -o secreto_robado.txt
```

[Enlace equivalente](http://localhost:5000/download-invoice?file=../secreto.txt)


**¿Por qué funciona?**
- El usuario envía `file=../secreto.txt`
- Flask construye el path: `invoices/../secreto.txt`
- Se resuelve a: `secreto.txt` (en la raíz)
- El servidor envía el archivo sin validar

# VULNERABILIDAD: Acceder a archivos por input mal sanitizado
Existe un input mal sanitizado en `profile.js` que permite descargar cualquier archivo

El código es **intencionalmente vulnerable** para demostrar esta vulnerabilidad común:

**Código Vulnerable en `profile.js`:**
```javascript
// VULNERABLE: Construye URL directamente sin validación
const downloadUrl = `/download-invoice?file=${encodeURIComponent(filename)}`;
window.open(downloadUrl, '_blank');
```
**¿Cómo Explotar la Vulnerabilidad?**

**Uso Normal (Esperado):**

Input: factura01.pdf
URL: /download-invoice?file=factura01.pdf
Resultado: Descarga invoices/factura01.pdf

**Exploit - Directory Traversal:**

Input: ../secreto.txt
URL: /download-invoice?file=../secreto.txt
Resultado: Descarga el archivo secreto.txt de la raíz

**Otros Exploits Posibles:**

- `../secreto.txt` → Descarga archivo sensible
- `../app.py` → Descarga código fuente
- `../../requirements.txt` → Descarga dependencias

**¿Por qué es vulnerable?**
- No valida que el archivo esté dentro del directorio `invoices/`
- No sanitiza el input del usuario
- Permite secuencias `../` para navegar hacia arriba en directorios


## 🔗 Referencias

- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)
- [Flask Security Best Practices](https://flask.palletsprojects.com/en/latest/security/)

---

*Recuerda*: Esta aplicación es vulnerable por diseño. Úsala solo en entornos de prueba aislados y nunca en producción.


