import "./globals.js";
import "react-native-get-random-values";
import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { HDAccount, createWalletClient, http } from "viem";
import { mainnet } from "viem/chains";
import { mnemonicToAccount, english, generateMnemonic } from "viem/accounts";
import axios from "axios";

const CONNECTED_SAFE = "0xCDceCF435EA89e5BF5652696BfE9755eEcB1D1db";

const client = createWalletClient({
  chain: mainnet,
  transport: http(),
});

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export default function App() {
  const [wallet, setWallet] = useState<HDAccount | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const mnemonic = await SecureStore.getItemAsync("wallet");
      if (mnemonic) {
        setWallet(mnemonicToAccount(mnemonic));
      } else {
        const newMnemonic = generateMnemonic(english);
        await save("wallet", newMnemonic);
        setWallet(mnemonicToAccount(newMnemonic));
      }
    })();
  }, []);

  const handleUnlock = async () => {
    console.log("unlocking");

    const signature = await wallet?.signMessage({ message: "unlocking door" });
    console.log({ signature });

    try {
      const res = await axios.post("http://172.20.10.8:3000/api/signatures", {
        safe: CONNECTED_SAFE,
        signature,
      });
      console.log({ res });
    } catch (e) {
      console.log({ e });
    }
  };

  return (
    <View className="h-screen">
      <View className="m-auto">
        <TouchableOpacity onPress={handleUnlock}>
          <View className="m-auto p-8 mb-2 rounded-full bg-green-400">
            <Text className="text-center text-4xl text-white">
              Unlock SafeHome
            </Text>
          </View>
        </TouchableOpacity>
        <View className="w-3/4 m-auto mt-2">
          <Text className="text-lg text-center text-black">
            {wallet?.address}
          </Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
