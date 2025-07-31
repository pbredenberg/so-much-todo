export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface ShortcutHandler {
  shortcut: KeyboardShortcut;
  handler: (event: KeyboardEvent) => void;
  context?: string;
  description?: string;
}

export interface KeyboardShortcutContext {
  route: string;
  activeShortcuts: ShortcutHandler[];
}

export type ShortcutAction = 
  | 'add-item'
  | 'create-list'
  | 'complete-item'
  | 'edit-item'
  | 'delete-list'
  | 'navigate-up'
  | 'navigate-down'
  | 'escape';
