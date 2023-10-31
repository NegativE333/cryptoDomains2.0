// ethPriceFetcher.js
export async function fetchEthPriceInInr() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
      if (response.ok) {
        const data = await response.json();
        return data.ethereum.inr;
      } else {
        console.error('Failed to fetch ETH/INR price');
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  