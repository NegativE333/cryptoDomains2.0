"use client";

//Crypto imports
import { ethers } from "ethers";

//React imports
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {PiCurrencyInr} from 'react-icons/pi';

//Const import
import { fetchEthPriceInInr } from '../const/inrFetcher';

const DomainCard = ({ domain, cryptoDomains, provider, id }) => {
  const [hasSold, setHasSold] = useState(false);
  const [forSale, setForSale] = useState(true);
  const [ethPriceInInr, setEthPriceInInr] = useState(null);

  const saleBuyHandler = async () => {
    try {
      toast.loading("Opening MataMask...", { duration : 2500 });
      const domainId = await cryptoDomains.getDomainIdByName(domain.name);
      const signer = await provider.getSigner();
      const transaction = await cryptoDomains
        .connect(signer)
        .buyDomain(domainId, { value: domain.cost });
      await transaction.wait();
      setHasSold(true);
      setForSale(false);
      toast.success("Domain registered!");
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  const buyHandler = async () => {
    try {
      toast.loading("Opening MataMask...", { duration : 2500 });
      const domainId = await cryptoDomains.getDomainIdByName(domain.name);
      const signer = await provider.getSigner();
      const transaction = await cryptoDomains
        .connect(signer)
        .mint(domainId, { value: domain.cost });
      await transaction.wait();
      setHasSold(true);
      toast.success("Domain registered!");
    } catch (error) {
      toast.error("Something went wrong.");
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchPrice() {
      const price = await fetchEthPriceInInr();
      setEthPriceInInr(price);
    }

    fetchPrice();
  }, []);

  return (
    <div className="w-full">
      {!domain.isOwned || domain.isForSale ? (
        <div className="bg-white w-full h-[50px] p-2 rounded-xl flex items-center relative m-2">
          <div className="font-domain pl-2 font-bold text-[18px] w-[40%]">
            {(!domain?.isForSale && domain.isOwned) || hasSold ? (
              <del>{domain.name}</del>
            ) : (
              <span>{domain.name}</span>
            )}
          </div>
          <div className="flex flex-col font-bold text-center w-[30%]">
            {ethers.utils.formatUnits(domain.cost.toString(), "ether")} ETH
            {ethPriceInInr ? (
              <p className="text-[12px] font-light truncate flex items-center justify-center gap-[2px]">
              Approx. {(ethers.utils.formatUnits(domain.cost.toString(), "ether")*ethPriceInInr).toLocaleString("en-IN")} <PiCurrencyInr />
              </p>

            ) : (
              <p className="text-[12px] font-light truncate flex items-center justify-center gap-[2px]">
                Loading INR price...
              </p>
            )}
          </div>
          {domain.isOwned || hasSold ? (
            domain.isForSale && forSale ? (
              <div
                onClick={() => saleBuyHandler()}
                className="absolute top-0 bottom-0 right-0 bg-slate-400 w-[20%] flex flex-col items-center justify-center hover:bg-slate-200 transition text-black font-domain text-[15px] cursor-pointer"
              >
                Buy <span className="text-[10px]">Open for sale</span>
              </div>
            ) : (
              <div
                className="absolute top-0 bottom-0 right-0 bg-slate-400 w-[20%] flex flex-col items-center justify-center hover:bg-slate-200 transition cursor-not-allowed text-black font-domain text-[15px]"
              >
                Sold
              </div>
            )
          ) : (
            <div
              onClick={() => buyHandler()}
              className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover-bg-slate-800 transition cursor-pointer text-white font-domain text-[15px] hover:bg-slate-700"
            >
              Buy it
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default DomainCard;
