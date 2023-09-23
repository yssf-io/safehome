"use client";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";
import Dashboard from "./(components)/Dashboard";

const chains = [arbitrum, mainnet, polygon];
const projectId = "1b02254489e1baf6c7e25adbacd8a731";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function Home() {
  return (
    <div>
      <WagmiConfig config={wagmiConfig}>
        <main className="">
          <div className="absolute top-5 right-5">
            <Web3Button />
          </div>

          <Dashboard />
        </main>
      </WagmiConfig>

      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
}
