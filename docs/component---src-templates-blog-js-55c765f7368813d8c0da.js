(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{144:function(e,t,a){"use strict";a.r(t),a.d(t,"query",function(){return i});var n=a(0),r=a.n(n),l=a(156),u=a(153);t.default=function(e){var t=e.data.markdownRemark;return r.a.createElement(u.a,null,r.a.createElement(l.Helmet,null,r.a.createElement("meta",{name:"keywords",content:t.frontmatter.title}),r.a.createElement("title",null,t.frontmatter.title)),r.a.createElement("div",null,r.a.createElement("h1",null,t.frontmatter.title),r.a.createElement("article",{dangerouslySetInnerHTML:{__html:t.html}})))};var i="3604184052"},149:function(e,t,a){"use strict";a.d(t,"b",function(){return s});var n=a(0),r=a.n(n),l=a(4),u=a.n(l),i=a(33),c=a.n(i);a.d(t,"a",function(){return c.a});a(150);var o=r.a.createContext({}),s=function(e){return r.a.createElement(o.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};s.propTypes={data:u.a.object,query:u.a.string.isRequired,render:u.a.func,children:u.a.func}},150:function(e,t,a){var n;e.exports=(n=a(152))&&n.default||n},151:function(e){e.exports={data:{site:{siteMetadata:{title:"dudulu"}}}}},152:function(e,t,a){"use strict";a.r(t);a(34);var n=a(0),r=a.n(n),l=a(4),u=a.n(l),i=a(55),c=a(2),o=function(e){var t=e.location,a=c.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(i.a,Object.assign({location:t,pageResources:a},a.json))};o.propTypes={location:u.a.shape({pathname:u.a.string.isRequired}).isRequired},t.default=o},153:function(e,t,a){"use strict";var n=a(151),r=a(0),l=a.n(r),u=a(4),i=a.n(u),c=a(149),o=function(e){var t=e.siteTitle;return l.a.createElement("header",{className:"header"},l.a.createElement("h1",null,l.a.createElement(c.a,{to:"/"},t)),l.a.createElement("ul",null,l.a.createElement("li",null,l.a.createElement(c.a,{to:"/about"},"About"))))};o.propTypes={siteTitle:i.a.string},o.defaultProps={siteTitle:""};var s=o,d=(a(157),function(e){var t=e.children;return l.a.createElement(c.b,{query:"755544856",render:function(e){return l.a.createElement(l.a.Fragment,null,l.a.createElement(s,{siteTitle:e.site.siteMetadata.title}),l.a.createElement("div",null,l.a.createElement("main",{className:"main"},t),l.a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",l.a.createElement("a",{href:"https://www.gatsbyjs.org"},"Build by Gatsby"),"  ","🚀")))},data:n})});d.propTypes={children:i.a.node.isRequired};t.a=d}}]);