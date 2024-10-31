"use client"

import * as React from "react"
import { ChevronsUpDown, Copy, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function MyCollapsible(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  const shortenAddress = (address) => {
    return address.slice(0, 6) + "..." + address.slice(-4)
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 ">
        <h3 className="text-lg font-semibold">
          Details
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Contract Address</span>
            <a href="#" className="text-blue-400 flex items-center">
              {shortenAddress(props.contractAddress)} 
              <span>
              <Copy onClick={() => copyText(props.contractAddress)} className="h-4 w-4 ml-2" />
              </span>
            </a>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Token Id</span>
            <b className="flex items-center">
              {props.tokenId} 

            </b>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Token Standard</span>
            <b className="flex items-center">
              {props.tokenStandard}
            </b>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-md font-semibold">Chain</span>
            <b className="flex items-center">
              {props.chain}
            </b>
          </div>
          
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
