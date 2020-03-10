import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Layout } from '../components/Layout';
import { plainToClass } from '../utils/class-transformer';
import { District, getLowDb } from '../utils/low-db';
import styles from './index.module.css';

// const A = forwardRef<HTMLAnchorElement>((props, ref) => (
//   <a {...props} ref={ref} />
// ));

const IndexPage: NextPage<{ districts: District[] }> = ({
  districts: districtsPlain,
}) => {
  const districts = plainToClass(District, districtsPlain);

  return (
    <Layout title="Gomitrack Districts">
      <h1>Districts</h1>

      {districts.map((district, index) => {
        const { nameJP, name, addresses } = district;

        return (
          <div className="row" key={index}>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <h2 style={{ marginTop: '5px' }}>
                <Link href="/districts/[district]" as={`/districts/${name}`}>
                  <a className={`text-decoration-none`}>
                    <div className={`districtJP ${styles.underlineOnHover}`}>
                      {nameJP}
                    </div>
                    <div className="districtEN">{name}</div>
                  </a>
                </Link>
              </h2>
            </div>
            <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
              <div className="row">
                {addresses.map((addressItem, index) => {
                  const { address, addressJP } = addressItem;

                  return (
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
                      key={index}
                    >
                      <Link
                        href="/districts/[district]"
                        as={`/districts/${name}`}
                      >
                        <Card
                          className="my-2 text-decoration-none shadow-sm"
                          tag="a"
                        >
                          <CardBody>
                            <div className={styles.underlineOnHover}>
                              {addressJP}
                            </div>
                            <div className="text-muted">{address}</div>
                            <div className="text-black-50">
                              〒{addressItem.zipcodePretty()}
                            </div>
                          </CardBody>
                        </Card>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async _context => {
  const db = await getLowDb(undefined as any);

  const districts = db
    .get(['districts'])
    .orderBy(['name', 'addresses.addressJP'])
    .value();

  return {
    props: {
      districts,
    },
  };
};

export default IndexPage;
