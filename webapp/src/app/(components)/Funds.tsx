import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { init, useQuery, useGetTokenBalances } from "@airstack/airstack-react";
import Safe from "@safe-global/protocol-kit";
import { tokenToString } from "typescript";

init("70a71f7ddada4737bd6591343d3c742d");

function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(
    address.length - chars
  )}`;
}

const Funds = ({ safe, safeAddress }: { safe: Safe; safeAddress: string }) => {
  const [fetchData, { data, loading, pagination }] = useGetTokenBalances({
    identitity: safeAddress,
    tokenType: ["ERC20"],
    blockchain: "polygon",
    limit: 200,
  });
  const [sum, setSum] = useState(0);
  const [owners, setOwners] = useState<string[]>([]);
  const [tokens, setTokens] = useState<any>([]);

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
          setTokens([...tokens, token]);
        }
      });
    }
  }, [data]);

  return (
    <div className="border w-full">
      <h1 className="text-4xl px-8 py-4">Funds</h1>

      <div className="flex w-full">
        <div className="border flex w-full ml-8">
          <div className="w-full">
            <h2 className="p-2 text-2xl">Balances</h2>
            {tokens.map((token: any) => (
              <div
                key={token.tokenAddress}
                className="flex justify-evenly items-center border py-2"
              >
                <p className="text-xl">{token.token.symbol}</p>
                <p className="text-xl">{token.formattedAmount}</p>
                <p className="cursor-pointer px-12 py-2 bg-green-400 text-white rounded hover:bg-green-300">
                  Send
                </p>
                <p className="cursor-pointer px-12 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-300">
                  Invest
                </p>
              </div>
            ))}
          </div>

          <div className="flex w-full">
            <div className="border w-3/4 ml-8">
              <h2 className="p-2 text-2xl">Receive</h2>
              <div className="m-auto w-fit border text-center">
                <img
                  src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${safeAddress}&choe=UTF-8`}
                  alt="safe address qr code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funds;
