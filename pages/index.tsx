import { NextPage } from 'next';
import React from 'react';
import { Layout } from '../components/Layout';
import { District, getLowDb } from '../config/low-db';
import { plainToClass } from '../config/class-transformer';

const IndexPage: NextPage<{ districts: District[]; navDistricts?: any }> = ({
  districts: districtsPlain,
  navDistricts,
}) => {
  const districts = plainToClass(District, districtsPlain);

  return (
    <Layout title="Gomitrack Districts" navDistricts={navDistricts}>
      <h1>Districts</h1>

      {districts.map((district, index) => {
        const { nameJP, name, addresses } = district;

        return (
          <div className="row" key={index}>
            <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3">
              <h2 style={{ marginTop: '5px' }}>
                <a href={`/districts/${name}`}>
                  <span className="districtJP">{nameJP}</span>
                  <br />
                  <span className="districtEN">{name}</span>
                </a>
              </h2>
            </div>
            <div className="col-xs-12 col-sm-9 col-md-9 col-lg-9">
              <div className="row">
                {addresses.map((addressItem, index) => {
                  const { address, addressJP, zipcodePretty } = addressItem;

                  return (
                    <div
                      className="col-xs-12 col-sm-6 col-md-4 col-lg-4"
                      key={index}
                    >
                      <div className="addresses">
                        <a href={`/districts/${name}`}>{addressJP}</a>
                        <br />
                        {address}
                        <br />〒{zipcodePretty}
                      </div>
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

IndexPage.getInitialProps = async _context => {
  const db = await getLowDb();

  const districts = db
    .get(['districts'])
    .orderBy(['name', 'addresses.addressJP'])
    .value();

  return {
    districts,
  };
};

export default IndexPage;
