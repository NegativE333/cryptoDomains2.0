"use client";

import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Sale = () => {
  const [provider, setProvider] = useState(null);
  const [cryptoDomains, setCryptoDomains] = useState(null);
  const [domains, setDomains] = useState([]);
  const [domainName, setDomainName] = useState("");
  const [domainPrice, setDomainPrice] = useState("");

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

    const maxSupply = await cryptoDomains.maxSupply();
    const domains = [];

    for (var i = 1; i <= maxSupply; i++) {
      const domain = await cryptoDomains.getDomain(i);
      domains.push(domain);
    }

    setDomains(domains);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const tokens = (n) => {
    // eslint-disable-next-line 
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

  const handleListDomainForSale = async () => {
    try{
        const signer = await provider.getSigner()
        const domainId = await cryptoDomains.getDomainIdByName(domainName);
        const transaction = await cryptoDomains.connect(signer).listDomainForSale(domainId, tokens(domainPrice))
        await transaction.wait()
        setDomainName("");
        setDomainPrice("");
        toast.success("Domain listed for sale.")
    }
    catch(error){
        toast.error("Domain must be owned by you.");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-[url('/images/layer7.svg')] bg-no-repeat bg-cover flex justify-center text-white">
      <div className=" flex flex-col gap-4 mt-44">
        <h2 className="font-subTitle font-semibold text-2xl lg:text-3xl text-center">
          List a domain for sale
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
            onClick={() => handleListDomainForSale()}
            className="bg-zinc-200 rounded-xl text-black font-semibold w-[100px] hover:bg-zinc-300"
          >
            List for sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sale;
