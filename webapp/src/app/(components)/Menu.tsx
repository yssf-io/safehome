import { Dispatch, SetStateAction, useState } from "react";

const tabs = ["Overview", "Funds", "Entrance", "Rental", "Settings"];

const Menu = ({
  tab,
  setTab,
}: {
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="border-2 w-fit min-h-screen">
      <h1 className="text-4xl px-16 py-4 border-b">SafeHome</h1>
      <ul className="p-4">
        {tabs.map((t) => (
          <li
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer text-2xl my-6 ${
              tab === t ? "font-bold" : ""
            }`}
          >
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
