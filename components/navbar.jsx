'use client'
 
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { cn } from '../libs/utils';
import { ethers } from 'ethers';

const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();

    const [account, setAccount] = useState(null)

    const connection = async () => {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);

        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0])
            setAccount(account);
        })
    }

    useEffect(() => {
        connection();
        router.refresh();
    }, [account]);

    return (  
        <div className={cn("fixed flex items-center p-2 h-16 w-full bg-black", pathName === '/' && 'bg-black', pathName === '/buy-domains' && 'bg-[#0c2029]', pathName === '/list-domains' && 'bg-[#020e14]', pathName==='/profile' && 'bg-[#042b3f]', pathName === '/transaction' && 'bg-[#080c14]')}>
            <div className={cn("font-title1 font-semibold text-xl uppercase text-white pl-8 pt-2 w-[20%]", pathName === '/' && 'text-white')}>
                Crypto Domains
            </div>
            <div className="w-[60%] pt-2">
                <ul className="flex gap-6 text-zinc-300 font-semibold">
                    <li 
                        onClick={() => router.push('/')}
                        className={cn("cursor-pointer", pathName==="/" && "text-white font-bold")}
                    >
                        Home
                    </li>
                    |
                    <li
                        onClick={() => router.push('/buy-domains')}
                        className={cn("cursor-pointer", pathName==="/buy-domains" && "text-white font-bold")}
                    >
                        Buy Domain
                    </li>
                    {account === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' && (
                        <div className='flex gap-8'>
                            |
                            <li
                                onClick={() => router.push('/list-domains')}
                                className={cn("cursor-pointer", pathName==="/list-domains" && "text-white font-bold")}
                            >
                                List Domain
                            </li>
                        </div>
                    )}
                    |
                    <li
                        onClick={() => router.push('/transaction')}
                        className={cn("cursor-pointer", pathName==="/transaction" && "text-white font-bold")}
                    >
                        Make transaction
                    </li>
                </ul>
            </div>
            {account ? (
                <div className='bg-green-300 text-[12px] p-1 rounded-lg'>
                    Connected with wallet
                </div>
            ) : (
                <div className='bg-red-400 text-[12px] p-1 rounded-lg'>
                    Not connected with wallet
                </div>
            )}
            
            <div
                onClick={() => router.push('/profile')} 
                className="absolute right-8 p-1 bg-white rounded-lg cursor-pointer hover:bg-zinc-200"
            >
                Profile
            </div>
        </div>
    );
}
 
export default Navbar;