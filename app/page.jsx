"use client";

//Crypto imports
import { ethers } from 'ethers';
import CryptoDomains from './abis/CryptoDomains.json';
import config from './config.json';
import { useEffect, useState } from 'react';

//Component imports
import Hero from '../components/hero';

export default function Home() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

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

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account);
    })
  }

  useEffect(() => {
    loadBlockchainData();
  }, []);

  // console.log(domains);
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