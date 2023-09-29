"use client";

import DomainCard from '../components/domain-card';

const Hero = ({domains, cryptoDomains, provider}) => {
    // console.log(domains);
    return (    
        <div className="w-full h-[100vh] bg-[url('/images/layer2.svg')] bg-no-repeat bg-cover flex flex-col lg:flex-row lg:gap-24 items-center">
            <div className="flex flex-col gap-4 justify-center lg:justify-start items-center lg:items-start lg:w-[50%] lg:pl-12 p-2 mt-24">
                <div className="text-3xl lg:text-5xl font-title1 text-white">
                    Crypto Domains
                </div>
                <div className="font-doma lg:text-xl text-center lg:text-justify text-zinc-200 pl-1">
                Crypto domains, also known as blockchain domains or decentralized domains, represent a new frontier in the digital space. Unlike traditional domains, crypto domains are fully owned and controlled by their users, offering increased security, censorship resistance, and the potential for unique features like self-custody and interoperability with blockchain-based applications. With crypto domains, users can take ownership of their online identities and assets, ushering in a new era of sovereignty and innovation on the internet.
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