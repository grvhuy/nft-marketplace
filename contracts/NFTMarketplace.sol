// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    uint256 private _tokenIds;
    uint256 private _itemsSold;

    uint256 listingPrice = 0.0025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address creator;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "only owner of the marketplace can change listing price"
        );
        _;
    }

    // Whoever deploy smart contract is the owner of the smart contract
    constructor() ERC721("Metaverse Tokens", "METTOKEN") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(
        uint256 _listingPrice
    ) public payable onlyOwner {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract
        view: listing price is a state variable, we use view to read the state, 
        returns: returnn any value
    */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            msg.sender,
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold--;

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold++;

        _transfer(address(this), msg.sender, tokenId);
        payable(owner).transfer(listingPrice);
        payable(seller).transfer(msg.value);

        // tokenTransactionHistory[tokenId].push(Transaction(msg.sender, seller, price, block.timestamp));
        // emit TransactionCompleted(tokenId, msg.sender, seller, price, block.timestamp);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds;

        uint256 unsoldItemCount = _itemsSold > _tokenIds
            ? 0
            : (_tokenIds - _itemsSold);
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMarketItemsByIds(
        uint256[] memory tokenIds
    ) public view returns (MarketItem[] memory) {
        uint256 tokenCount = tokenIds.length;
        MarketItem[] memory items = new MarketItem[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            uint256 tokenId = tokenIds[i];
            items[i] = idToMarketItem[tokenId];
        }

        return items;
    }

    function fetchMarketItemById(
        uint256 tokenId
    ) public view returns (MarketItem memory) {
        return idToMarketItem[tokenId];
    }

    function fetchNFTsByOwner(
        address ownerAddress
    ) public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == ownerAddress) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == ownerAddress) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchNFTsListedBySeller(
        address sellerAddress
    ) public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds;
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].seller == sellerAddress &&
                idToMarketItem[i + 1].sold == false
            ) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToMarketItem[i + 1].seller == sellerAddress &&
                idToMarketItem[i + 1].sold == false
            ) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // AUCTION
    struct Auction {
        uint256 tokenId;
        address payable seller;
        uint256 startingPrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool active;
    }

    mapping(uint256 => Auction) private idToAuction;

    event AuctionCreated(
        uint256 indexed tokenId,
        address seller,
        uint256 startingPrice,
        uint256 endTime
    );

    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 bidAmount);

    event AuctionEnded(
        uint256 indexed tokenId,
        address winner,
        uint256 winningBid
    );

    function startAuction(
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    ) public {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only owner can start auction"
        );
        require(idToMarketItem[tokenId].sold == true, "Item is already sold");

        require(
            !idToAuction[tokenId].active ||
                block.timestamp >= idToAuction[tokenId].endTime,
            "An active auction already exists for this item"
        );  

        idToAuction[tokenId] = Auction(
            tokenId,
            payable(msg.sender),
            startingPrice,
            0,
            payable(address(0)),
            block.timestamp + duration,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
        emit AuctionCreated(
            tokenId,
            msg.sender,
            startingPrice,
            block.timestamp + duration
        );
    }

    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = idToAuction[tokenId];
        require(auction.active, "Auction ended");
        require(block.timestamp < auction.endTime, "Auction expired");
        require(msg.value > auction.highestBid, "Bid amount too low");

        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        emit BidPlaced(tokenId, msg.sender, msg.value);
    }

    function endAuction(uint256 tokenId) public {
        Auction storage auction = idToAuction[tokenId];
        require(auction.active, "Auction ended or not exist");
        require(block.timestamp >= auction.endTime, "Autction not yet ended");
        auction.active = false;

        if (auction.highestBidder != address(0)) {
            idToMarketItem[tokenId].owner = auction.highestBidder;
            idToMarketItem[tokenId].sold = true;
            _itemsSold++;

            _transfer(address(this), auction.highestBidder, tokenId);
            auction.seller.transfer(auction.highestBid);
            emit AuctionEnded(
                tokenId,
                auction.highestBidder,
                auction.highestBid
            );
        } else {
            _transfer(address(this), auction.seller, tokenId);
        }
    }

    function fetchAuction(
        uint256 tokenId
    ) public view returns (Auction memory) {
        Auction memory auction = idToAuction[tokenId];
        require(auction.active, "Auction ended or not exist");
        return auction;
    }

    function fetchActiveAuctions() public view returns (Auction[] memory) {
        uint256 totalItemCount = _tokenIds;
        uint256 activeAuctionCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToAuction[i].active) {
                activeAuctionCount += 1;
            }
        }

        Auction[] memory activeAuctions = new Auction[](activeAuctionCount);
        for (uint256 i = 1; i <= totalItemCount; i++) {
            if (idToAuction[i].active) {
                Auction storage currentAuction = idToAuction[i];
                activeAuctions[currentIndex] = currentAuction;
                currentIndex += 1;
            }
        }
        return activeAuctions;
    }
}
