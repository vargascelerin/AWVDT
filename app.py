from flask import Flask, jsonify, request, send_file, render_template
import os

app = Flask(__name__)

# Datos hardcodeados de productos
PRODUCTS = [
    {
        "id": 1,
        "name": "Laptop Dell XPS 13",
        "price": 1299.99,
        "image": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300"
    },
    {
        "id": 2,
        "name": "iPhone 14 Pro",
        "price": 999.99,
        "image": "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=300"
    },
    {
        "id": 3,
        "name": "Sony WH-1000XM5",
        "price": 399.99,
        "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300"
    },
    {
        "id": 4,
        "name": "Samsung 4K Monitor",
        "price": 549.99,
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300"
    },
    {
        "id": 5,
        "name": "Logitech MX Master 3",
        "price": 99.99,
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300"
    },
    {
        "id": 6,
        "name": "MacBook Pro M3",
        "price": 1999.99,
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300"
    }
]

@app.route('/')
def index():
    """Ruta principal que renderiza el index.html"""
    return render_template('index.html')
@app.route('/profile')
def profile():
    """Página de perfil que permite descargar facturas"""
    return render_template('profile.html')


@app.route('/api/products', methods=['GET'])
def get_products():
    """Retorna la lista de productos en formato JSON"""
    return jsonify(PRODUCTS)

@app.route('/download-invoice', methods=['GET'])
def download_invoice():
    """
    VULNERABLE: Endpoint con directory traversal
    No valida el path del archivo solicitado
    """
    filename = request.args.get('file', '')
    
    if not filename:
        return jsonify({"error": "No file specified"}), 400
    
    # VULNERABLE: No hay validación del path
    # Permite path traversal con ../
    file_path = os.path.join('invoices/', filename)
    
    try:
        return send_file(file_path, as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Crear carpeta invoices si no existe
    if not os.path.exists('invoices'):
        os.makedirs('invoices')
    
    app.run(debug=True, host='0.0.0.0', port=5000)