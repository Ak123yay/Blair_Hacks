"use client";

import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  width?: number;
}

export default function Modal({ children, onClose, width = 540 }: ModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}