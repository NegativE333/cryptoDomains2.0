//Crypto imports
import { ethers } from "ethers";

//React imports
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PiCurrencyInr } from 'react-icons/pi';


//Const import
import { fetchEthPriceInInr } from '../const/inrFetcher';
import { useRouter } from "next/navigation";

const CheckDomainAvailable = ({ cryptoDomains, provider }) => {
  const router = useRouter();
  const [domainName, setDomainName] = useState("");
  const [isTaken, setIsTaken] = useState(null);
  const [domainData, setDomainData] = useState([]);
  const [price, setPrice] = useState();
  const [hasSold, setHasSold] = useState(false);
  const [isForSale, setIsForSale] = useState(false);
  const [forSale, setForSale] = useState(true);
  const [ethPriceInInr, setEthPriceInInr] = useState(null);

  const tokens = (n) => {
    // eslint-disable-next-line
    return ethers.utils.parseUnits(n.toString(), "ether");
  };

  const checkAvailability = async () => {
    try {
      if (isDomainValid(domainName)) {
        const isDomainExists = await cryptoDomains.isDomainListed(domainName);
        if (!isDomainExists) {
          toast.loading("Opening MataMask...", { duration : 2500 });
          const signer = await provider.getSigner();
          const transaction = await cryptoDomains
            .connect(signer)
            .list(domainName, tokens(0.01));
          await transaction.wait();
          toast.success("Domain listed.");
        }
        const isDomainTaken = await cryptoDomains.isDomainTaken(domainName);
        const domain = await cryptoDomains.getDomainByName(domainName);
        if (domain.isForSale) setIsForSale(true);

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
      } else {
        toast.error("Include '.eth' in the domain name.");
      }
    } catch (error) {
      console.error("Error checking domain availability:", error);
    }
  };

  const saleBuyHandler = async () => {
    try {
      toast.loading("Opening MataMask...", { duration : 2500 });
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
      toast.loading("Opening MataMask...", { duration : 2500 });
      const domainId = await cryptoDomains.getDomainIdByName(domainName);
      const signer = await provider.getSigner();
      const transaction = await cryptoDomains
        .connect(signer)
        .mint(domainId, { value: domainData.cost });
      await transaction.wait();
      setHasSold(true);
      toast.success("Domain registered!");
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

  useEffect(() => {
    async function fetchPrice() {
      const price = await fetchEthPriceInInr();
      setEthPriceInInr(price);
    }

    fetchPrice();
  }, []);

  return (
    <div className="text-white flex flex-col gap-4">
      <h2 className="font-subTitle font-semibold text-3xl text-center">
        Find Your Perfect Domain
      </h2>
      <div className="flex flex-col items-center gap-2">
        <input
          className={`w-[250px] rounded-md h-[45px] text-center text-zinc-100 bg-transparent border-white border-2 mb-2 mt-2 ${
            !isDomainValid(domainName) && "border-red-500"
          }`}
          type="text"
          autoFocus
          placeholder="Enter domain name"
          value={domainName}
          onChange={(e) => setDomainName(e.target.value)}
        />
        <button
          onClick={checkAvailability}
          className="bg-transparent rounded-xl font-semibold w-[100px]  py-1 border-2 border-white hover:outline-none hover:bg-white hover:text-black hover:border-black transition duration-100"
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
              <div className="font-bold text-center w-[40%]">
                {price} ETH
                {ethPriceInInr ? (
                  <p className="text-[12px] font-light truncate flex items-center justify-center gap-[2px]">
                    {price && (
                      <>
                        Approx. {(parseFloat(price)*ethPriceInInr).toLocaleString("en-IN")} <PiCurrencyInr />
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-[12px] font-light truncate flex items-center justify-center gap-[2px]">
                    Loading INR price...
                  </p>
                )}
              </div>
              {domainData.isOwned || hasSold ? (
                domainData.isForSale && forSale ? (
                  <div
                    onClick={() => saleBuyHandler()}
                    className="absolute top-0 bottom-0 right-0 bg-slate-400 w-[20%] flex flex-col items-center justify-center hover:bg-slate-200 transition text-black font-domain text-[15px] cursor-pointer"
                  >
                    Buy <span className="text-[10px]">Open for sale</span>
                  </div>
                ) : (
                  <div className="absolute top-0 bottom-0 right-0 bg-slate-400 w-[20%] flex flex-col items-center justify-center hover:bg-slate-200 transition cursor-not-allowed text-black font-domain text-[15px] ">
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
          )}
        </div>
      )}
    </div>
  );
};

export default CheckDomainAvailable;
