import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import type { ShortcutHandler, KeyboardShortcut } from '../types/keyboard';

export const useKeyboardShortcuts = () => {
  const route = useRoute();
  const registeredShortcuts = ref<ShortcutHandler[]>([]);
  const isEnabled = ref(true);

  const isModifierMatch = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const expectedCtrl = shortcut.ctrlKey ?? false;
    const expectedMeta = shortcut.metaKey ?? false;
    const expectedShift = shortcut.shiftKey ?? false;
    const expectedAlt = shortcut.altKey ?? false;

    // On Mac, Cmd key is metaKey, on Windows/Linux it's ctrlKey
    const actualCtrlOrMeta = isMac ? event.metaKey : event.ctrlKey;
    const expectedCtrlOrMeta = isMac ? expectedMeta : expectedCtrl;

    return (
      actualCtrlOrMeta === expectedCtrlOrMeta &&
      event.shiftKey === expectedShift &&
      event.altKey === expectedAlt
    );
  };

  const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const modifierMatch = isModifierMatch(event, shortcut);
    
    return keyMatch && modifierMatch;
  };

  const shouldIgnoreEvent = (event: KeyboardEvent): boolean => {
    const target = event.target as HTMLElement;
    const tagName = target.tagName.toLowerCase();
    const isInput = tagName === 'input' || tagName === 'textarea';
    const isContentEditable = target.contentEditable === 'true';
    
    return isInput || isContentEditable;
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (!isEnabled.value) {
      return;
    }

    if (shouldIgnoreEvent(event)) {
      return;
    }

    const currentRoute = route.name as string;
    
    for (const shortcutHandler of registeredShortcuts.value) {
      const contextMatch = !shortcutHandler.context || shortcutHandler.context === currentRoute;
      
      if (contextMatch && matchesShortcut(event, shortcutHandler.shortcut)) {
        event.preventDefault();
        event.stopPropagation();
        shortcutHandler.handler(event);
        return;
      }
    }
  };

  const registerShortcut = (handler: ShortcutHandler): void => {
    registeredShortcuts.value.push(handler);
  };

  const unregisterShortcut = (handler: ShortcutHandler): void => {
    const index = registeredShortcuts.value.indexOf(handler);
    if (index > -1) {
      registeredShortcuts.value.splice(index, 1);
    }
  };

  const clearShortcuts = (): void => {
    registeredShortcuts.value = [];
  };

  const enable = (): void => {
    isEnabled.value = true;
  };

  const disable = (): void => {
    isEnabled.value = false;
  };

  const getActiveShortcuts = (): ShortcutHandler[] => {
    const currentRoute = route.name as string;
    return registeredShortcuts.value.filter(handler => {
      return !handler.context || handler.context === currentRoute;
    });
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
  });

  return {
    registerShortcut,
    unregisterShortcut,
    clearShortcuts,
    enable,
    disable,
    isEnabled,
    getActiveShortcuts,
  };
};
