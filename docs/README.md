# Flask Vulnerable App - Directory Traversal Demo

## 📋 Descripción

Esta es una aplicación Flask diseñada *intencionalmente con una vulnerabilidad de Directory Traversal* con fines educativos. El objetivo es demostrar cómo un endpoint mal implementado puede permitir que atacantes accedan a archivos fuera del directorio previsto.

## ⚠️ Advertencia

*Esta aplicación contiene vulnerabilidades intencionales y NO debe usarse en producción.* Es únicamente para propósitos educativos y de demostración de seguridad.

## 🚀 Instalación y Uso

### Requisitos
- Python 3.7+
- Flask

### Instalación

bash
#### Clonar repositorio o descargar el proyecto
``` git clone https://github.com/vargascelerin/AWVDT.git```
#### Acceder a ruta
``` cd flask-vulnerable-app ```


#### Instalar dependencias
##### Entorno virtual
*NOTA:* Lo más recomendable es usar un entorno virtual, se puede crear de la siguiente manera:
*WINDOWS*
1. Creación de entorno virtual
```python -m venv C:\path-to-venv\```
2. Activar entorno virtual
  Usando ejecutable
``` C:\> \path-to-venv\Scripts\activate.bat ```
  Usando la PowerShell
``` PS C:\> \path-to-venv\Scripts\activate.ps1 ```
3. Desactivar (dejar activado en este caso)
``` deactivate ```
*LINUX*
1. Creación de entorno virtual
```python3 -m venv \path-to-venv\```
2. Activar entorno virtual
```source \path-to-venv\bin\activate ```
3. Desactivar (dejar activado en este caso)
```deactivate ```

##### Dependencias
- *Flask*
``` pip install flask ```

### Ejecutar la aplicación

En windows
```python app.py```

En linux
```python3 app.py```

La aplicación estará disponible en http://localhost:5000
[Ver página web](https://localhost:5000)


### *Estructura de Archivos*

```
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
```


## 🎯 Lo que hicimos

### 1. *Backend Flask con Endpoints Básicos*
- GET / - Página principal (renderiza index.html)
- GET /api/products - API que retorna 6 productos hardcodeados en JSON
- GET /download-invoice?file=X - *Endpoint vulnerable* para descargar facturas

### 2. *La Vulnerabilidad: Directory Traversal*

El endpoint /download-invoice está intencionalmente mal implementado:

python
# CÓDIGO VULNERABLE - NO USAR EN PRODUCCIÓN
```javascript
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
```curl "http://localhost:5000/download-invoice?file=factura01.pdf" -o factura01.pdf```
[Enlace equivalente]("http://localhost:5000/download-invoice?file=factura01.pdf")


### Exploit: Directory Traversal

# VULNERABILIDAD: Acceder al archivo secreto usando ../
Existe una ruta que devuelve cualquier archivo de la aplicación
Con curl
``` curl "http://localhost:5000/download-invoice?file=../secreto.txt" -o secreto_robado.txt```
[Enlace equivalente]("http://localhost:5000/download-invoice?file=../secreto.txt")


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


