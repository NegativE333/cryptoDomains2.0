'use client';

//Crypto imports
import { ethers } from 'ethers';
import CryptoDomains from '../../abis/CryptoDomains.json';
import config from '../../config.json';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Profile = () => {

    const [account, setAccount] = useState(null);
    const router = useRouter();

    const [greet, setGreet] = useState("");
    var date = new Date();
	var current_time = date.getHours();
    useEffect(() => {
        if(current_time<12){
            setGreet("Good Morning");
        }
        else if(current_time<18){
            setGreet("Good Afternoon");
        }
        else{
            setGreet("Good Evening");
        }
    },[current_time])

    const connection = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0])
            setAccount(account);
            window.location.reload();
        })
    }

    const [provider, setProvider] = useState(null);
    const [cryptoDomains, setCryptoDomains] = useState(null);
    const [domains, setDomains] = useState([])
    const [domainsData, setDomainsData] = useState([]);
    const [userBalance, setUserBalance] = useState("");
    const [loading, setLoading] = useState(null);

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

        if(account){
            const domains = await cryptoDomains.getUserDomains(account)
            setDomains(domains);
        }
        
        const domainsData = [];
        for(let i = 0; i<domains.length; i++){
            const domainData = await cryptoDomains.getDomainByName(domains[i]);
            domainsData.push(domainData);
        }
        setDomainsData(domainsData);

        if (account) { // Check if account is set
            const userBalance = await provider.getBalance(account);
            const formattedBalance = ethers.utils.formatEther(userBalance);
            setUserBalance(formattedBalance);
        }
        setLoading(false);
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

    if(loading){
        return(
            <div>
                loading
            </div>
        )
    }

    return (  
        <div className="w-full h-[100vh] bg-[url('/images/layer4.svg')] bg-no-repeat bg-cover flex">
            <div className="w-[50%] flex flex-col gap-4 justify-start pl-24 text-white mt-44">
                <div className="font-title text-4xl">
                    {greet},
                </div>
                <div className='text-2xl font-semibold font-subTitle'>
                    {account}
                </div>
                <div className='text-xl font-subTitle'>
                    <span className='font-semibold'>Your balance :</span> {userBalance.slice(0, 6)} ETH
                </div>
            </div>
            <div className='w-[40%] flex flex-col gap-4 mt-44 text-white pl-16'>
                <div className='font-title text-3xl text-center'>
                    Domains you have
                </div>
                <div className='flex flex-col gap-2 items-end text-black'>
                    {domainsData.map((domain, i) => (
                        <div key={i} className='bg-white w-full h-[50px] p-2 rounded-xl flex items-center relative m-2'>
                            <div className="font-domain pl-2 font-bold text-[18px] w-[40%]">
                                {domain.name}
                            </div>
                            <div className="font-bold text-right w-[20%]">
                                {ethers.utils.formatUnits(domain.cost.toString(), "ether")} ETH
                            </div>
                            <div 
                                className="absolute top-0 bottom-0 right-0 bg-slate-600 w-[20%] flex items-center justify-center hover:bg-slate-800 transition cursor-pointer text-white font-domain text-[15px]"
                            >
                                Sell
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Profile;