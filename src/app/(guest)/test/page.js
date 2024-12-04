"use client";
import { useContext, useEffect } from "react";
import { addMockUser, exportDatabase, getDatabase, rxDb, test, testQuery, testUploadPinata } from "@/lib/rxDB"
import { IPDBContext } from "../../../../Context/IPDBContext";
import NFTMarketplaceContext from "../../../../Context/NFTMarketplaceContext";
import { consoleLogGun } from '../../../lib/ipfs'

const TestPage = () => {

  const { forceSync, syncFromContract } = useContext(IPDBContext)
  const { currentAccount } = useContext(NFTMarketplaceContext)

    useEffect(() => {
    console.log("currentAccount", currentAccount);
  }, [currentAccount])

  useEffect(() => {
    // test()
    const tst = async () => {
      // const db = await getDatabase()
      // const users = await db.users.find().exec()
      // console.log(users)
      // testUploadPinata()
      // console.log(db)
      // addMockUser()
      // testQuery()
      exportDatabase()
    }
    tst()
  }, [])


  return (
    <div>
      <h1>Task Manager</h1>
      <p>Manage your tasks here</p>
      <button type=""
        onClick={() => {
          forceSync()
        }}
      >
        force sync
      </button>
      <br/>
      <button 
        onClick={() => {
          // console.log("currentAccount:", currentAccount)
          consoleLogGun(currentAccount).then((res) => {
            console.log("gun:", res)
          })
        }}
      type="">
        log gun
      </button>
    </div>
  );
};

export default TestPage;
