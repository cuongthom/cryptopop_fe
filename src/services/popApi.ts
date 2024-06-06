import axiosClient from "./axiosClient";

const popApi = {
  getNftMetaData: async (nftId: number) => {
    const url = "/image/" + nftId;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNftAuctionData: async (auctionId: number) => {
    const url = "/auction?auctionId=" + auctionId;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNftType: async (types: string) => {
    const url = "/attribute?type=" + types;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNftAttributesSearch: async (Attributes: string) => {
    const url = "/nft/search?q=" + Attributes;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNft: async () => {
    const url = "/nft";
    const resp = await axiosClient.get(url);
    return resp.data;
  },
  getNftMetaDataImage: async () => {
    const url = "/image/";
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNftAttributesSearchType: async (Attributes: string) => {
    const url = "/attribute?type=" + Attributes;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getNftAttributesSearchValue: async (Attributes: string) => {
    const url = "/attribute?value=" + Attributes;
    const resp = await axiosClient.get(url);
    return resp;
  },
  getSigner: async (body: any) => {
    const url = "/api-v1/mercenarie/detached";
    const resp = await axiosClient.post(url,body);
    return resp;
  },
};

export default popApi;
