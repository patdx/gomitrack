/* <Head>
<title>{title}</title>
<meta charSet="utf-8" />
<meta name="viewport" content="initial-scale=1.0, width=device-width" />
</Head> */

import '../client/styles.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavItem,
  NavLink,
} from '../components/reactstrap';
import logoSvg from '../assets/logo.svg';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gomitrack',
  description: 'Garbage schedule for Kusatsu City, Shiga',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Container>
          <Navbar expand="sm" className="px-0">
            <Link href="/" className="navbar-brand">
              <Image
                aria-label="Gomitrack"
                src={logoSvg}
                unoptimized
                width={200}
                height={40}
                priority
              />
            </Link>

            <Collapse isOpen={true} navbar>
              <Nav navbar>
                <NavItem>
                  <Link href="/" passHref legacyBehavior>
                    <NavLink>Districts</NavLink>
                  </Link>
                </NavItem>

                <NavItem>
                  <Link href="/about" passHref legacyBehavior>
                    <NavLink>About</NavLink>
                  </Link>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </Container>
        <Container>{children}</Container>
      </body>
    </html>
  );
}
