export {};

declare global {
  interface Window {
    app: {
      signIn: () => void;
      signOut: () => void;
      getUser: () => Promise<string | null>;
      onAuthStateChanged: (callback: (userId: string | null) => void) => () => void;
    };
  }
}
