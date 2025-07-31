# So Much Todo - Vue 3 Todo List App

A modern, feature-rich todo list application built with Vue 3, TypeScript, Vite, and Pinia for state management. The app provides a clean, responsive interface for managing multiple todo lists with localStorage persistence.

## Features

- ✅ **Multiple Todo Lists** - Create and manage multiple lists with descriptions and due dates
- ✅ **Item Management** - Add, edit, delete, and mark items as complete
- ✅ **Persistent Storage** - All data automatically saved to localStorage
- ✅ **Modern UI** - Clean, responsive design with smooth animations
- ✅ **User Profiles** - Manage user information and profile settings
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Pinia State Management** - Robust state management with automatic persistence

## Tech Stack

- **Vue 3.5** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server
- **Pinia** - State management with localStorage persistence
- **Vue Router 4** - Client-side routing
- **UUID** - Unique ID generation

## Prerequisites

- **Node.js 22+** - Required for development
- **NVM (Node Version Manager)** - Recommended for managing Node versions

### Installing NVM

**macOS/Linux:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

**Windows:**
Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

### Setting up Node.js with NVM

```bash
# Install Node.js 22
nvm install 22

# Use Node.js 22
nvm use 22

# Set as default (optional)
nvm alias default 22
```

## Project Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd so-much-todo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linting (if configured)

## Project Structure

```dir
src/
├── components/          # Vue components
│   ├── AddListItem.vue
│   ├── ListDetail.vue
│   ├── ListForm.vue
│   ├── ListItem.vue
│   ├── ListsList.vue
│   └── UserProfile.vue
├── stores/             # Pinia stores
│   ├── index.ts
│   ├── listItems.ts
│   ├── lists.ts
│   └── user.ts
├── router/             # Vue Router configuration
│   └── index.ts
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles
```

## Development Guidelines

### Before Opening a PR

1. **Test the build locally**

   ```bash
   npm run build
   ```

   Ensure the build completes successfully without errors.

2. **Run linting** (if configured)

   ```bash
   npm run lint
   ```

3. **Test functionality**
   - Create and manage todo lists
   - Add, edit, and delete items
   - Test localStorage persistence
   - Verify responsive design on different screen sizes

### Code Quality

- Follow TypeScript best practices
- Use Vue 3 Composition API with `<script setup>`
- Maintain consistent styling with CSS custom properties
- Write descriptive commit messages

## Data Models

### User

- `userName: string`
- `profileUrl: string`

### List

- `id: string` (UUID)
- `name: string`
- `description: string`
- `dueDate: string | null`

### ListItem

- `id: string` (UUID)
- `listId: string`
- `name: string`
- `isComplete: boolean`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test the build (`npm run build`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License.
