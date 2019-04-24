---
path: '/blog/2019/dayone'
title: 'how to use gatsby to develop a blog'
date: '2019-04-21'
---

Gatsby 是一个基于 React 和 Graphql 的静态 html 构建网站，使用 SSR 技术；在用于博客搭建时，使用 markdown 文件写作；原理就是通过文件系统加载 markdown 文件，然后使用 markdownRemark 转化为 html，然后在利用 graphql 获取相应的数据，通过 templates 模板渲染出 Dom。

## 快速开始

1. 为了使用 gatsby-cli，建议全局安装

```sh
$ yarn add gatsby -g
or npm add gatsby -g
```

2. 使用 gatsby **new** 新建一个项目，安装项目依赖

```sh
$ gatsby new <project-name>
cd <project-name>
yarn install
```

3. 启动项目

```sh
$ gatsby develop
or  yarn start
or  yarn develop
```

4. 打开http://localhost:8000

一个基本的骨架搭建完毕，快速教程参考
[creating a blog with gatsby](https://www.gatsbyjs.org/blog/2017-07-19-creating-a-blog-with-gatsby/)

## 关键点

1. 安装**gatsby-source-filesystem** 和 **gatsby-transformer-remark** 两个插件分别用于文件读取和文件转化
1. markdown 文件里含有 frontmatter 部分，这些数据都会被转化并注入到 react 组建里以供使用

```
---
path: '/define-path-to-you-blog'
title: 'how to use gatsby to develop a blog'
date: '2019-04-21'
---
```

，其中 path 字段可以用来规定页面路由，实际上使用文件的路径也是可行的，但是使用 path 字段的灵活性会更好；要实现使用 path 作为路由需要变更两个地方：

1. gatsby-node.js 文件里的 createPage 方法里的 path 需要通过 graphql 获取并指定

```js
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path // 获取markdown里的path
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `).then(result => {
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path, // 设置为对应的path
        component: path.resolve('./src/templates/blog.js'),
        context: {
          slug: node.fields.slug,
        },
      });
    });
  });
};
```

1. 路由条状的地方也需要通过 graphql 获取 path

```js
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
```
