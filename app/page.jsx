"use client";

//Crypto imports
import { ethers } from 'ethers';
import CryptoDomains from './abis/CryptoDomains.json';
import config from './config.json';

//React imports
import { useEffect, useState } from 'react';

//Component imports
import Hero from '../components/hero';
import { ImSpinner9 } from 'react-icons/im';

export default function Home() {
  const [provider, setProvider] = useState(null)

  const [cryptoDomains, setCryptoDomains] = useState(null);
  const [domains, setDomains] = useState([])

  const loadBlockchainData = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider);

    const network = await provider.getNetwork();
    const cryptoDomains = new ethers.Contract(config[network.chainId].CryptoDomains.address, CryptoDomains, provider)
    setCryptoDomains(cryptoDomains);

    const maxSupply = await cryptoDomains.maxSupply()
    const domains = []

    for(var i = 1; i<=maxSupply; i++){
      const domain = await cryptoDomains.getDomain(i)
      domains.push(domain);
    }

    setDomains(domains);
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);

  if(!cryptoDomains){
    return(
      <div className="w-full h-[100vh] bg-[url('/images/layer2.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row lg:gap-24 items-center">
        <div className='w-full flex items-center justify-center'>
          <ImSpinner9 className='text-4xl text-white animate-spin transition duration-1000'/>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Hero 
        domains={domains} 
        cryptoDomains={cryptoDomains} 
        provider={provider}
      />
    </div>
  )
}
