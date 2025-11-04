# Comparación: `app.py` (vulnerable) vs `app_seguro.py` (seguro)

## Construcción de la ruta

**`app.py` (vulnerable):**
```python
file_path = os.path.join('invoices/', filename)
return send_file(file_path, as_attachment=True)
```
Usa la entrada del usuario directamente en os.path.join sin normalizar ni verificar
→ permite ../ y rutas absolutas (Directory Traversal).

**`app_seguro.py` (seguro):**

```python
Copiar código
cleaned = secure_filename(filename)
requested_path = os.path.realpath(os.path.join('invoices', cleaned))
invoices_real = os.path.realpath('invoices')
if not (requested_path == invoices_real or requested_path.startswith(invoices_real + os.sep)):
    return jsonify({"error": "Access denied"}), 403
return send_file(requested_path, as_attachment=True)
```
Normaliza (secure_filename), resuelve (realpath) y comprueba que la ruta resuelta está dentro de invoices/
→ impide traversal.

Lista blanca (whitelist)
app.py: No existe whitelist; cualquier nombre (incluidos ../../secreto.txt) se intenta servir.

app_seguro.py: Se carga ALLOWED_FILES al iniciar (nombres de archivos reales en invoices/) y, si la lista no está vacía, se exige que el nombre normalizado esté en ella.
Esto reduce la superficie de ataque y solo permite descargas previstas.

Sanitización del nombre
app.py: No usa secure_filename ni otra sanitización.

app_seguro.py: Usa werkzeug.utils.secure_filename para eliminar caracteres peligrosos o extraños antes de construir la ruta.

Validación del path resuelto
app.py: No valida realpath ni startswith.

app_seguro.py: Utiliza os.path.realpath() y comprueba startswith(invoices_real + os.sep) (y permite igualdad exacta)
Evita que symlinks o .. salgan del directorio permitido.

Manejo de errores y logging
app.py: Captura FileNotFoundError y devuelve el error; otras excepciones devuelven str(e) — eso puede filtrar información interna.

app_seguro.py: Maneja FileNotFoundError, PermissionError y excepciones genéricas devolviendo mensajes genéricos
(File not found, Access denied, Internal server error) y registra detalles en logs del servidor con current_app.logger.
No expone rutas ni trazas al cliente.

Protección contra rutas absolutas y encoding
app.py: Acepta file=/etc/passwd o file=..%2fsecreto.txt (dependiendo del encoding) y las pasa directo.

app_seguro.py: secure_filename limpia, realpath normaliza rutas absolutas y symlinks, y la comprobación startswith bloquea accesos fuera del directorio.

Creación y actualización de whitelist
app.py: Crea invoices/ si no existe, pero sin lista blanca.

app_seguro.py: También crea invoices/ si no existe y además actualiza ALLOWED_FILES con los archivos existentes,
reduciendo errores y permitiendo control explícito.

UX / Frontend
app.py: No ofrece mensajes pensados para el frontend más allá de los JSON genéricos.

app_seguro.py: Devuelve mensajes amigables y códigos de estado apropiados (400, 403, 404, 500)
Permite al frontend mostrar notificaciones claras, por ejemplo:

“Descarga bloqueada: Access denied.”