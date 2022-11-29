import {
  Connection,
  GetProgramAccountsFilter,
  clusterApiUrl,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const rpcEndpoint =
  "https://quiet-sleek-frost.solana-mainnet.discover.quiknode.pro/9462baba5484683855a1b5c2895efe9693c55b90/";
const solanaConnection = new Connection(rpcEndpoint);

// const solanaConnection = new Connection(clusterApiUrl("mainnet-beta"));
// eventually want to repalce this with a free RPC endpoint with good APIs

const walletToQuery = "D8GbJQErCmFuMGtWMaSREoEy8jJApaVVdNwehZY4PAbR";

async function getTokenAccounts(wallet: string, solanaConnection: Connection) {
  const filters: GetProgramAccountsFilter[] = [
    {
      dataSize: 165, //size of account (bytes)
    },
    {
      memcmp: {
        offset: 32, //location of our query in the account (bytes)
        bytes: wallet, //our search criteria, a base58 encoded string
      },
    },
  ];
  const accounts = await solanaConnection.getParsedProgramAccounts(
    TOKEN_PROGRAM_ID,
    { filters: filters }
  );
  console.log(
    `Found ${accounts.length} token account(s) for wallet ${wallet}.`
  );
  accounts.forEach((account, i) => {
    //Parse the account data
    const parsedAccountInfo: any = account.account.data;
    const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
    const tokenBalance: number =
      parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
    //Log results
    console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
    console.log(`--Token Mint: ${mintAddress}`);
    console.log(`--Token Balance: ${tokenBalance}`);
  });
}

getTokenAccounts(walletToQuery, solanaConnection);
