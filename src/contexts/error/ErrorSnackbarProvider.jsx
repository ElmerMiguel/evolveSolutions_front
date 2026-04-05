import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ErrorSnackbar from "../../components/utils/ErrorSnackbar/ErrorSnackbar.jsx";

const ErrorSnackbarContext = createContext(null);

export function ErrorSnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(5000);
  const [error, setError] = useState(true);

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showError = useCallback((msg, dur = 5000) => {
    clearTimer();
    setMessage(String(msg));
    setDuration(dur);
    setOpen(true);
    setError(true);
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, dur);
  }, []);

  const showSuccess = useCallback((msg, dur = 5000) => {
    clearTimer();
    setMessage(String(msg));
    setDuration(dur);
    setOpen(true);
    setError(false);
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, dur);
  }, []);

  const handleClose = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, []);

  const errorContextValue = {
    showError,
    showSuccess,
  }

  return (
    <ErrorSnackbarContext.Provider value={ errorContextValue }>
      {children}
      <ErrorSnackbar open={open} message={message} duration={duration} onClose={handleClose} isError={error} />
    </ErrorSnackbarContext.Provider>
  );
}

export function useErrorSnackbar() {
  const ctx = useContext(ErrorSnackbarContext);
  if (!ctx) {
    throw new Error('useErrorSnackbar must be used within ErrorSnackbarProvider');
  }
  return ctx;
}
