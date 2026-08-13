'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';

interface NotificationContextType {
  notifications: FlashbarProps.MessageDefinition[];
  addNotification: (notification: Omit<FlashbarProps.MessageDefinition, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);

  const addNotification = (notification: Omit<FlashbarProps.MessageDefinition, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id, onDismiss: () => removeNotification(id), dismissible: true };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
