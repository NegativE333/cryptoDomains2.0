"use client";

import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PiCurrencyInr } from 'react-icons/pi';

const Transaction = () => {
  const [domainName, setDomainName] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [Btn, setBtn] = useState("Send");

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
    setBtn("Sending...")
    const validDomain = await cryptoDomains.isDomainTaken(domainName);
    if(validDomain){
      const receiverDomain = await cryptoDomains.getDomainByName(domainName);
      const receiverAddress =receiverDomain.ownerAddress;
      
      const signer = provider.getSigner();

      try{
        let result = await signer.sendTransaction({
          to: receiverAddress,
          value: ethers.utils.parseEther(amountToSend)
        });

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
    setBtn("Send");
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
              className="w-[250px] rounded-md h-[45px] text-center text-zinc-100 bg-transparent border-2 mb-2 mt-2"
              type="text"
              autoFocus
              placeholder="Enter receiver domain name"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
            />
            <input
              className="w-[250px] rounded-md h-[45px] text-zinc-100 text-center bg-transparent border-2 mb-2"
              placeholder="Enter ETH to send"
              value={amountToSend}
              onInput={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                setAmountToSend(numericValue);
              }}
            />
            {amountToSend*148900.04 === 0 ? null : (
              <p className="flex items-center justify-center gap-1 mb-1">
                Approx. {(amountToSend*148900.04).toFixed(3)} <PiCurrencyInr />
              </p>
            )}
            <button
              onClick={() => sendTransaction()}
              className="bg-transparent rounded-xl font-semibold w-[100px]  py-1 border-2 border-white hover:outline-none hover:bg-zinc-100 hover:text-black hover:border-black transition duration-200"
            >
              {Btn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
