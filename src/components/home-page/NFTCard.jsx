import Image from "next/image";

const NFTCard = () => {
  return (
    <div className="transition-transform transform hover:scale-95 duration-300">
      <div className="min-w-1/3 mr-4 shadow-md bg-[#3b3b3b] opacity-90 hover:opacity-100 my-4 rounded-2xl">
        <Image
          src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.15752-9/462534232_815938844079789_2057753916254853736_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFRZQu-aGUaDNlbbtaKXBTvHvO959x2V0Qe873n3HZXRM6oKBQFLPVsZyNuGzfMnm-agr-G8ofahwKYLRPAfwJR&_nc_ohc=pJR0HnVV4P0Q7kNvgF_Dc7a&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=A-wrBaKK9WBDWCYi0YbOI8m&oh=03_Q7cD1QEMotAdTHi9sj__dC-KWP8VQVCJc3cjRv6n2vZMUOCSGA&oe=67307430"
          alt="Example Image"
          // chinh w = 100 vw 
          sizes="100vw"
          width={400}
          height={400}
          className="aspect-square object-cover rounded-t-2xl"
        />
        <div className="bg-[#3b3b3b] px-4 py-2 text-lg rounded-2xl">
          <h3 className="text-white font-bold">Collection Name</h3>
          <h3 className="text-white">Collection Author</h3>

          <div className="flex justify-between mt-4">
            <div>
              <h3 className="text-white text-sm">Price</h3>
              <h3 className="text-white">0.1 ETH</h3>
            </div>
            <div>
              <h3 className="text-white text-sm">Highest Bid</h3>
              <h3 className="text-white">0.2 ETH</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
