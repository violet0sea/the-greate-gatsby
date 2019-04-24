/**
 * @description blog页面的模板文件
 */
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
        <h1>{post.frontmatter.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
