import {
  HomePage,
  AttributesPage,
  BuyBoxPage,
  MyNftsPage,
  MyShopPage,
  AllPopsPage,
  MarketDetailPage,
  AuctionDetailPage,
  PopDetailPage,
} from "../pages";


const appRoutes = {

  home: {
    path: '/',
    component: <HomePage/>
  },
  allPops: {
    path: '/all-pops',
    component: <AllPopsPage/>
  },
  buyBox: {
    path: '/box',
    component: <BuyBoxPage/>
  },
  attributes: {
    path: '/attributes',
    component: <AttributesPage/>
  },
  myNfts: {
    path: '/my-nfts',
    component: <MyNftsPage/>
  },
  myShop: {
    path: '/my-shop',
    component: <MyShopPage/>
  },

  faq: {
    path: '/faq',
    component: <HomePage/>
  },
  popDetail: {
    path: '/pop/:id',
    component: <PopDetailPage/>,
    getPath: (id: string) => `/pop/${id}`,
  },
  marketDetail: {
    path: '/market/:id',
    component: <MarketDetailPage/>,
    getPath: (id: string) => `/market/${id}`,
  },
  auctionDetail: {
    path: '/auction/:id',
    getPath: (id: string) => `/auction/${id}`,
    component: <AuctionDetailPage/>
  }

  // idPops: {
  //     path: `/pop/:nft${connection.idPops}`,
  //     component: PersonalPagePop
  // },


}

export default appRoutes;
