import { Dispatch, SetStateAction, useState } from "react";

const Overview = () => {
  return (
    <div className="border w-full">
      <h1 className="text-4xl px-8 py-4">Overview</h1>

      <div className="flex">
        <div className="border w-1/4 ml-8">
          <h2 className="p-2 text-2xl">Funds</h2>
          <p className="text-center text-xl w-4/5 m-auto pb-2 border-b-2">
            Sum here
          </p>

          <h2 className="p-2 text-2xl">Latest transactions</h2>
        </div>

        <div className="border w-1/4 ml-8">
          <h2 className="p-2 text-2xl">Entrance</h2>
          <h3 className="p-2 text-xl pl-4">Owners</h3>
          <h3 className="px-2 text-lg pl-6">Alice (0xAlice)</h3>
          <h3 className="px-2 text-lg pl-6">Bob (0xBob)</h3>

          <h3 className="p-2 text-xl pl-4">Keys</h3>
          <h3 className="px-2 text-lg pl-6">0xSomeOtherAddress</h3>
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
