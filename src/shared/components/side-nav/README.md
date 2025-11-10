# Side Navigation Component

JSON-driven navigation menu for the application.

## Configuration

The menu structure is defined in `menu-config.json`. This makes it easy to add, remove, or modify menu items without changing the component code.

### Structure

```json
{
  "staticMenuItems": [...],      // Top-level static menu items (e.g., Home)
  "moduleSubmenus": {...},       // Dynamic module-specific submenus
}
```

### Module Submenu Configuration

Each module can have:
- **items**: Array of menu items
- **sections**: Array of grouped items with section headers

#### Item Properties

- `id`: Unique identifier
- `name`: Display name
- `path`: Navigation path
- `icon`: Bootstrap icon name (without `bi-` prefix)
- `iconColor`: Optional color class (e.g., "primary", "danger")
- `keywords`: Array of search keywords for filtering
- `indent`: Boolean, if true adds extra left padding
- `children`: Array of child items (for nested menus)
- `permission`: Optional permission requirement (e.g., "users.read"). Menu item will be hidden if user lacks this permission.

#### Section Properties

- `id`: Unique identifier
- `title`: Section header text
- `keywords`: Array of search keywords for filtering
- `items`: Array of menu items in this section

### Example: Adding a New Module

```json
"mymodule": {
  "items": [
    {
      "id": "mymodule-dashboard",
      "name": "Dashboard",
      "path": "/mymodule/dashboard",
      "icon": "speedometer2",
      "iconColor": "primary",
      "keywords": ["dashboard"],
      "permission": "mymodule.read"
    }
  ],
  "sections": [
    {
      "id": "settings",
      "title": "SETTINGS",
      "keywords": ["settings", "config"],
      "items": [
        {
          "id": "mymodule-settings",
          "name": "Settings",
          "path": "/mymodule/settings",
          "icon": "gear",
          "keywords": ["settings"],
          "permission": "mymodule.manage"
        }
      ]
    }
  ]
}
```

### Permission-Based Menu Filtering

Menu items can be configured with a `permission` property. The side-nav component automatically hides menu items when users lack the required permission:

```javascript
// This menu item will only show if user has "users.read" permission
{
  "id": "users",
  "name": "Users",
  "path": "/users",
  "icon": "people",
  "permission": "users.read"
}
```

**How it works:**
1. When rendering, the component checks each item's `permission` property
2. Uses `hasPermission(entity, action)` from CASL service
3. Automatically hides items where permission check fails
4. No additional code needed - just add the permission property

**Permission Format:**
- Use dot notation: `"entity.action"`
- Examples: `"users.read"`, `"roles.create"`, `"security.manage"`
- Matches the same permissions used in route protection

### Benefits

1. **Easy Maintenance**: Update menu structure without touching component code
2. **Consistent Filtering**: All menu items use the same keyword-based filtering
3. **Permission-Based**: Menu items automatically hidden based on user permissions
4. **Reusable**: Same configuration format for all modules
5. **Type Safety**: Can be validated against a JSON schema
6. **Scalable**: Easy to add new modules or menu items
7. **Secure**: Menu reflects actual user capabilities

## Usage

The component automatically renders menu items based on:
- `userModules` property (determines which modules to show)
- `expandedModules` property (determines which modules are expanded)
- `menuFilter` property (filters items based on keywords)

No code changes needed when adding new menu items - just update `menu-config.json`.
