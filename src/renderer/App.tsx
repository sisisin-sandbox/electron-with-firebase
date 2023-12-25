import React from 'react';

export const App = () => {
  const [user, setUser] = React.useState<string | null>(null);

  React.useEffect(() => {
    window.app.getUser().then((userId) => {
      setUser(userId);
    });
  }, []);
  React.useEffect(() => {
    const unsubscribe = window.app.onAuthStateChanged((userId) => {
      setUser(userId);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h3>Electron with firebase-auth</h3>
      {user == null ? (
        <>
          <button onClick={() => window.app.signIn()}>Sign In</button>
        </>
      ) : (
        <>
          <div>hello, {user}</div>
          <button onClick={() => window.app.signOut()}>sign out</button>
        </>
      )}
    </div>
  );
};
