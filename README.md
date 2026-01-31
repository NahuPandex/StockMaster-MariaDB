# 📦 StockMaster-MariaDB

Sistema integral de gestión de inventarios y punto de venta (POS) diseñado para optimizar el control de stock y la facturación diaria. Desarrollado con el stack MERN adaptado para **MariaDB**.

## 🚀 Características Principales

- **Gestión de Inventario:** Control total de productos con alertas de stock crítico (bajo 5 unidades).
- **Ventas Diarias:** Filtro inteligente que muestra exclusivamente las ventas del día actual, reiniciándose automáticamente a la medianoche.
- **Lógica de Papelera Transaccional:** - Al cancelar un pedido, el stock se reintegra al inventario.
  - Al restaurar un pedido de la papelera, se aplica la merma (descuento) de stock automáticamente.
- **Facturación:** Generación de facturas en formato optimizado para impresión física.
- **Seguridad de Stock:** Validaciones para evitar el ingreso de stock o precios negativos.

## 🛠️ Tecnologías

* **Frontend:** React.js, Axios, Bootstrap 5.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MariaDB (Motor de base de datos relacional).
* **Gestión de Variables:** Dotenv para la protección de credenciales.



## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MariaDB o MySQL
- NPM o Yarn

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/NahuPandex/StockMaster-MariaDB.git](https://github.com/NahuPandex/StockMaster-MariaDB.git)
   cd StockMaster-MariaDB
Instalar dependencias:

Bash
npm install
Configurar variables de entorno: Crea un archivo .env en la raíz del proyecto con los siguientes datos:

Fragmento de código
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_mariadb
DB_PORT=3306
Preparar la Base de Datos: Importa el siguiente esquema en tu terminal de MariaDB:

SQL
CREATE DATABASE tienda_mariadb;
USE tienda_mariadb;
-- 1. Tabla de Productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- 2. Tabla de Usuarios (Vendedores/Admin)
CREATE TABLE usuarios (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor') DEFAULT 'vendedor'
);

-- 3. Tabla de Pedidos (Cabecera)
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('completado', 'cancelado') DEFAULT 'completado',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_user)
);

-- 4. Tabla de Detalles del Pedido
CREATE TABLE detalles_pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

Bash
node server.js


Desarrollado por NahuPandex