(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{145:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),i=a(153),o=a(154);t.default=function(){return r.a.createElement(i.a,null,r.a.createElement(o.a,{title:"404: Not found"}),r.a.createElement("h1",null,"NOT FOUND"),r.a.createElement("p",null,"You just hit a route that doesn't exist... the sadness."))}},149:function(e,t,a){"use strict";a.d(t,"b",function(){return s});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),u=a(33),c=a.n(u);a.d(t,"a",function(){return c.a});a(150);var l=r.a.createContext({}),s=function(e){return r.a.createElement(l.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};s.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},150:function(e,t,a){var n;e.exports=(n=a(152))&&n.default||n},151:function(e){e.exports={data:{site:{siteMetadata:{title:"dudulu"}}}}},152:function(e,t,a){"use strict";a.r(t);a(34);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),u=a(55),c=a(2),l=function(e){var t=e.location,a=c.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(u.a,Object.assign({location:t,pageResources:a},a.json))};l.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=l},153:function(e,t,a){"use strict";var n=a(151),r=a(0),i=a.n(r),o=a(4),u=a.n(o),c=a(149),l=function(e){var t=e.siteTitle;return i.a.createElement("header",{className:"header"},i.a.createElement("h1",null,i.a.createElement(c.a,{to:"/"},t)),i.a.createElement("ul",null,i.a.createElement("li",null,i.a.createElement(c.a,{to:"/about"},"About"))))};l.propTypes={siteTitle:u.a.string},l.defaultProps={siteTitle:""};var s=l,d=(a(157),function(e){var t=e.children;return i.a.createElement(c.b,{query:"755544856",render:function(e){return i.a.createElement(i.a.Fragment,null,i.a.createElement(s,{siteTitle:e.site.siteMetadata.title}),i.a.createElement("div",null,i.a.createElement("main",{className:"main"},t),i.a.createElement("footer",null,"© ",(new Date).getFullYear(),", Built with"," ",i.a.createElement("a",{href:"https://www.gatsbyjs.org"},"Build by Gatsby"),"  ","🚀")))},data:n})});d.propTypes={children:u.a.node.isRequired};t.a=d},154:function(e,t,a){"use strict";var n=a(155),r=a(0),i=a.n(r),o=a(4),u=a.n(o),c=a(156),l=a.n(c);function s(e){var t=e.description,a=e.lang,r=e.meta,o=e.keywords,u=e.title,c=n.data.site,s=t||c.siteMetadata.description;return i.a.createElement(l.a,{htmlAttributes:{lang:a},title:u,titleTemplate:"%s | "+c.siteMetadata.title,meta:[{name:"description",content:s},{property:"og:title",content:u},{property:"og:description",content:s},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:c.siteMetadata.author},{name:"twitter:title",content:u},{name:"twitter:description",content:s}].concat(o.length>0?{name:"keywords",content:o.join(", ")}:[]).concat(r)})}s.defaultProps={lang:"en",meta:[],keywords:[],description:""},s.propTypes={description:u.a.string,lang:u.a.string,meta:u.a.arrayOf(u.a.object),keywords:u.a.arrayOf(u.a.string),title:u.a.string.isRequired},t.a=s},155:function(e){e.exports={data:{site:{siteMetadata:{title:"dudulu",description:"dudulu's blog, write, code, listen to music, watch movie, etc",author:"dudulu"}}}}}}]);