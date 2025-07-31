# Keyboard Shortcuts Implementation Action Plan

## Project Analysis Summary

### Current Architecture
- **Framework**: Vue 3.5 with TypeScript and Composition API
- **State Management**: Pinia stores (`listItems.ts`, `lists.ts`)
- **Routing**: Vue Router with 4 main routes (home, list-detail, profile, test-function)
- **Components**: 
  - `ListsList.vue` - Home page showing all lists
  - `ListDetail.vue` - Individual list view with items
  - `ListItem.vue` - Individual todo item component
  - `AddListItem.vue` - Form for adding new items
  - `ListForm.vue` - Form for creating new lists

### Current User Input Handling
- **AddListItem.vue**: Has keyboard event handling for Enter/Escape keys
- **ListForm.vue**: Basic form submission (no keyboard shortcuts)
- **ListItem.vue**: Click handlers for edit/complete/delete actions
- **ListDetail.vue**: Click handlers for navigation and list deletion

## Required Keyboard Shortcuts

1. **Add Item** - Quick add item to current list
2. **Select and Edit Item** - Navigate and edit items
3. **Complete Item** - Toggle completion status
4. **Create List** - Quick create new list
5. **Delete List** - Delete current list

## Implementation Strategy

### 1. Global Keyboard Event Handler
**Location**: `App.vue` or dedicated composable
**Approach**: Create a global event listener that works across all routes

```typescript
// composables/useKeyboardShortcuts.ts
export const useKeyboardShortcuts = () => {
  const handleKeydown = (event: KeyboardEvent) => {
    // Handle global shortcuts based on current route
  }
}
```

### 2. Context-Aware Shortcuts
**Strategy**: Different shortcuts active based on current route/component
- **Home Route** (`ListsList.vue`): Create list shortcuts
- **List Detail Route** (`ListDetail.vue`): Item management shortcuts

### 3. Proposed Keyboard Mappings

| Action | Shortcut | Context | Implementation |
|--------|----------|---------|----------------|
| Add Item | `Ctrl/Cmd + N` | List Detail page | Focus AddListItem input |
| Create List | `Ctrl/Cmd + Shift + N` | Home page | Open ListForm |
| Complete Item | `Ctrl/Cmd + Enter` | List Detail (with item selected) | Toggle selected item |
| Edit Item | `Enter` or `F2` | List Detail (with item selected) | Enter edit mode |
| Delete List | `Ctrl/Cmd + Shift + D` | List Detail page | Confirm and delete current list |
| Navigate Items | `↑/↓ Arrow Keys` | List Detail page | Select previous/next item |
| Escape | `Escape` | Any form/edit mode | Cancel current action |

## Technical Implementation Plan

### Phase 1: Core Infrastructure ✅
1. **Create Keyboard Shortcuts Composable** ✅
   - File: `src/composables/useKeyboardShortcuts.ts`
   - Handle global event registration/cleanup
   - Route-aware shortcut management

2. **Add Item Selection State** ✅
   - Extend `ListDetail.vue` with item selection state
   - Visual indicators for selected items
   - Keyboard navigation between items

### Phase 2: Shortcut Implementation
1. **Global Shortcuts in App.vue**
   - Import and use keyboard shortcuts composable
   - Handle route-independent shortcuts

2. **List Detail Shortcuts**
   - Item navigation (arrow keys)
   - Add item (Ctrl/Cmd + N)
   - Complete item (Ctrl/Cmd + Enter)
   - Edit item (Enter/F2)
   - Delete list (Ctrl/Cmd + Shift + D)

3. **Home Page Shortcuts**
   - Create list (Ctrl/Cmd + Shift + N)

### Phase 3: Enhanced UX
1. **Visual Feedback**
   - Highlight selected items
   - Show keyboard shortcut hints
   - Focus management

2. **Accessibility**
   - ARIA labels for keyboard navigation
   - Screen reader announcements
   - Focus trap in modals/forms

## File Changes Required

### New Files
- `src/composables/useKeyboardShortcuts.ts` - Main keyboard handling logic
- `src/types/keyboard.ts` - TypeScript interfaces for shortcuts

### Modified Files
- `src/App.vue` - Add global keyboard event handling
- `src/components/ListDetail.vue` - Add item selection state and shortcuts
- `src/components/ListsList.vue` - Add list creation shortcuts
- `src/components/ListItem.vue` - Add selection visual state
- `src/components/AddListItem.vue` - Integrate with global shortcuts
- `src/components/ListForm.vue` - Integrate with global shortcuts

## Implementation Considerations

### Code Quality Standards
- **Declarative approach**: Use computed properties and reactive state
- **Block-bodied functions**: All functions use explicit return statements
- **No nested conditionals**: Use early returns and guard clauses
- **Composable pattern**: Reusable keyboard logic

### Browser Compatibility
- Handle different OS modifier keys (Ctrl vs Cmd)
- Prevent default browser shortcuts when needed
- Test across different browsers

### User Experience
- Non-intrusive shortcuts that don't conflict with browser defaults
- Clear visual feedback for selected states
- Consistent behavior across components
- Graceful fallbacks when shortcuts are disabled

## Testing Strategy
1. **Unit Tests**: Test keyboard event handling logic
2. **Integration Tests**: Test shortcuts in different route contexts
3. **E2E Tests**: Test complete user workflows with keyboard only
4. **Accessibility Tests**: Ensure keyboard navigation works with screen readers

## Success Criteria
- [ ] All 5 required shortcuts implemented and functional
- [ ] Keyboard navigation works seamlessly across all routes
- [ ] Visual feedback clearly indicates selected items
- [ ] No conflicts with existing browser shortcuts
- [ ] Accessible to keyboard-only users
- [ ] Code follows established project standards
