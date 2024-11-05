"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MyButton from "./custom/MyButton";
import { useState } from "react";

export default function AuctionDialog(props) {

  const [price, setPrice] = useState(NaN);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MyButton
          onClick={() => {
            // placeBid(nft).then(() => {
            //   window.location.reload();
            // });
          }}
          title="Place Bid"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            Place Your Bid
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Enter a valid price for the auction. Click Place Bid when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center ">
            <label
              htmlFor="name"
              className=" text-gray-400 dark:text-gray-300"
            >
              Enter Price
            </label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              defaultValue="Pedro Duarte"
              className="col-span-3 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600 p-2 rounded-sm"
            />
          </div>

        </div>
        <DialogFooter>
          <button
            type="button"
            className="bg-purple-500 hover:scale-95 transition-transform transform duration-200 text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => {
              if (price === 0 || price === NaN) {
                alert("Please enter a price");
                return;
              }
              props.onClick(price);
            }}
          >
            Place Bid
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
