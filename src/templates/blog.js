import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import Layout from '../components/layout';

export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <Layout>
      <Helmet>
        <meta name="keywords" content={post.frontmatter.title} />
        <title>{post.frontmatter.title}</title>
      </Helmet>
      <div>
        <h3>{post.frontmatter.title}</h3>
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
