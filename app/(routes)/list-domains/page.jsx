"use client";

//Crypto imports
import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

//React imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PiCurrencyInr } from 'react-icons/pi';

//Const imports
import { fetchEthPriceInInr } from '../../../const/inrFetcher';

const ListDomains = () => {
  const [domainName, setDomainName] = useState("");
  const [domainPrice, setDomainPrice] = useState("");
  const [Btn, setBtn] = useState("List");
  const [ethPriceInInr, setEthPriceInInr] = useState(null);

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
    return ethers.utils.parseUnits(n.toString(), "ether");
  };

  const listDomain = async () => {
    try {
      setBtn("Listing...");
      if (isDomainValid(domainName)) {
        const isDomainExists = await cryptoDomains.isDomainListed(domainName);
        if (!isDomainExists) {
          toast.loading("Opening MataMask...", { duration : 2500 });
          const signer = await provider.getSigner();
          const transaction = await cryptoDomains
            .connect(signer)
            .list(domainName, tokens(domainPrice));
          await transaction.wait();
          toast.success("Domain listed.");
          router.refresh();
        } else {
          toast.error(`${domainName} already exists.`);
        }
      } else {
        toast.error("Include '.eth' in the domain name.");
      }
      setDomainName("");
      setDomainPrice("");
      setBtn("List");
    } catch (error) {
      setBtn("List");
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  const isDomainValid = (name) => {
    return name.endsWith(".eth") && name !== null;
  };

  useEffect(() => {
    loadBlockchainData();
    connection();
  }, [account]);

  useEffect(() => {
    async function fetchPrice() {
      const price = await fetchEthPriceInInr();
      setEthPriceInInr(price);
    }

    fetchPrice();
  }, []);

  if(account && account !== '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266') router.push('/');

  if(account && account === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'){
    return (
      <div className="w-full h-[100vh] bg-[url('/images/layer3.svg')] bg-no-repeat bg-cover flex justify-center text-white">
        <div className=" flex flex-col gap-4 mt-44">
          <h2 className="font-subTitle font-semibold text-2xl lg:text-3xl text-center">
            List a domain
          </h2>
          <div className="flex flex-col items-center gap-2">
            <input
              className="w-[250px] rounded-md h-[45px] text-center text-zinc-100 bg-transparent border-2 mb-2 mt-2"
              type="text"
              autoFocus
              placeholder="Enter domain name"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
            />
            <input
              className="w-[250px] rounded-md h-[45px] text-center text-zinc-100 bg-transparent border-2 mb-2"
              placeholder="Enter domain price"
              value={domainPrice}
              onInput={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                setDomainPrice(numericValue);
              }}
            />
            {domainPrice*148900.04 === 0 ? null : (
                <p className="flex items-center justify-center gap-1 mb-1">
                  Approx. {(domainPrice*ethPriceInInr).toLocaleString("en-IN")} <PiCurrencyInr />
                </p>
              )}
            <button
              onClick={() => listDomain()}
              className="bg-transparent rounded-xl font-semibold w-[100px]  py-1 border-2 border-white hover:outline-none hover:bg-zinc-100 hover:text-black hover:border-black transition duration-200"
            >
              {Btn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="w-full h-[100vh] bg-[url('/images/layer3.svg')] bg-no-repeat bg-cover flex justify-center text-white">
        <p>
          Not authorized
        </p>
    </div>
  )
};

export default ListDomains;
