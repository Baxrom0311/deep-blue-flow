import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SiteSettings } from '@/types';

// Establish an empty object of type SiteSettings as the default value
const SettingsContext = createContext<SiteSettings>({} as SiteSettings);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data: settings } = useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: api.getSettings,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return <SettingsContext.Provider value={settings || ({} as SiteSettings)}>{children}</SettingsContext.Provider>;
};
