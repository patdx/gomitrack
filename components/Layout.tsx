import Head from 'next/head';
import React from 'react';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  Container,
  Collapse,
} from 'reactstrap';
import Link from 'next/link';

type Props = {
  title?: string;
  navDistricts: {
    nameJP: string;
    name: string;
  }[];
};

export const Layout: React.FunctionComponent<Props> = ({
  children,
  title = 'Gomitrack',
  navDistricts,
}) => (
  <React.Fragment>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Container>
      <Navbar expand="sm" className="px-0">
        <NavbarBrand href="/">
          <img
            src="/images/logo4.svg"
            style={{ width: '200px', height: '40px' }}
          />
        </NavbarBrand>

        <Collapse isOpen={true} navbar>
          <Nav navbar>
            <NavItem>
              <Link href="/">
                <NavLink href="/">Home</NavLink>
              </Link>
            </NavItem>

            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle caret nav>
                Districts
              </DropdownToggle>
              <DropdownMenu>
                {navDistricts.map((district, index) => {
                  return (
                    <Link href={`/districts/${district.name}`} key={index}>
                      <DropdownItem
                        tag="a"
                        href={`/districts/${district.name}`}
                      >
                        {district.nameJP} {district.name}
                      </DropdownItem>
                    </Link>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>

            <NavItem>
              <NavLink href="/about">About</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </Container>

    <Container>{children}</Container>
  </React.Fragment>
);
