# Dynamic Portfolio Website

A responsive, data-driven portfolio website designed to showcase development projects.  
The site features a dynamic grid layout, project filtering by programming language, and an interactive image carousel for multi-screenshot projects.

🚀 **Live Demo**  
[View Bohdan Sydorenko's Portfolio](#)

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



