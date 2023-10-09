"use client";

import DomainCard from '../components/domain-card';
import { SiEthereum } from 'react-icons/si';

const Hero = ({domains, cryptoDomains, provider}) => {
    return (    
        <div className="w-full h-[100vh] bg-[url('/images/layer2.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row lg:gap-24 items-center">
            <div className="flex flex-col gap-4 justify-center lg:justify-start items-center lg:items-start lg:w-[50%] lg:pl-12 p-2">
                <div className="text-3xl lg:text-5xl font-title1 text-white">
                    Crypto Domains
                </div>
                <div className="font-domain lg:text-xl lg:text-justify text-zinc-200 pl-1">
                    <div className='flex lg:hidden text-center p-2 mt-4'>
                        Crypto domains, also known as blockchain domains or decentralized domains, represent a new frontier in the digital space. Unlike traditional domains, crypto domains are fully owned and controlled by their users, offering increased security, censorship resistance, and the potential for unique features like self-custody and interoperability with blockchain-based applications. With crypto domains, users can take ownership of their online identities and assets, ushering in a new era of sovereignty and innovation on the internet.
                    </div>
                <ul className='hidden lg:flex flex-col text-[14px]'>
                    <li 
                        className='flex justify-start items-start lg:flex lg:items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Explore the world of blockchain-powered domains, where ownership and control are in your hands.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        We prioritize the security of your digital assets.
                    </li>
                    <li   
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Provides a safe environment for managing your crypto domains.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Join our platform to be part of the decentralization movement.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Experience the benefits of truly owning your online presence.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Create a unique online identity and reputation that reflects your individuality in the digital realm.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Crypto Domians provides you with the latest advancements in the world of crypto domains.
                    </li>
                    <li
                        className='flex items-center gap-2'
                    >
                        <SiEthereum className='hidden lg:flex'/>
                        Enjoy 24/7 accessibility to your crypto domains, allowing you to manage them whenever you need.
                    </li>
                </ul>
                <div className='font-subTitle mt-6 text-center font-semibold'>
                We welcome users from all backgrounds to be part of our inclusive ecosystem, promoting diversity and creativity.
                </div>
                </div>
            </div>
            <div className="lg:w-[35%] hidden lg:flex items-center justify-center flex-col">
                <div className="text-white text-xl font-domain lg:p-2">
                    Top Picks for Your Blockchain Identity
                </div>
                {domains.map((domain, i) => (
                    <DomainCard 
                        key={i}
                        domain={domain} 
                        cryptoDomains={cryptoDomains}
                        provider={provider}
                        id={i+1}
                    />
                ))}
            </div>
        </div>
    );
}
 
export default Hero;