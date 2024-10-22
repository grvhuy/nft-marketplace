import React from "react";

const testURL =
  "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/462534232_1052853119969676_1093995911813386268_n.png?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEl1Qfs58HCWe2vceHG4g-mPXxybZtGEkQ9fHJtm0YSRGKSih6lL5jXoclQU3lkdGSA1Hn845yjjv6oQRBI2Fc2&_nc_ohc=4EbyBoIIdFAQ7kNvgEi68R7&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AhB9PvgR8Gn3nVDNfCJZGg6&oh=03_Q7cD1QF0WIPIJ7_PmHR1xjGbVTmY2m5MUe9rl4xca8bcUNvQhw&oe=67300766";

const NFTCard = ({ image, name, bid, timeLeft, likes }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64 mt-4">
      <div className="relative">
        <img
          src={testURL}
          alt={name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-white p-1 rounded-full">
          <img src="path/to/icon.png" alt="icon" className="w-4 h-4" />
        </div>
        <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
          <span className="text-sm">{likes} ❤️</span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mt-2">{name}</h3>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="block text-lg font-bold border-[1.5px] border-gray-400 p-2 pt-5 relative">
              <span className="bg-gray-600 text-white p-1 rounded-sm block text-sm absolute -top-2">
                Current Bid
              </span>
              <b className="pt-4">{bid} ETH</b>
            </p>
          </div>
          <div className="text-sm text-gray-500">{timeLeft} left</div>
        </div>
      </div>
    </div>
  );
};

const AuthorCollection = () => {
  const nfts = [
    {
      image: "path/to/image1.jpg",
      name: "Clone #1",
      bid: "15.000",
      timeLeft: "1 hour",
      likes: 22,
    },
    {
      image: "path/to/image2.jpg",
      name: "Clone #2",
      bid: "20.000",
      timeLeft: "2 hours",
      likes: 15,
    },
    {
      image: "path/to/image3.jpg",
      name: "Clone #3",
      bid: "25.000",
      timeLeft: "3 hours",
      likes: 10,
    },
    {
      image: "path/to/image4.jpg",
      name: "Clone #4",
      bid: "30.000",
      timeLeft: "4 hours",
      likes: 5,
    },
    {
      image: "path/to/image5.jpg",
      name: "Clone #5",
      bid: "35.000",
      timeLeft: "5 hours",
      likes: 2,
    },
    {
      image: "path/to/image6.jpg",
      name: "Clone #6",
      bid: "40.000",
      timeLeft: "6 hours",
      likes: 1,
    },
    {
      image: "path/to/image7.jpg",
      name: "Clone #7",
      bid: "45.000",
      timeLeft: "7 hours",
      likes: 0,
    },
    {
      image: "path/to/image8.jpg",
      name: "Clone #8",
      bid: "50.000",
      timeLeft: "8 hours",
      likes: 0,
    },
    {
      image: "path/to/image9.jpg",
      name: "Clone #9",
      bid: "55.000",
      timeLeft: "9 hours",
      likes: 0,
    },
    {
      image: "path/to/image10.jpg",
      name: "Clone #10",
      bid: "60.000",
      timeLeft: "10 hours",
      likes: 0,
    }

    // Add more NFT objects here
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 overflow-x-auto p-4">
      {nfts.map((nft, index) => (
        <NFTCard key={index} {...nft} />
      ))}
    </div>
  );
};

export default AuthorCollection;
