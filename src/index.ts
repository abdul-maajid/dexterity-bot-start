import { Wallet } from "@coral-xyz/anchor";
import dexterity from "@hxronetwork/dexterity-ts";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  handleCancelSubscription,
  handleNewSubscription,
} from "./api-utils/subscritionHandler";

const AppState = new Map<string, any>();

export const app = async () => {
  const keypair = Keypair.fromSecretKey(
    new Uint8Array([
      153, 251, 213, 43, 95, 145, 232, 205, 98, 119, 20, 238, 196, 110, 211, 41,
      247, 89, 74, 192, 233, 67, 218, 233, 216, 209, 83, 110, 154, 66, 225, 35,
      183, 226, 204, 186, 255, 78, 57, 189, 47, 58, 58, 171, 45, 12, 25, 88,
      181, 73, 182, 76, 224, 138, 194, 78, 40, 228, 10, 67, 185, 200, 64, 66,
    ])
  );
  const wallet = new Wallet(keypair);
  const rpc = `https://devnet-rpc.shyft.to?api_key=fTjaNkS9PxIqTeKQ`;
  const manifest = await dexterity.getManifest(rpc, true, wallet);

  const trg = new PublicKey("2EjgK1Z2PPLj7pkUkfZbCdP5uo5UgScMPCZpNRi9rvtW");
  const trader = new dexterity.Trader(manifest, trg);

  const server = Bun.serve({
    async fetch(req, server) {
      const url = new URL(req.url);
      const { pathname, searchParams } = url;

      let response: Response | undefined = new Response(
        JSON.stringify({ status: 200 })
      );

      switch (pathname) {
        case "/process-trade":
          break;
        case "/new-subscription":
          response = await handleNewSubscription(
            trader,
            manifest,
            searchParams.get("trg"),
            AppState
          );
          break;
        case "/cancel-subscription":
          response = await handleCancelSubscription(AppState);
          break;
        default:
          break;
      }

      if (!response) return new Response(JSON.stringify({ status: 200 }));
      return response;
    },
  });
  console.log(`${server.url}`);
};
