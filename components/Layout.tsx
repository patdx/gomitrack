import Head from 'next/head';
import Link from 'next/link';
import React, { forwardRef } from 'react';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  NavbarBrand,
} from 'reactstrap';

type Props = {
  title?: string;
};

// There seems to be some warning about accessing the ref. This does not
// seem to provide the ref but it does suppress the error.
const Brand = forwardRef((_props, ref) => (
  <NavbarBrand {...{ref: ref as any}}>
    <img src="/images/logo4.svg" style={{ width: '200px', height: '40px' }} />
  </NavbarBrand>
));

export const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'Gomitrack',
}) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Container>
        <Navbar expand="sm" className="px-0">
          <Link href="/" passHref>
            <Brand />
          </Link>

          <Collapse isOpen={true} navbar>
            <Nav navbar>
              <NavItem>
                <Link href="/" passHref>
                  <NavLink>Districts</NavLink>
                </Link>
              </NavItem>

              <NavItem>
                <Link href="/about" passHref>
                  <NavLink>About</NavLink>
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </Container>

      <Container>{children}</Container>
    </React.Fragment>
  );
};
