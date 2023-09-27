"use client";

//Crypto imports
import { ethers } from 'ethers';
import CryptoDomains from '../../abis/CryptoDomains.json';
import config from '../../config.json';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ListDomains = () => {
  const [domainName, setDomainName] = useState("");
  const [domainPrice, setDomainPrice] = useState("");

  const router = useRouter();

  const [account, setAccount] = useState(null);

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

    const tokens = (n) => {
        // eslint-disable-next-line 
        return ethers.utils.parseUnits(n.toString(), 'ether')
    }

  const listDomain = async () => {
    try {
        const isDomainExists = await cryptoDomains.isDomainListed(domainName);
        if(!isDomainExists){
            const signer = await provider.getSigner()
            const transaction = await cryptoDomains.connect(signer).list(domainName, tokens(domainPrice))
            await transaction.wait()
            toast.success("Domain listed.")
            router.refresh();
        }
        else{
            toast.error(`${domainName} already exists.`)
        }
    } 
    catch (error) {
        toast.error("Something went wrong.");
        console.log(error);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [account]);

  useEffect(() => {
    connection();
    router.refresh();
  }, [account]);

  return (
    <div className="w-full h-[100vh] bg-[url('/images/layer3.svg')] bg-no-repeat bg-cover flex justify-center text-white">
      <div className=" flex flex-col gap-4 mt-44">
        <h2 className="font-subTitle font-semibold text-3xl text-center">
          List a domain
        </h2>
        <div className="flex flex-col items-center gap-2">
          <input
            className="w-[250px] rounded-md h-[35px] p-2 text-slate-600 text-center"
            type="text"
            placeholder="Enter domain name"
            value={domainName}
            onChange={(e) => setDomainName(e.target.value)}
          />
          <input
            className="w-[250px] rounded-md h-[35px] p-2 text-slate-600 text-center"
            type="text"
            placeholder="Enter domain price"
            value={domainPrice}
            onChange={(e) => setDomainPrice(e.target.value)}
          />
          <button
            onClick={() => listDomain()}
            className="bg-zinc-200 rounded-xl text-black font-semibold w-[100px] hover:bg-zinc-300"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListDomains;
