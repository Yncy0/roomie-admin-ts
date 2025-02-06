import React, { useEffect, useState } from "react";
import "@/styles/alert.css";

interface AlertProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number; // Auto-hide after X milliseconds
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type = "info", message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`alert ${type}`}>
      <p>{message}</p>
      <button className="close-btn" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Alert;
