# BINGO Admin Portal

A high-performance, component-based admin dashboard for managing BINGO game operations.

## 🏗️ Architecture Overview

The admin portal is built with a modern, component-based architecture that prioritizes:

- **High Performance**: Optimized rendering and state management
- **Clean Code**: Reusable components with clear separation of concerns
- **Maintainability**: Modular structure for easy updates and extensions
- **Consistency**: Unified design system with Tailwind CSS

## 📁 Project Structure

```
admin/src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Dashboard page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Login page
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   │   └── LoginForm.tsx
│   ├── dashboard/        # Dashboard-specific components
│   │   └── DashboardOverview.tsx
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── sections/         # Section-specific components
│   │   ├── ShopOwnersSection.tsx
│   │   ├── ShopsSection.tsx
│   │   └── CashiersSection.tsx
│   └── ui/               # Generic UI components
│       ├── StatCard.tsx
│       └── LoadingSpinner.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication logic
│   └── useDashboard.ts   # Dashboard data management
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Key Features

### Component-Based Architecture
- **Reusable Components**: Each UI element is a separate, reusable component
- **Props Interface**: Strongly typed props for better development experience
- **Consistent Styling**: Unified design system using Tailwind CSS

### Performance Optimizations
- **Custom Hooks**: Efficient state management with custom hooks
- **Lazy Loading**: Components load only when needed
- **Optimized Rendering**: Minimal re-renders with proper state management

### Authentication System
- **Secure Login**: Token-based authentication
- **Route Protection**: Automatic redirect for unauthenticated users
- **Session Management**: Persistent login state

### Dashboard Features
- **Real-time Stats**: Live game statistics and metrics
- **User Management**: Complete CRUD operations for users
- **Shop Management**: Manage shop owners and locations
- **Cashier Management**: Handle cashier accounts and permissions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd admin
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 🎨 Design System

### Color Palette
- **Primary**: Green theme (`green-50` to `green-700`)
- **Success**: Green variants
- **Error**: Red variants
- **Neutral**: Gray scale

### Component Patterns
- **Cards**: Rounded corners (`rounded-2xl`) with green borders
- **Buttons**: Consistent green theme with hover states
- **Forms**: Left-aligned, compact styling
- **Modals**: Soft green background with consistent spacing

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, consistent sizing
- **Labels**: Medium weight for form elements

## 🔧 Custom Hooks

### useAuth
Manages authentication state and user session:
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### useDashboard
Handles dashboard data and loading states:
```typescript
const { stats, isLoading, error, refreshData } = useDashboard();
```

## 📊 Dashboard Sections

### Overview
- Total Games, Active Games, Total Players, Revenue
- Real-time statistics with trend indicators
- Responsive grid layout

### Shop Owners Management
- List all shop owners
- Add/Edit/Delete operations
- Status management (active/inactive)

### Shops Management
- Shop information and locations
- Owner assignments
- Cashier count tracking

### Cashiers Management
- Cashier accounts and permissions
- Shop assignments
- Login tracking

## 🛠️ Development Guidelines

### Component Creation
1. Create component in appropriate directory
2. Define TypeScript interfaces for props
3. Use consistent Tailwind classes
4. Add proper error handling
5. Include loading states

### State Management
- Use custom hooks for complex state
- Keep components focused and single-purpose
- Implement proper error boundaries

### Styling
- Follow the green theme consistently
- Use Tailwind utility classes
- Maintain responsive design
- Ensure accessibility

## 🔒 Security Considerations

- Token-based authentication
- Route protection
- Input validation
- XSS prevention
- CSRF protection

## 📈 Performance Features

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Built-in Next.js optimization
- **Caching**: Strategic caching for static assets
- **Bundle Analysis**: Optimized bundle sizes

## 🧪 Testing Strategy

- Unit tests for components
- Integration tests for hooks
- E2E tests for critical flows
- Performance monitoring

## 📝 API Integration

The admin portal is designed to integrate with RESTful APIs:
- Environment-based configuration
- Proper error handling
- Loading states
- Retry mechanisms

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=your_api_url
NEXT_PUBLIC_APP_NAME=BINGO Admin
```

### Build Optimization
- Tree shaking for unused code
- Minification and compression
- CDN integration for static assets

## 🤝 Contributing

1. Follow the component-based architecture
2. Maintain consistent styling
3. Add proper TypeScript types
4. Include error handling
5. Test thoroughly before PR

## 📄 License

This project is part of the BINGO2025 system.
