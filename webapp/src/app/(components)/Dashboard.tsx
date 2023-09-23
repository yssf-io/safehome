import axios from "axios";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Owner } from "../api/database";

const Dashboard = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isConnected, setIsConnected] = useState(false);
  const [safe, setSafe] = useState<string | undefined>(undefined);

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

  return (
    <div className="w-full">
      {isConnected && address ? (
        <div>
          {safe ? (
            <div>Dashboard goes here</div>
          ) : (
            <div className="text-center mt-20 font-light">
              <p className="text-2xl">
                Looks like you don't have a SafeHome yet
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
