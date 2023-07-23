import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID || '' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Socrates Protocol',
  projectId: '1973d2d6d4ac3232e66a517904d880e8',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Socrates' Protocol",
  description: 'A new way to verify informations on the web.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
