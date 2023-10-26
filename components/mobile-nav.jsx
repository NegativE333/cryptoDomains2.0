import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BiUserCircle } from "react-icons/bi";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { LuSendToBack } from "react-icons/lu";
import { AiOutlineCrown, AiOutlineHome } from "react-icons/ai";
import { MdPublishedWithChanges, MdOutlineSell } from "react-icons/md";

const MobileNav = () => {
  const router = useRouter();

  const [account, setAccount] = useState(null);

  const connection = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);

    window.ethereum.on("accountsChanged", async () => {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    });
  };

  useEffect(() => {
    connection();
    router.refresh();
  }, [account]);

  return (
    <DropdownMenu className="bg-black">
      <DropdownMenuTrigger>
        <HiOutlineMenuAlt1 className="text-white text-2xl" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-white flex flex-col gap-2 bg-black mr-4 p-4">
        <DropdownMenuItem
          onClick={() => router.push("/")}
          className="text-[17px] flex gap-2"
        >
          <AiOutlineHome />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/buy-domains")}
          className="text-[17px] flex gap-2"
        >
          <AiOutlineCrown />
          Buy Domain
        </DropdownMenuItem>
        {account === "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" && (
          <DropdownMenuItem
            onClick={() => router.push("/list-domains")}
            className="text-[17px] flex gap-2"
          >
            <MdPublishedWithChanges />
            List Domain
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => router.push("/transaction")}
          className="text-[17px] flex gap-2"
        >
          <LuSendToBack />
          Make transaction
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="text-[17px] flex gap-2"
        >
          <MdOutlineSell />
          List for sale
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="text-[17px] flex gap-2"
        >
          <BiUserCircle />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        {account ? (
          <DropdownMenuLabel className="flex bg-green-300 text-[12px] lg:ml-0  p-1 rounded-lg justify-center items-center text-black">
            Connected with wallet
          </DropdownMenuLabel>
        ) : (
          <DropdownMenuLabel className="flex bg-red-400 text-[12px] p-1 rounded-lg justify-center items-center text-black">
            Not connected with wallet
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNav;
