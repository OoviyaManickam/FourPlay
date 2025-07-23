'use client'

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'next-reown-appkit',
  description: 'next-reown-appkit',
  url: 'https://github.com/0xonerb/next-reown-appkit-ssr', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  metadata,
  themeMode: 'light',
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  
//   themeVariables: {
//     "--w3m-accent": "#8A2BE2",               // primary accent
//     "--w3m-color-mix": "#00BB7F",           // color blending
//     "--w3m-color-mix-strength": 40,
//     "--w3m-font-family": "Bungee, cursive",  // use Bungee font
//     // "--w3m-font-size-master": "10px",
//     // "--w3m-border-radius-master": "8px",
//     // // "--w3m-z-index": 1000,
//     // // "--w3m-font-color": "violet"           // custom var for text color
//   }

themeVariables: {
    "--w3m-accent": "#7F5AF0",               // primary accent
    // "--w3m-color-mix": "#00BB7F",           // color blending
    // "--w3m-color-mix-strength": 40,
    "--w3m-font-family": "Bungee, cursive",  // use Bungee font
  
    "--w3m-border-radius-master": "8px",
    
          // custom var for text color
  }

})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider