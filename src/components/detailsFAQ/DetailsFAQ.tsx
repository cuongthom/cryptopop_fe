import React from 'react'

function DetailsFAQ() {
  return (
    <div className="flex ">
            <div className="w-1/2">
              <p className="pt-6 text-3xl font-bold">Details and FAQ</p>
              <div>
                <div className="pt-8">
                  <h3 className="font-medium text-xl">
                    Which blockchain will be used ?
                  </h3>
                  <p className="text-slate-500 text-lg pt-4 pb-8">
                    CryptoPops will be deployed on the Binance Smart Chain.
                  </p>
                  <p className="text-slate-500 text-lg">
                    Binance Smart Chain (BSC) has its own NFT standards: BEP-721
                    and BEP-1155. These two provide similar functionality
                    Ethereum standards. Both have become attractive for creators
                    looking to mint NFTs as the cost is substantially lower than
                    Ethereum.
                  </p>
                </div>
                <div className="pt-8">
                  <h3 className="font-medium text-xl">
                    Do you charge any fees for transactions?
                  </h3>
                  <p className="text-slate-500 text-lg pt-4 pb-4">
                    No. We charge no fees for Cryptopops transacted through the
                    built-in market beyond the ones charged by BNB (gas).
                  </p>
                </div>
                <div className="pt-8">
                  <h3 className="font-medium text-xl">Why CryptoPops?</h3>
                  <p className="text-slate-500 text-lg pt-4 pb-4">
                    When you buy an CryptoPops, you’re not simply buying a
                    simple NFT, you are getting access to a community where
                    benefits and utilities will increase with the time.
                  </p>
                </div>
                <div className="pt-8">
                  <h3 className="font-medium text-xl">
                    Where i will be able to see my Pop NFT?
                  </h3>
                  <p className="text-slate-500 text-lg pt-4 pb-4">
                    Once you have minted a Pop NFT, you will be able to see it
                    by connecting your wallet to our platform.
                  </p>
                </div>
                <div className="pt-8">
                  <h3 className="font-medium text-xl">
                    Will the team mint NFTs ?
                  </h3>
                  <p className="text-slate-500 text-lg pt-4 pb-4">
                    The team will mint:
                    <div>
                      <p>
                        100 NFTs to help sustaining the activity on the longrun
                        and reward the faithfull soldiers that have been helping
                        from day 1
                      </p>
                      <p>
                        200 NFTs for the community, influencers and partners
                        giveaways.
                      </p>
                    </div>
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/2 h-full text-center ">
              <img
                className="leading-10"
                src="/image/DetailsandFAQ.6524b8a8.png"
              />
            </div>
          </div>
  )
}

export default DetailsFAQ