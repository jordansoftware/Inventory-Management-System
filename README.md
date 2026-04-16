# Inventory Management System

![Dashboard](https://picsum.photos/seed/inventory/1200/400)

**Inventory Management System** is a professional, full-stack inspired IT asset management application designed for modern IT departments. It streamlines the tracking of hardware components, provides real-time statistics, and offers a collaborative environment for IT teams.

## 🚀 Key Features

- **📊 Advanced Dashboard**: Real-time visualization of stock levels, article types, and critical alerts.
- **📦 Dynamic Inventory**: 
  - Search, filter, and manage thousands of items with ease.
  - Custom category management for Administrators.
  - Define custom product attributes on the fly.
- **⚡ Quick Entry Wizards**: Specialized input wizards for RAM, CPU, and other complex components to ensure data consistency.
- **💬 Team Collaboration**: Integrated chat system for real-time team communication.
- **🌍 Multi-language Support**: Fully translated into **English**, **French**, and **German**.
- **🌗 Dark Mode**: Full support for system-preferred or manual dark/light mode toggling.
- **📥 Import/Export**: Seamlessly handle large datasets with CSV and XLSX support.
- **👥 User Management**: Role-based access control (Admin vs. User) with a dedicated management interface.

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Processing**: [SheetJS (XLSX)](https://sheetjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/it-pro.git
   cd it-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📸 Interface Preview

| Dashboard | Inventory | Category Management |
|-----------|-----------|---------------------|
| ![Dashboard](https://picsum.photos/seed/dash/400/300) | ![Inventory](https://picsum.photos/seed/inv/400/300) | ![Categories](https://picsum.photos/seed/cat/400/300) |

## ⚙️ Configuration

The application uses `localStorage` for data persistence in the current version. You can customize the default product types and locations in `src/constants.ts`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---
