import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Dashboard = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (address && !isConnecting && !isDisconnected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [address]);

  return (
    <div className="w-full">
      {isConnected && address ? (
        <div>
          <p>Dashboard goes here</p>
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
