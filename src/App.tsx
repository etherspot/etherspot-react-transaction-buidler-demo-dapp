import React, { useMemo } from 'react';
import { Etherspot, TRANSACTION_BLOCK_TYPE } from '@etherspot/react-transaction-buidler';
import { ethers } from 'ethers';

const App = () => {
  const walletProvider = useMemo(() => {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }, []);

  return (
    <div>
      <Etherspot
        defaultTransactionBlocks={[{ type: TRANSACTION_BLOCK_TYPE.ASSET_BRIDGE_TRANSACTION }]}
        provider={walletProvider}
      />
    </div>
  );
}

export default App;
