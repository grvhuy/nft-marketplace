"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ShoppingCart, Trash, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "../../lib/redux/feature/slice/cart";
import { shortenAddress } from "../../../utils/convert";
import { contractOwner } from "../../../Context/constants";
import NFTMarketplaceContext from "../../../Context/NFTMarketplaceContext";

const Header = () => {  
  const { connectWallet, currentAccount } = React.useContext(NFTMarketplaceContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const cart_items = useSelector((state) => state?.cart.cartItems);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-primary font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
      <div className="flex flex-wrap items-center justify-between gap-5 w-full">
        <a className="text-xl text-white font-bold" href="/">
          Dagon
        </a>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="lg:hidden"
        >
          {isMenuOpen ? (
            <X className="w-7 h-7 text-white" />
          ) : (
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
              />
            </svg>
          )}
        </button>

        {/* Navigation Menu */}
        <div className={`lg:block ${isMenuOpen ? 'block' : 'hidden'} flex-1 lg:flex-none`}>
          <ul className="lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a href="/search" className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                Browse
              </a>
            </li>
            {currentAccount.toLowerCase() === contractOwner.toLowerCase() && (
              <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
                <a href="/dashboard" className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                  Admin
                </a>
              </li>
            )}
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a href="/upload" className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                Create
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a href="/explorer" className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                Explorer
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a href="/collections" className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                Authors
              </a>
            </li>
            <li className="max-lg:border-b border-gray-300 max-lg:py-3 px-3">
              <a href={`/account/${currentAccount}` || "/account"} className="hover:text-[#007bff] text-gray-500 block font-semibold text-[15px]">
                Account
              </a>
            </li>
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-3">
          {currentAccount === "" ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2 text-sm rounded-sm font-bold text-white bg-[#a259ff] hover:opacity-70"
            >
              Continue with Metamask
            </button>
          ) : (
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="px-4 py-2 text-sm rounded-sm font-bold text-white bg-[#a259ff] hover:opacity-70"
            >
              Profile
            </button>
          )}

          <button
            onClick={() => setShowCart(!showCart)}
            className="px-4 py-2 text-sm rounded-sm font-bold text-white bg-[#a259ff] hover:opacity-70"
          >
            <ShoppingCart size={24} />
          </button>
        </div>

        {/* Profile Menu */}
        {showProfile && currentAccount && (
          <div className="fixed inset-0 z-50" onClick={() => setShowProfile(false)}>
            <div className="absolute right-4 top-20 w-[96%] md:w-[30%] text-white bg-[#252525] dark:bg-gray-800 border-purple-500 border-2 rounded-md" onClick={e => e.stopPropagation()}>
              <div className="p-4">
                <h2 className="font-bold text-xl flex items-center">
                  {shortenAddress(currentAccount)}
                  <Copy
                    size={16}
                    className="ml-2 cursor-pointer hover:opacity-70"
                    onClick={() => navigator.clipboard.writeText(currentAccount)}
                  />
                </h2>
                <div className="mt-4 space-y-2">
                  <Button
                    className="w-full bg-white text-black hover:bg-black hover:text-white"
                    onClick={() => router.push(`/author/${currentAccount}`)}
                  >
                    Profile
                  </Button>
                  <Button
                    className="w-full bg-white text-black hover:bg-black hover:text-white"
                    onClick={() => router.push(`/account/${currentAccount}`)}
                  >
                    Account settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Menu */}
        {showCart && (
          <div className="fixed inset-0 z-50" onClick={() => setShowCart(false)}>
            <div className="absolute right-4 top-20 w-[96%] md:w-[30%] bg-[#252525] text-white border-purple-500 border-2 rounded-md" onClick={e => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-xl">Your cart</p>
                  <p>
                    <span className="font-bold">{cart_items.length} Items</span>
                    {cart_items.length > 0 && (
                      <button
                        className="ml-4 hover:opacity-70"
                        onClick={() => dispatch(clearCart())}
                      >
                        Clear all
                      </button>
                    )}
                  </p>
                </div>
                
                <ScrollArea className="max-h-72">
                  {cart_items.length === 0 ? (
                    <p className="text-center py-4">No item in cart</p>
                  ) : (
                    cart_items.map((item, index) => (
                      <div
                        key={index}
                        className="group flex justify-between items-center p-2 border-b hover:bg-[#333] cursor-pointer"
                      >
                        <div className="flex" onClick={() => router.push(`/assets/${item.id}`)}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-sm"
                          />
                          <div className="ml-2">
                            <p className="font-bold mb-2">{item.name}</p>
                            <p className="text-sm flex items-center">
                              {shortenAddress(item.owner)}
                              <Copy
                                size={12}
                                className="ml-1 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(item.owner);
                                }}
                              />
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <p className="font-bold">{item.price} ETH</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeFromCart(item.id));
                            }}
                            className="hidden group-hover:block bg-red-500 text-white p-1 rounded-sm"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMenu}
          />
        )}
      </div>
    </header>
  );
};

export default Header;