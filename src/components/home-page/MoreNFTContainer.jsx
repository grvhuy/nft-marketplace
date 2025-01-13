import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NFTCard from "./NFTCard";
import NFTMarketplaceContext from "../../../Context/NFTMarketplaceContext";

function MoreNFTContainer() {
  const [nfts, setNfts] = React.useState([]);
  const { fetchNFTs } = React.useContext(NFTMarketplaceContext);

  React.useEffect(() => {
    fetchNFTs().then((res) => {
      setNfts(res);
      console.log("res", res);
    });
  }, []);

  return (
    <div className="mx-40 pt-8 mb-8">
      <h1 className="text-white text-4xl font-bold">Discover More Nfts</h1>
      <h3 className="text-white text-xl ">Explore New Trending Nfts.</h3>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full mt-12"
      >
        <CarouselContent>
          {nfts.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
              <div className="flex aspect-square items-center justify-center ">
                <NFTCard
                  name={item.name}
                  author={item.seller}
                  price={item.price}
                  image={item.image}
                  key={index}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default MoreNFTContainer;
