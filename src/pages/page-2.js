import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h1>Hi from the second page</h1>
    <p>Welcome to page 2</p>
    <script src="https://gist.github.com/violet0sea/1e00e52006ba4b719e061a6bd9d009f4.js?file=keybase.md" />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default SecondPage;
