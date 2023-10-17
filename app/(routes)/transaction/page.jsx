"use client";

//Crypto imports
import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Transaction = () => {
  const [domainName, setDomainName] = useState("");
  const [amountToSend, setAmountToSend] = useState("");

  const [account, setAccount] = useState(null);
  const router = useRouter();

  const connection = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  const [provider, setProvider] = useState(null);
  const [cryptoDomains, setCryptoDomains] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const cryptoDomains = new ethers.Contract(
      config[network.chainId].CryptoDomains.address,
      CryptoDomains,
      provider
    );
    setCryptoDomains(cryptoDomains);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  useEffect(() => {
    connection();
    router.refresh();
  }, [account]);

  async function sendTransaction() {
    const validDomain = await cryptoDomains.isDomainTaken(domainName);
    if(validDomain){
      const receiverDomain = await cryptoDomains.getDomainByName(domainName);
      const receiverAddress =receiverDomain.ownerAddress;
      let params = [{
          from: account,
          to: receiverAddress,
          gas: Number(21000).toString(16),
          gasPrice: Number(5000000000).toString(16),
          value: ethers.utils.parseEther(amountToSend).toString(),
      }]
  
      try{
        let result = await window.ethereum.request({method: "eth_sendTransaction", params})
        setDomainName("");
        setAmountToSend("");
        toast.success("Transaction initiated.");
      }
      catch(error){
        toast.error("Transaction failed.");
        console.log(error);
      }
    }
    else{
      toast.error("Invalid domain name.");
    }
  }

  return (
    <div className="w-full h-[100vh] bg-[url('/images/layer6.svg')] bg-no-repeat bg-cover flex gap-16">
      <div className="w-full h-[100vh] bg-[url('/images/layer3.svg')] bg-no-repeat bg-cover flex justify-center text-white">
        <div className=" flex flex-col gap-4 mt-44">
          <h2 className="font-subTitle font-semibold text-2xl lg:text-3xl text-center">
            Make transaction using crypto domain
          </h2>
          <div className="flex flex-col items-center gap-2">
            <input
              className="w-[250px] rounded-md h-[35px] p-2 text-slate-600 text-center"
              type="text"
              placeholder="Enter receiver domain name"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
            />
            <input
              className="w-[250px] rounded-md h-[35px] p-2 text-slate-600 text-center"
              type="text"
              placeholder="Enter ETH to send"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
            />
            <button
              onClick={() => sendTransaction()}
              className="bg-zinc-200 rounded-xl text-black font-semibold w-[100px] hover:bg-zinc-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
