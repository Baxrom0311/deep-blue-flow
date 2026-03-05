import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

const SettingsContext = createContext<any>({});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return <SettingsContext.Provider value={settings || {}}>{children}</SettingsContext.Provider>;
};
