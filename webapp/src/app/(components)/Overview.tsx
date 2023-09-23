import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { init, useQuery, useGetTokenBalances } from "@airstack/airstack-react";
import Safe from "@safe-global/protocol-kit";

init("70a71f7ddada4737bd6591343d3c742d");

function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

const Overview = ({
  safe,
  safeAddress,
}: {
  safe: Safe;
  safeAddress: string;
}) => {
  const [fetchData, { data, loading, pagination }] = useGetTokenBalances({
    identitity: safeAddress,
    tokenType: ["ERC20"],
    blockchain: "polygon",
    limit: 200,
  });
  const [sum, setSum] = useState(0);
  const [owners, setOwners] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
    safe.getOwners().then((owners) => setOwners(owners));
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data.TokenBalances.TokenBalance);
      if (data.TokenBalances.TokenBalance === null) return;
      data.TokenBalances.TokenBalance.map((token: any) => {
        if (
          token.tokenAddress.toLowerCase() ===
          "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174".toLowerCase()
        ) {
          console.log("found usdc");
          setSum(token.formattedAmount);
        }
      });
    }
  }, [data]);

  return (
    <div className="border w-full">
      <h1 className="text-4xl px-8 py-4">Overview</h1>

      <div className="flex">
        <div className="border w-1/4 ml-8">
          <h2 className="p-2 text-2xl">Funds</h2>
          <p className="text-center text-3xl w-4/5 m-auto pb-2 border-b-2">
            ${sum}
          </p>

          <h2 className="p-2 text-2xl">Latest transactions</h2>
        </div>

        <div className="border w-1/4 ml-8">
          <h2 className="p-2 text-2xl">Entrance</h2>
          <h3 className="p-2 text-xl pl-4">Owners</h3>
          {owners.map((owner) => (
            <h3 key={owner} className="px-2 text-lg pl-6">
              {shortenAddress(owner)}
            </h3>
          ))}

          <h3 className="p-2 text-xl pl-4">Keys</h3>
          <h3 className="px-2 text-lg pl-6">No keys yet</h3>
        </div>
      </div>

      <div className="border w-1/4 ml-8 mt-8">
        <h2 className="p-2 text-2xl">Rental</h2>
        <h3 className="p-2 text-xl pl-4">Pending</h3>
        <h3 className="px-2 text-lg pl-6">Alice (0xAlice)</h3>
        <h3 className="px-2 text-lg pl-6">Bob (0xBob)</h3>

        <h3 className="p-2 text-xl pl-4">Confirmed</h3>
        <h3 className="px-2 text-lg pl-6">0xSomeOtherAddress</h3>
      </div>
    </div>
  );
};

export default Overview;
