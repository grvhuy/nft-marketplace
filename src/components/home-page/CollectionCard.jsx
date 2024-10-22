import Image from "next/image";

const CollectionCard = () => {
  return (
    <div className="transition-transform transform hover:scale-95 duration-300">
      <div className="min-w-1/3 mr-4 shadow-md bg-[#3b3b3b] opacity-90 hover:opacity-100 my-4 rounded-2xl">
        <Image
          src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/462534232_1052853119969676_1093995911813386268_n.png?_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeEl1Qfs58HCWe2vceHG4g-mPXxybZtGEkQ9fHJtm0YSRGKSih6lL5jXoclQU3lkdGSA1Hn845yjjv6oQRBI2Fc2&_nc_ohc=4EbyBoIIdFAQ7kNvgEi68R7&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AhB9PvgR8Gn3nVDNfCJZGg6&oh=03_Q7cD1QF0WIPIJ7_PmHR1xjGbVTmY2m5MUe9rl4xca8bcUNvQhw&oe=67300766"
          alt="Example Image"
          // chinh w = 100 vw 
          sizes="100vw"
          width={400}
          height={400}
          className="aspect-[5/3] object-cover rounded-t-2xl"
        />
        <div className="bg-[#3b3b3b] px-4 py-2 text-lg rounded-2xl">
          <h3 className="text-white font-bold">Collection Name</h3>
          <h3 className="text-white">Collection Author</h3>

          <div className="flex justify-between mt-4">
            <div>
              <h3 className="text-white text-sm">Floor</h3>
              <h3 className="text-white">&lt; 0.01</h3>
            </div>
            <div>
              <h3 className="text-white text-sm">Total Volume</h3>
              <h3 className="text-white">2.423 ETH</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
