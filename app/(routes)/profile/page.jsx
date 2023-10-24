"use client";

//Crypto imports
import { ethers } from "ethers";
import CryptoDomains from "../../abis/CryptoDomains.json";
import config from "../../config.json";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Profile = () => {
  const [account, setAccount] = useState(null);
  const router = useRouter();

  const [greet, setGreet] = useState("");
  var date = new Date();
  var current_time = date.getHours();
  useEffect(() => {
    if (current_time < 12) {
      setGreet("Good Morning");
    } else if (current_time < 18) {
      setGreet("Good Afternoon");
    } else {
      setGreet("Good Evening");
    }
  }, [current_time]);

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
      window.location.reload();
    });
  };

  const [provider, setProvider] = useState(null);
  const [cryptoDomains, setCryptoDomains] = useState(null);
  const [domains, setDomains] = useState([]);
  const [domainsData, setDomainsData] = useState([]);
  const [userBalance, setUserBalance] = useState("");
  const [loading, setLoading] = useState(null);
  const [unListed, setIsUnlisted] = useState(false);

  const loadBlockchainData = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const cryptoDomains = new ethers.Contract(
      config[network.chainId].CryptoDomains.address,
      CryptoDomains,
      provider
    );
    setCryptoDomains(cryptoDomains);

    if (account) {
      const domains = await cryptoDomains.getUserDomains(account);
      setDomains(domains);
    }

    const domainsData = [];
    for (let i = 0; i < domains.length; i++) {
      const domainData = await cryptoDomains.getDomainByName(domains[i]);
      domainsData.push(domainData);
    }
    setDomainsData(domainsData);

    if (account) {
      // Check if account is set
      const userBalance = await provider.getBalance(account);
      const formattedBalance = ethers.utils.formatEther(userBalance);
      setUserBalance(formattedBalance);
    }
    setLoading(false);
  };

  const unlist = async (domainName) => {
    try {
      const signer = await provider.getSigner();
      const domainId = await cryptoDomains.getDomainIdByName(domainName);
      const transaction = await cryptoDomains
        .connect(signer)
        .unlistDomainForSale(domainId);
      await transaction.wait();
      setIsUnlisted(true);
      toast.success("Domain unlisted from sale.");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDomainsData = async () => {
      if (account && domains.length > 0) {
        const domainsData = [];
        for (let i = 0; i < domains.length; i++) {
          const domainData = await cryptoDomains.getDomainByName(domains[i]);
          domainsData.push(domainData);
        }
        setDomainsData(domainsData);
      }
    };
    fetchDomainsData();
  }, [account, domains]);

  useEffect(() => {
    connection();
    loadBlockchainData();
    router.refresh();
  }, [account]);

  console.log(domainsData);

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <div className="w-full h-[100vh] bg-[url('/images/layer4.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row">
      <div className="lg:w-[50%] flex flex-col gap-4 lg:justify-start justify-center items-center lg:items-start lg:pl-24  text-white lg:mt-44 mt-24">
        <div className="font-title lg:text-4xl text-3xl">{greet},</div>
        <div className="lg:text-2xl text-[13px] font-semibold font-subTitle">
          {account}
        </div>
        <div className="text-xl font-subTitle">
          <span className="font-semibold">Your balance :</span>{" "}
          {userBalance.slice(0, 6)} ETH
        </div>
      </div>
      <div className="lg:w-[40%] flex flex-col gap-4 lg:mt-44 mt-16 text-white lg:pl-16">
        {domainsData.length === 0 ? (
          <div className="font-title lg:text-3xl text-2xl text-center flex justify-center items-center flex-col gap-4">
            You dont have any domain
            <div
              onClick={() => router.push("/buy-domains")}
              className="border-2 w-36 h-12 p-2 rounded-full text-[16px] flex items-center justify-center font-semibold hover:text-black hover:bg-white hover:border-black cursor-pointer transition duration-300"
            >
              Bye Domain
            </div>
          </div>
        ) : (
          <div className="font-title lg:text-3xl text-2xl text-center">
            Domains you have
          </div>
        )}
        <div className="flex flex-col gap-2 items-end text-black">
          {domainsData.map((domain, i) => (
            <div
              key={i}
              className="bg-white w-full h-[50px] p-2 rounded-xl flex items-center relative m-2"
            >
              <div className="font-domain pl-2 font-bold text-[18px] w-[40%]">
                {domain.name}
              </div>
              <div className="font-bold text-right w-[20%]">
                {ethers.utils.formatUnits(domain.cost.toString(), "ether")} ETH
              </div>
              {!domain.isForSale || unListed ? (
                <div className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover:bg-slate-800 transition cursor-pointer text-white font-domain text-[15px]">
                  Owned
                </div>
              ) : (
                <div
                  onClick={() => unlist(domain.name)}
                  className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover:bg-slate-800 transition cursor-pointer text-white font-domain text-[15px]"
                >
                  Unlist
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Profile;
