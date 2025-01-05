"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NFTMarketplaceContext from "../../../Context/NFTMarketplaceContext";
import { addUser, getUserByWalletAddress, getUsers } from "@/lib/rxDB";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { shortenAddress } from "../../../utils/convert";
import { Copy } from "lucide-react";

const Header = () => {
  const { connectWallet, currentAccount } = React.useContext(
    NFTMarketplaceContext
  );

  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    // console.log("currentAccount", currentAccount);
    // getUsers().then((res) => {
    //   console.log("user", res);
    // });
  }, [currentAccount]);

  // useEffect(() => {
  //   const initializeDb = async () => {
  //     try {
  //       await getUsers(); // Chỉ gọi để đảm bảo database sẵn sàng
  //       setDbReady(true);
  //     } catch (err) {
  //       console.error("Error initializing database:", err);
  //     }
  //   };

  //   initializeDb();
  // }, []);

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-primary font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        <a href="#">
          <img src="/images/wallet.webp" alt="logo" className="w-12" />
        </a>

        <div
          id="collapseMenu"
          className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
        >
          <button
            id="toggleClose"
            className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 fill-black"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
          </button>

          <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="mb-6 hidden max-lg:block">
              <a href="#"></a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/"
                className="hover:text-[#007bff] text-[#007bff] block font-semibold text-[15px]"
              >
                Home
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Marketplace
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/users"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Recent Users
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/explorer"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Explorer
              </a>
            </li>
            {/* <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/upload"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Upload
              </a>
            </li> */}
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/collections"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Authors
              </a>
            </li>
            {/* <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href="/account"
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Account settings
              </a>
            </li> */}
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a
                href={`/account/${currentAccount}` || "/account"}
                className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]"
              >
                Account
              </a>
            </li>
          </ul>
        </div>

        <div className="flex max-lg:ml-auto space-x-3">
          {currentAccount && showMenu && (
            <>
              <div
                onClick={() => setShowMenu(false)}
                className="fixed top-0 left-0 w-full h-full flex "
              ></div>

              <div className="flex justify-center rounded-sm">
                <div
                  className="w-[96%] md:w-[30%] bg-gray-300 dark:bg-gray-800 border-purple-500 border-2 
                      fixed top-[88px] z-30 mx-2 overflow-y-auto text-black"
                >
                  <div className="flex w-full">
                    <div className="flex flex-col justify-center items-center w-full">
                      <h2 className="font-bold text-xl p-4 flex items-center">
                        {shortenAddress(currentAccount)}{" "}
                        <Copy
                          size={16}
                          className="cursor-pointer transform hover:scale-110 mx-1"
                          onClick={() => {
                            navigator.clipboard.writeText(currentAccount);
                          }}
                        />
                      </h2>
                      <div className="flex flex-col w-full">
                        <Button
                          className="rounded-none bg-white text-black p-8 border-t-2 border-purple-300  hover:bg-black hover:text-white text-3xl font-semibold"
                          onClick={() => {
                            router.push(`/author/${currentAccount}`);
                          }}
                        >
                          Profile
                        </Button>
                        <Button
                          className="rounded-none bg-white text-black p-8 border-t-2 border-purple-500  hover:bg-black hover:text-white text-3xl font-semibold"
                          onClick={() => {
                            router.push(`/account/${currentAccount}`);
                          }}
                        >
                          Account settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {currentAccount === "" ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2 text-sm rounded-sm font-bold text-white  bg-[#a259ff] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#007bff]"
            >
              Continue with Metamask
            </button>
          ) : (
            <a href="/upload">
              <button
                // onClick={()=>{}}
                className="px-4 py-2 text-sm rounded-sm font-bold text-white  bg-[#a259ff] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#007bff]"
              >
                Create
              </button>
            </a>
          )}
          {currentAccount && (
            <button
              onClick={() => {
                setShowMenu(!showMenu);
              }}
              className="px-4 py-2 text-sm rounded-sm font-bold text-white  bg-[#a259ff] transition-all ease-in-out duration-300 hover:opacity-70"
            >
              Profile
            </button>
          )}

          <button id="toggleOpen" className="lg:hidden">
            <svg
              className="w-7 h-7"
              fill="white"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
