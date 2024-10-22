import AuthorCard from "../../../components/AuthorCard";
import AuthorCollection from "../../../components/AuthorCollection";
import AuthorFilters from "../../../components/AuthorFilters";

const CollectionPage = () => {
  return (
    <div className="mx-20 min-h-screen">
      <AuthorCard />
      <AuthorFilters />
      <AuthorCollection />
    </div>
  )
}

export default CollectionPage;