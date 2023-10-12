'use client'
 
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { cn } from '../libs/utils';
import { ethers } from 'ethers';
import { BiUserCircle } from 'react-icons/bi';
import MobileNav from './mobile-nav';

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
    }, [account, router]);

    return (  
        <div className={cn("fixed flex items-center p-2 h-16 w-full bg-black", pathName === '/' && 'bg-black', pathName === '/buy-domains' && 'bg-[#0c2029]', pathName === '/list-domains' && 'bg-[#020e14]', pathName==='/profile' && 'bg-[#042b3f]', pathName === '/transaction' && 'bg-[#080c14]')}>
            <div className={cn("font-title1 font-semibold lg:text-xl uppercase text-white pl-4 lg:pl-8 pt-2 w-[20%]", pathName === '/' && 'text-white')}>
                Crypto Domains
            </div>
            <div className="hidden lg:flex w-[60%] pt-2">
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
                <div className='hidden lg:flex bg-green-300 text-[12px] lg:ml-0  p-1 rounded-lg '>
                    Connected with wallet
                </div>
            ) : (
                <div className='hidden lg:flex bg-red-400 text-[12px] p-1 rounded-lg'>
                    Not connected with wallet
                </div>
            )}
            
            <div
                className="absolute right-8 p-[1px] rounded-full cursor-pointer hover:bg-white transition duration-300"
            >
                <BiUserCircle  
                    onClick={() => router.push('/profile')} 
                    className='text-3xl hidden lg:flex text-white hover:text-black transition duration-300'
                />
            </div>
                <div className='absolute lg:hidden right-4'>
                    <MobileNav />
                </div>
        </div>
    );
}
 
export default Navbar;