import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Hi people</h1>
    <p style={{ color: 'teal' }}>Welcome to your new Gatsby site.</p>
    <Link to="/page-2/">Go to page 2</Link>
    <Link to="/contact/">Go to page 2</Link>
    <img
      src="https://images.unsplash.com/photo-1523895665936-7bfe172b757d"
      alt=""
    />
  </Layout>
);

export default IndexPage;
