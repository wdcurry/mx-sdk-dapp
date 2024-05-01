import axios from 'axios';
import { networkStore } from 'lib/sdkDappCore';
import { ServerTransactionType } from 'types';
import {
  GetTransactionsByHashesReturnType,
  PendingTransactionsType
} from 'types/transactions.types';

export const getTransactionsByHashes = async (
  pendingTransactions: PendingTransactionsType
): Promise<GetTransactionsByHashesReturnType> => {
  const apiAddress = networkStore.getState().network.apiAddress;
  const hashes = pendingTransactions.map((tx) => tx.hash);
  const { data: responseData } = await axios.get(`${apiAddress}/transactions`, {
    params: {
      hashes: hashes.join(','),
      withScResults: true
    }
  });

  return pendingTransactions.map(({ hash, previousStatus }) => {
    const txOnNetwork = responseData.find(
      (txResponse: any) => txResponse?.txHash === hash
    );

    return {
      hash,
      data: txOnNetwork?.data,
      invalidTransaction: txOnNetwork == null,
      status: txOnNetwork?.status,
      results: txOnNetwork?.results,
      sender: txOnNetwork?.sender,
      receiver: txOnNetwork?.receiver,
      previousStatus,
      hasStatusChanged: txOnNetwork && txOnNetwork.status !== previousStatus
    };
  });
};

export const getTransactionByHashPromise = (hash: string) => {
  const apiAddress = networkStore.getState().network.apiAddress;

  return axios.get<ServerTransactionType>(
    `${apiAddress}/transactions/${hash}`,
    {
      timeout: 10000 // 10sec
    }
  );
};
