"use client";

import { ethers } from "ethers";
import { useState } from "react";


const DomainCard = ({domain, cryptoDomains, provider, id}) => {

    const [hasSold, setHasSold] = useState(false)

    const buyHandler = async () => {
        const signer = await provider.getSigner()
        const transaction = await cryptoDomains.connect(signer).mint(id, { value: domain.cost })
        await transaction.wait()
        setHasSold(true)
    }

  return (
    <div
      className="bg-white w-full h-[50px] p-2 rounded-xl flex items-center relative"
    >
      <div className="font-domain pl-2 font-bold text-[18px] w-[40%]">
        {domain?.isOwned || hasSold ? 
            (<del>{domain.name}</del>) 
            : 
            (<span>{domain.name}</span>)
        }
        
      </div>
      <div className="font-bold text-right w-[20%]">
        {ethers.utils.formatUnits(domain.cost.toString(), "ether")} ETH
      </div>
      {domain.isOwned || hasSold ? (
        <div 
            className="absolute top-0 bottom-0 right-0 bg-slate-400 w-[20%] flex items-center justify-center hover:bg-slate-200 transition cursor-not-allowed text-black font-domain text-[15px]"
        >
            Sold
        </div>
      ) : (
        <div 
            onClick={() => buyHandler()}
            className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover:bg-slate-800 transition cursor-pointer text-white font-domain text-[15px]"
        >
            Buy it
        </div>
      )}
      
    </div>
  );
};

export default DomainCard;
