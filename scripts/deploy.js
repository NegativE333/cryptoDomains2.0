// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  // eslint-disable-next-line 
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  // eslint-disable-next-line no-undef
  const [deployer] = await ethers.getSigners()
  const NAME = "Crypto Domains"
  const SYMBOL = "CD"

  // Deploy contract
  // eslint-disable-next-line no-undef
  const CryptoDomains = await ethers.getContractFactory("CryptoDomains")
  const cryptoDomains = await CryptoDomains.deploy(NAME, SYMBOL)
  await cryptoDomains.deployed();

  console.log(`Deployed Domain Contract at: ${cryptoDomains.address}\n`)

  // List 6 domains
  const names = ["jack.eth", "john.eth", "henry.eth", "cobalt.eth", "oxygen.eth", "carbon.eth", "om.eth"]
  const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1), tokens(100)]

  for (var i = 0; i < names.length; i++) {
    const transaction = await cryptoDomains.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log(`Listed Domain ${i + 1}: ${names[i]}`)
  } 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
