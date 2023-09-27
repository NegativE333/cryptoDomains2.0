"use client";

import DomainCard from '../components/domain-card';

const Hero = ({domains, cryptoDomains, provider}) => {
    // console.log(domains);
    return (    
        <div className="w-full h-[100vh] bg-[url('/images/layer2.svg')] bg-no-repeat bg-cover flex gap-24 items-center">
            <div className="flex flex-col gap-4 justify-start items-start w-[50%] pl-12">
                <div className="text-5xl font-title1 text-white">
                    Crypto Domains
                </div>
                <div className="font-doma text-xl text-justify text-zinc-200 pl-1">
                Crypto domains, also known as blockchain domains or decentralized domains, represent a new frontier in the digital space. Unlike traditional domains, crypto domains are fully owned and controlled by their users, offering increased security, censorship resistance, and the potential for unique features like self-custody and interoperability with blockchain-based applications. With crypto domains, users can take ownership of their online identities and assets, ushering in a new era of sovereignty and innovation on the internet.
                </div>
            </div>
            <div className="w-[35%] flex items-center justify-center flex-col">
                <div className="text-white text-xl font-domain p-2">
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