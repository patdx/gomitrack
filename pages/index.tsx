import mingo from 'mingo';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Layout } from '../components/Layout';
import { formatZip } from '../utils/collection-area';
import { CollectionDistrict } from '../utils/collection-district';
import { getDatabase } from '../utils/database';

// const A = forwardRef<HTMLAnchorElement>((props, ref) => (
//   <a {...props} ref={ref} />
// ));

const IndexPage: NextPage<{ districts: CollectionDistrict[] }> = ({
  districts,
}) => {
  return (
    <Layout title="Gomitrack Districts">
      <h1>Districts</h1>

      <div className="d-grid gap-4">
        {districts.map((district, index) => {
          const { nameJP, name, addresses } = district;

          return (
            <div className="row gy-2" key={index}>
              <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
                <h2 className="h-100">
                  <Link
                    href={`/districts/${name}`}
                    className="btn h-100 btn-lg d-block text-start btn-outline-light text-dark"
                  >
                    <div>{nameJP}</div>
                    <div>{name}</div>
                  </Link>
                </h2>
              </div>
              <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                <div className="row gy-2">
                  {addresses.map((addressItem, index) => {
                    const { address, addressJP } = addressItem;

                    return (
                      <div
                        className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
                        key={index}
                      >
                        <Link
                          href={`/districts/${encodeURIComponent(name)}`}
                          className="card p-0 shadow-sm text-decoration-none text-start btn btn-outline-light"
                        >
                          <div className="card-body">
                            <div className="text-dark">{addressJP}</div>
                            <div className="text-muted">{address}</div>
                            <div className="text-black-50">
                              〒{formatZip(addressItem)}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (_context) => {
  const db = await getDatabase();

  const districts = mingo
    .find(db.districts ?? [], {})
    .sort({
      name: 1,
      'addresses.addressJP': 1,
    })
    .all();

  return {
    props: {
      districts,
    },
  };
};

export default IndexPage;
