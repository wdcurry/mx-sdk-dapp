import React, { ReactNode } from 'react';
import classNames from 'classnames';

import styled, { css, ThemeProvider } from 'styled-components';
import globalStyles from 'assets/sass/main.scss';
import { WithClassnameType } from '../types';

import styles from './loginButtonStyles.scss';

const DEFAULT_STYLE = {
  color: '#ffff',
  backgroundColor: '#1b46c2',
  borderColor: '#0062cc',
  boxShadow: '0 0 0 0.2rem rgba(38, 143, 255, 0.5)',
  display: 'inline-block',
  fontWeight: 400,
  textAlign: 'center',
  verticalAlign: 'middle',
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  userSelect: 'none',
  border: '1px solid transparent',
  padding: '0.375rem 0.75rem',
  fontSize: '1rem',
  lineHeight: 1.5,
  borderRadius: '0.25rem',
  transition:
    'color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  cursor: 'pointer',
  margin: '0.25rem'
};

const StyledButton = styled.button`
  ${(props) => props.theme.toRawCSS(DEFAULT_STYLE, { padding: '20px' })}
`;

const getTheme = (
  defaultStyle: any,
  extraStyle: string | Record<string, any> | null = null
) => {
  if (extraStyle && typeof extraStyle === 'object') {
    return css({ ...defaultStyle, ...extraStyle });
  }

  return css(defaultStyle);
};

export interface LoginButtonPropsType extends WithClassnameType {
  onLogin: () => void;
  text?: string;
  btnClassName?: string;
  children?: ReactNode;
  disabled?: boolean;
}

export const LoginButton = ({
  onLogin,
  text = 'Default Login Button',
  className = 'dapp-login-button',
  btnClassName = 'dapp-default-login-button',
  disabled,
  'data-testid': dataTestId,
  children
}: LoginButtonPropsType) => {
  const classes = {
    wrapper: classNames(
      globalStyles.btn,
      globalStyles.btnPrimary,
      globalStyles.px4,
      globalStyles.m1,
      globalStyles.mx3,
      {
        [btnClassName]: btnClassName != null
      },
      className
    ),
    loginText: styles.loginText,
    wrapperClassName: className
  };

  return (
    <ThemeProvider
      theme={{
        toRawCSS: getTheme
      }}
    >
      <StyledButton
        data-testid={dataTestId}
        disabled={disabled}
        className={className}
        onClick={onLogin}
      >
        {children || <span className={classes.loginText}>{text}</span>}
      </StyledButton>
    </ThemeProvider>
  );
};
