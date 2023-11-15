import React from 'react';

const AboutPage: React.FunctionComponent = () => (
  <>
    <h1>About</h1>

    <p>
      This site tracks the garbage schedule in Kusatsu City. Created by{' '}
      <a href="https://www.pmil.me/">Patrick Miller</a>.
    </p>

    <h2>Credits</h2>

    <p>
      <a href="https://www.city.kusatsu.shiga.jp/shisei/opendata/genryo120160129.html">
        Garbage collection data
      </a>{' '}
      by <a href="https://www.city.kusatsu.shiga.jp">Kusatsu City</a> is
      licensed under{' '}
      <a href="https://creativecommons.org/licenses/by/4.0/deed.ja">
        CC BY 4.0
      </a>
      .
    </p>

    <p>(Note that the data is not currently posted on the website.)</p>
  </>
);

export default AboutPage;
