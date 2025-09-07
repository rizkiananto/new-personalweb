"use client"
import { createContext } from 'react';
import { IRootContext } from '@/types';

export const RootContext = createContext<IRootContext | null>(null);