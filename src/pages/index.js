import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

    <ul>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <li key={node.id}>
          <Link to={node.frontmatter.path}>
            <h3>{node.frontmatter.title}</h3>
            <span>{node.frontmatter.date}</span>
            <p>{node.excerpt}</p>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
);

export const query = graphql`
  query homepagePostQuery {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
            date
            path
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`;

export default IndexPage;
