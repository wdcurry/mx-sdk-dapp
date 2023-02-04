import React, { useEffect } from 'react';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import type { WithClassnameType } from 'UI/types';

import { AddressRow } from './components/AddressRow';
import { LedgerLoading } from '../LedgerLoading';

import globalStyles from 'assets/sass/main.scss';
import styles from './addressTableStyles.scss';

const ADDRESSES_PER_PAGE = 10;

export interface AddressTablePropsType extends WithClassnameType {
  loading: boolean;
  accounts: string[];
  startIndex: number;
  selectedAddress?: string;
  onSelectAddress: (address: { address: string; index: number } | null) => void;
  onGoToPrevPage: () => void;
  onGoToNextPage: () => void;
  onConfirmSelectedAddress: () => void;
}

export const AddressTable = ({
  loading,
  accounts,
  startIndex,
  selectedAddress,
  onGoToPrevPage,
  onGoToNextPage,
  onConfirmSelectedAddress,
  onSelectAddress,
  className = 'dapp-ledger-address-table'
}: AddressTablePropsType) => {
  useEffect(() => {
    const isAccountsLoaded = accounts.length > 0 && !loading;

    const isFirstPageAndNoAddressSelected =
      !selectedAddress && startIndex === 0;

    const shouldSelectFirstAddress =
      isAccountsLoaded && isFirstPageAndNoAddressSelected;
    if (shouldSelectFirstAddress) {
      const index = 0;
      const address = accounts[index];
      onSelectAddress({ address, index });
    }
  }, [accounts, selectedAddress, loading, startIndex]);

  if (loading) {
    return <LedgerLoading />;
  }

  const columns = ['Address', 'Balance', '#'];

  return (
    <div className={classNames(styles.ledgerAddressTableWrapper, className)}>
      <div className={styles.ledgerAddressTableTop}>
        <div className={styles.ledgerAddressTableHeading}>
          Access your wallet
        </div>

        <p className={styles.ledgerAddressTableDescription}>
          Choose the wallet you want to access
        </p>
      </div>

      <div className={styles.ledgerAddressTable}>
        <div className={styles.ledgerAddressTableHeader}>
          {columns.map((column) => (
            <div key={column} className={styles.ledgerAddressTableHeaderItem}>
              {column}
            </div>
          ))}
        </div>

        <div className={styles.ledgerAddressTableBody}>
          {accounts.map((address, index) => (
            <AddressRow
              address={address}
              key={index + startIndex * ADDRESSES_PER_PAGE}
              index={index + startIndex * ADDRESSES_PER_PAGE}
              selectedAddress={selectedAddress}
              onSelectAddress={onSelectAddress}
            />
          ))}
        </div>
      </div>

      <div className={styles.ledgerAddressTableBottom}>
        <div className={styles.ledgerAddressTableNavigation}>
          <button
            type='button'
            onClick={onGoToPrevPage}
            data-testid='prevBtn'
            className={classNames(styles.ledgerAddressTableNavigationButton, {
              [styles.ledgerAddressTableNavigationButtonDisabled]:
                startIndex === 0
            })}
          >
            <FontAwesomeIcon size='1x' icon={faChevronLeft} />

            <span className={styles.ledgerAddressTableNavigationButtonLabel}>
              Prev
            </span>
          </button>

          <button
            type='button'
            onClick={onGoToNextPage}
            data-testid='nextBtn'
            className={classNames(styles.ledgerAddressTableNavigationButton, {
              [styles.ledgerAddressTableNavigationButtonDisabled]:
                accounts.length < 10
            })}
          >
            <span className={styles.ledgerAddressTableNavigationButtonLabel}>
              Next
            </span>

            <FontAwesomeIcon size='1x' icon={faChevronRight} />
          </button>
        </div>

        <button
          disabled={selectedAddress === ''}
          onClick={onConfirmSelectedAddress}
          data-testid='confirmBtn'
          className={classNames(
            globalStyles.btn,
            globalStyles.btnPrimary,
            styles.ledgerAddressTableButton
          )}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
