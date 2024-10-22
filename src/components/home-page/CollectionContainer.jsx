import CollectionCard from "./CollectionCard";

const CollectionContainer = () => {
  return (
    <div className="mx-40 pt-16 mb-8">
      <h1 className="text-white text-4xl font-bold">Trending Collection</h1>
      <h3 className="text-white text-xl ">Checkout Our Weekly Updated Trending Collection.</h3>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 justify-center">
        <CollectionCard/>
        <CollectionCard/>
        <CollectionCard/>
      </div>
    </div>
  )
}

export default CollectionContainer;