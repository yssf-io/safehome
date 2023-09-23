import axios from "axios";
import { useEffect, useState } from "react";
import { WalletClient, useAccount } from "wagmi";
import { Owner } from "../api/database";
import { ethers, providers } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import { getWalletClient } from "wagmi/actions";
import SafeApiKit from "@safe-global/api-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import { SafeAccountConfig } from "@safe-global/protocol-kit";
import Menu from "./Menu";
import Overview from "./Overview";

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export async function getEthersSigner({ chainId }: { chainId?: number } = {}) {
  const walletClient = await getWalletClient({ chainId });
  if (!walletClient) return undefined;
  return walletClientToSigner(walletClient);
}

const RPC_URL = "https://eth-goerli.public.blastapi.io";

const Dashboard = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [safe, setSafe] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState("Overview");

  const getSafeIfExists = async () => {
    const { data } = await axios.get(`/api/owners/${address}`);

    if (address) {
      const owner = data.owners.find(
        (owner: Owner) => owner.address.toLowerCase() === address.toLowerCase()
      );

      if (owner) setSafe(owner.safe);
      else console.log("no safe found");
    }
  };

  useEffect(() => {
    if (address && !isConnecting && !isDisconnected) {
      setIsConnected(true);
      getSafeIfExists();
    } else {
      setIsConnected(false);
    }
  }, [address]);

  const handleSafeCreation = async () => {
    console.log("creating safe");

    const signer = await getEthersSigner({ chainId: 137 });
    if (!signer) return undefined;

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    });

    const txServiceUrl = "https://safe-transaction-polygon.safe.global";

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter: ethAdapter,
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const safeAccountConfig: SafeAccountConfig = {
      owners: [await signer.getAddress()],
      threshold: 1,
    };

    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });

    const safeAddress = await safeSdkOwner1.getAddress();

    console.log("Your Safe has been deployed:");
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/gor:${safeAddress}`);

    // TODO: save owners + safe to DB, manually for now
    const safe = await axios.post("/api/safes", {
      address: safeAddress,
    });

    const owner = await axios.post("/api/owners", {
      address,
      safe: safeAddress,
    });

    console.log("SafeHome created", safe, owner);
  };

  return (
    <div className="w-full">
      {isConnected && address ? (
        <div>
          {safe ? (
            <div className="flex">
              <Menu tab={tab} setTab={setTab} />
              <Overview />
            </div>
          ) : (
            <div className="text-center mt-20 font-light">
              <p className="text-2xl">
                Looks like you don't have a SafeHome yet
              </p>

              <p
                onClick={handleSafeCreation}
                className="px-8 py-3 cursor-pointer text-3xl bg-blue-500 text-white w-fit m-auto rounded mt-8 hover:bg-blue-400"
              >
                Create a SafeHome
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-20 font-light">
          <p className="text-4xl">Hey there,</p>
          <p className="text-2xl">please connect your wallet</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
