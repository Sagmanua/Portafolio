# Dynamic Portfolio Website
[English](#english) | [Español](#español)

## Español
# Sitio Web de Portafolio Dinámico

Un sitio web de portafolio **responsive** y basado en datos, diseñado para mostrar proyectos de desarrollo.  
El sitio cuenta con un diseño de cuadrícula dinámica, filtrado de proyectos por lenguaje de programación y un carrusel de imágenes interactivo para proyectos con múltiples capturas de pantalla.

🚀 **Demo en Vivo**  
[Ver el Portafolio de Bohdan Sydorenko](https://sagmanua.github.io/Portafolio/)

---

## 🛠️ Stack Tecnológico

### Frontend
- **HTML5**
- **CSS3**
  - Variables personalizadas
  - Flexbox
  - Grid
- **JavaScript Vanilla (ES6+)**

### Gestión de Datos
- Almacenamiento de proyectos basado en JSON

### Iconos e Imágenes
- Insignias personalizadas por lenguaje
- Capturas de pantalla de los proyectos

---

## ✨ Características Clave

### Carga Dinámica de Proyectos
Los proyectos se obtienen automáticamente desde `data.json` y se renderizan mediante JavaScript, lo que facilita actualizar el contenido sin modificar el HTML.

### Filtro Interactivo por Lenguaje
Sistema de filtrado personalizado usando iconos de lenguajes.  
Al hacer clic en un icono, se filtran los proyectos por ese lenguaje específico (por ejemplo, PHP, Python, JavaScript).

### Carrusel de Imágenes Personalizado
Construido desde cero en JavaScript Vanilla, el carrusel incluye:
- Redimensionado automático mediante `ResizeObserver`
- Navegación táctil y por clic para proyectos con múltiples capturas
- Transiciones CSS suaves

### Diseño Responsive
Enfoque *mobile-first* que se adapta de:
- **Cuadrícula de 3 columnas** en escritorio  
- **Diseño de 1 columna** en dispositivos móviles

### Enlaces Externos
Botones integrados para acceso directo a:
- Repositorios de GitHub
- Despliegues de sitios web en vivo

---

## 📁 Estructura del Proyecto

```plaintext
├── images          # Logo
├── foto of project # Imágenes de los proyectos mostrados en el portafolio
├── version         # Versión de estos proyectos
├── index.html      # Estructura principal y navegación
├── style.css       # Estilos personalizados, temas y animaciones del carrusel
├── json_file.js    # Lógica para obtener datos, filtrar y controlar el carrusel
├── data.json       # La "base de datos" con detalles de proyectos y rutas de imágenes
└── images/         # Iconos de lenguajes y recursos de redes sociales
```

### 1. Integración de Datos
El sitio utiliza la API `fetch()` para obtener los datos de los proyectos desde `data.json`.
Estos datos incluyen:

- Títulos  
- Descripciones  
- Lenguajes de programación  
- Arrays de imágenes  

### 2. Lógica de Filtrado
JavaScript extrae los lenguajes únicos del conjunto de datos para construir el filtro de navegación superior.

- Usa un `Set` para evitar duplicados  
- Aplica el método `.filter()` a la lista de proyectos cuando se selecciona un lenguaje  

### 3. El Carrusel
El carrusel se inicializa después de que los proyectos se inyectan en el DOM.

- Calcula el `clientWidth` de su contenedor  
- Asegura que el valor `translateX` mueva la pista con precisión  
- Funciona de manera consistente en todos los tamaños de pantalla  

---

## 🎨 Tema de Estilos

El proyecto utiliza una paleta de colores **Trigo Profundo / Caqui**:

**Fondo Principal**
- `#E0CCA6` (Trigo)

**Secundarios / Acentos**
- `#2F4244` (Pizarra Oscura)  
- `#C28E00` (Dorado)

**Tarjetas**
- Fondos blancos limpios  
- Sombras suaves para un estilo moderno tipo *Glassmorphism*
## 👤 Author

Desarrollado por **Bohdan Sydorenko**  
No dudes en explorar [My Repositories](https://github.com/Sagmanua) en GitHub.

## English
A responsive, data-driven portfolio website designed to showcase development projects.  
The site features a dynamic grid layout, project filtering by programming language, and an interactive image carousel for multi-screenshot projects.

🚀 **Live Demo**  
[View Bohdan Sydorenko's Portfolio](https://sagmanua.github.io/Portafolio/)

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**
- **CSS3**
  - Custom Variables
  - Flexbox
  - Grid
- **Vanilla JavaScript (ES6+)**

### Data Management
- JSON-based project storage

### Icons & Images
- Custom language badges
- Project screenshots

---

## ✨ Key Features

### Dynamic Project Loading
Projects are automatically fetched from `data.json` and rendered via JavaScript, making it easy to update content without touching HTML.

### Interactive Language Filter
A custom-built filtering system using language icons.  
Clicking an icon filters projects by that specific language (e.g., PHP, Python, JavaScript).

### Custom Image Carousel
Built from scratch in Vanilla JS, the carousel supports:
- Automatic resizing via `ResizeObserver`
- Touch and click navigation for projects with multiple screenshots
- Smooth CSS transitions

### Responsive Design
A mobile-first approach that adjusts from:
- **3-column grid** on desktop  
- **1-column layout** on mobile devices

### External Links
Integrated buttons for direct access to:
- GitHub repositories
- Live website deployments

---

## 📁 Project Structure

```plaintext
├── images          #Logo 
├── foto of project #Images of project that post in portfolio
├── version         #Version of this projects
├── index.html      # Main structure and navigation
├── style.css       # Custom styling, themes, and carousel animations
├── json_file.js    # Logic for fetching data, filtering, and carousel control
├── data.json       # The "database" containing project details and image paths
└── images/         # Language icons and social media assets
```

## ⚙️ How It Works

### 1. Data Integration

The site uses the `fetch()` API to retrieve project data from `data.json`.  
This data includes:

- Titles  
- Descriptions  
- Programming languages  
- Image arrays  

### 2. Filtering Logic

JavaScript extracts unique languages from the dataset to build the top navigation filter.

- Uses a `Set` to prevent duplicates  
- Applies the `.filter()` method to the project list when a language is selected  

### 3. The Carousel

The carousel is initialized after projects are injected into the DOM.

- Calculates the `clientWidth` of its container  
- Ensures the `translateX` value moves the track precisely  
- Works consistently across all screen sizes  

---

## 🎨 Styling Theme

The project uses a **Deeper Wheat / Khaki** color scheme:

- **Primary Background:** `#E0CCA6` (Wheat)  

- **Secondary / Accents:**  
  - `#2F4244` (Dark Slate)  
  - `#C28E00` (Gold)  

- **Cards:**  
  - Clean white backgrounds  
  - Soft shadows for a modern *Glassmorphism* feel  

---

## 👤 Author

Developed by **Bohdan Sydorenko**  
Feel free to explore [My Repositories](https://github.com/Sagmanua) on GitHub.



