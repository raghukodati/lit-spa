/**
 * Context class - Base class for all contexts
 */
export class Context {
  constructor(key, defaultValue = null) {
    this.key = key;
    this._value = defaultValue;
    this._listeners = new Set();
  }

  /**
   * Get current context value
   */
  get value() {
    return this._value;
  }

  /**
   * Set context value and notify listeners
   */
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._notifyListeners();
    }
  }

  /**
   * Subscribe to context changes
   */
  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * Notify all subscribers of changes
   */
  _notifyListeners() {
    this._listeners.forEach(listener => listener(this._value));
  }
}

/**
 * Create a new context
 */
export function createContext(key, defaultValue = null) {
  return new Context(key, defaultValue);
}

/**
 * Context Provider Mixin
 * Allows components to provide context to children
 */
export const ContextProvider = (superClass) => {
  return class extends superClass {
    constructor() {
      super();
      this._contexts = new Map();
    }

    /**
     * Provide a context value
     */
    provideContext(context, value) {
      if (!this._contexts.has(context)) {
        this._contexts.set(context, context);
      }
      context.value = value;
    }

    /**
     * Get provided context
     */
    getProvidedContext(context) {
      return this._contexts.get(context)?.value;
    }
  };
};

/**
 * Context Consumer Mixin
 * Allows components to consume context from ancestors
 */
export const ContextConsumer = (superClass) => {
  return class extends superClass {
    constructor() {
      super();
      this._contextSubscriptions = new Map();
    }

    /**
     * Consume a context value
     * Automatically subscribes to updates
     */
    consumeContext(context, callback) {
      // Unsubscribe from previous subscription if exists
      if (this._contextSubscriptions.has(context)) {
        this._contextSubscriptions.get(context)();
      }

      // Subscribe to context changes
      const unsubscribe = context.subscribe((value) => {
        if (callback) {
          callback(value);
        }
        this.requestUpdate();
      });

      this._contextSubscriptions.set(context, unsubscribe);
      return context.value;
    }

    /**
     * Cleanup subscriptions when component disconnects
     */
    disconnectedCallback() {
      super.disconnectedCallback?.();
      this._contextSubscriptions.forEach(unsubscribe => unsubscribe());
      this._contextSubscriptions.clear();
    }
  };
};

/**
 * Helper function to create a context with type info
 */
export function defineContext(key, defaultValue = null) {
  return createContext(key, defaultValue);
}

export default {
  Context,
  createContext,
  defineContext,
  ContextProvider,
  ContextConsumer
};
