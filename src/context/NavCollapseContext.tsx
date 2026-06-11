import React, { createContext, useContext, useRef } from 'react'
import { Animated } from 'react-native'

interface NavCollapseContextValue {
  isNavCollapsed: React.MutableRefObject<boolean>
  navCollapseAnim: Animated.Value
}

export const NavCollapseContext = createContext<NavCollapseContextValue | null>(null)

export function useNavCollapse() {
  const ctx = useContext(NavCollapseContext)
  if (!ctx) throw new Error('useNavCollapse must be used within NavCollapseProvider')
  return ctx
}

export function NavCollapseProvider({ children }: { children: React.ReactNode }) {
  const isNavCollapsed = useRef(false)
  const navCollapseAnim = useRef(new Animated.Value(0)).current

  return (
    <NavCollapseContext.Provider value={{ isNavCollapsed, navCollapseAnim }}>
      {children}
    </NavCollapseContext.Provider>
  )
}