"use client";

//Crypto imports
import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

//React imports
import { useEffect, useState } from "react";

//Component imports
import CheckDomainAvailable from "../../../components/check-domain-available";
import DomainCard from "../../../components/domain-card";

const BuyDomains = () => {
  const [provider, setProvider] = useState(null);
  const [cryptoDomains, setCryptoDomains] = useState(null);
  const [domains, setDomains] = useState([]);

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

  return (
    <div className="w-full h-[100vh] bg-[url('/images/layer5.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row lg:gap-16">
      <div className="lg:w-[50%] flex justify-center lg:mt-48 mt-24">
        <CheckDomainAvailable
          cryptoDomains={cryptoDomains}
          provider={provider}
        />
      </div>
      <div className="pl-4 pr-8 mt-8 lg:w-[35%] flex items-center justify-center flex-col">
        <div className="text-white text-xl font-domain p-2">
          Prelisted Domains
        </div>
        {domains.map((domain, i) => (
          <DomainCard
            key={i}
            domain={domain}
            cryptoDomains={cryptoDomains}
            provider={provider}
            id={i + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default BuyDomains;
