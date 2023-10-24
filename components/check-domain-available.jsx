import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CheckDomainAvailable = ({ cryptoDomains, provider }) => {
  const [domainName, setDomainName] = useState("");
  const [isTaken, setIsTaken] = useState(null);
  const [domainData, setDomainData] = useState([]);
  const [price, setPrice] = useState("");
  const [hasSold, setHasSold] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [forSale, setForSale] = useState(true);

  const router = useRouter();

  const tokens = (n) => {
    // eslint-disable-next-line
    return ethers.utils.parseUnits(n.toString(), "ether");
  };

  const checkAvailability = async () => {
    try {
      if(isDomainValid(domainName)){
        const isDomainExists = await cryptoDomains.isDomainListed(domainName);
        if (!isDomainExists) {
          const signer = await provider.getSigner();
          const transaction = await cryptoDomains
            .connect(signer)
            .list(domainName, tokens(1));
          await transaction.wait();
          toast.success("Domain listed.");
        }
        const isDomainTaken = await cryptoDomains.isDomainTaken(domainName);
        const domain = await cryptoDomains.getDomainByName(domainName);
        if(domain.isForSale) setIsForSale(true);

        setIsTaken(isDomainTaken);
        if (!isTaken) {
          const domainData = await cryptoDomains.getDomainByName(domainName);
          setDomainData(domainData);
  
          const priceInEther = ethers.utils.formatUnits(
            domainData.cost.toString(),
            "ether"
          );
          setPrice(priceInEther);
        }
      }
      else{
        toast.error("Include '.eth' in the domain name.");
      }
    } catch (error) {
      console.error("Error checking domain availability:", error);
    }
  };

  const saleBuyHandler = async () => {
    try {
      const domainId = await cryptoDomains.getDomainIdByName(domainData.name);
      const signer = await provider.getSigner();
      const transaction = await cryptoDomains
        .connect(signer)
        .buyDomain(domainId, { value: domainData.cost });
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
      const domainId = await cryptoDomains.getDomainIdByName(domainName);
      const signer = await provider.getSigner();
      const transaction = await cryptoDomains
        .connect(signer)
        .mint(domainId, { value: domainData.cost });
      await transaction.wait();
      setHasSold(true);
      toast.success("Domain registered!");
      window.location.reload();
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  // Function to check if the domain name contains ".eth"
  const isDomainValid = (name) => {
    return name.endsWith(".eth") && name !== null;
  };

  useEffect(() => {
    if (domainName === "") {
      setIsTaken(null);
      setDomainData([]);
    }
  }, [domainName]);

  return (
    <div className="text-white flex flex-col gap-4">
      <h2 className="font-subTitle font-semibold text-3xl text-center">
        Find Your Perfect Domain
      </h2>
      <div className="flex flex-col items-center gap-2">
        <input
          className={`w-[250px] rounded-md h-[35px] p-2 text-slate-600 text-center ${
            isDomainValid(domainName) ? "" : "border-red-500"
          }`} 
          type="text"
          placeholder="Enter domain name"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
        <button
          onClick={checkAvailability}
          className="bg-zinc-200 rounded-xl text-black font-semibold w-[100px] hover:bg-zinc-300"
        >
          Get
        </button>
      </div>
      {isTaken !== null && (
        <div className="flex items-center justify-center">
          {isTaken && !isForSale ? (
            <div className="font-subTitle text-center text-red-400 w-[80%]">
              Sorry! but this domain name is already taken by someone else
            </div>
          ) : (
            <div className="bg-white text-black w-full h-[50px] p-2 rounded-xl flex items-center relative m-2">
              <div className="font-domain pl-2 font-bold text-[18px] w-[40%]">
                {(!domainData?.isForSale && domainData.isOwned) || hasSold ? (
                  <del>{domainData.name}</del>
                ) : (
                  <span>{domainData.name}</span>
                )}
              </div>
              <div className="font-bold text-right w-[30%]">{price} ETH</div>
              {domainData.isOwned || hasSold ? (
            domainData.isForSale && forSale ? (
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
              className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover-bg-slate-800 transition cursor-pointer text-white font-domain text-[15px]"
            >
              Buy it
            </div>
          )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckDomainAvailable;
