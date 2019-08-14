(window.webpackJsonp = window.webpackJsonp || []).push([
  [6],
  {
    147(e, t, a) {
      a.r(t),
      a.d(t, 'query', () => {
        return c;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(150);
      const l = a(154);
      const o = a(155);
      var c = (a(167), '1946043975');
      t.default = function(e) {
        const t = e.data;
        return r.a.createElement(
          l.a,
          null,
          r.a.createElement(o.a, {
            title: 'Home',
            keywords: ['gatsby', 'application', 'react'],
          }),
          r.a.createElement(
            'ul',
            null,
            t.allMarkdownRemark.edges.map((e) => {
              const t = e.node;
              return r.a.createElement(
                'li',
                { key: t.id, className: 'blog-list' },
                r.a.createElement(
                  i.a,
                  { to: t.frontmatter.path },
                  r.a.createElement('h3', null, t.frontmatter.title),
                  r.a.createElement('span', null, t.frontmatter.date),
                  r.a.createElement('p', null, t.excerpt),
                ),
              );
            }),
          ),
        );
      };
    },
    150(e, t, a) {
      a.d(t, 'b', () => {
        return s;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const l = a.n(i);
      const o = a(33);
      const c = a.n(o);
      a.d(t, 'a', () => {
        return c.a;
      });
      a(151);
      const u = r.a.createContext({});
      var s = function(e) {
        return r.a.createElement(u.Consumer, null, (t) => {
          return e.data || (t[e.query] && t[e.query].data)
            ? (e.render || e.children)(e.data ? e.data.data : t[e.query].data)
            : r.a.createElement('div', null, 'Loading (StaticQuery)');
        });
      };
      s.propTypes = {
        data: l.a.object,
        query: l.a.string.isRequired,
        render: l.a.func,
        children: l.a.func,
      };
    },
    151(e, t, a) {
      let n;
      e.exports = ((n = a(153)) && n.default) || n;
    },
    152(e) {
      e.exports = { data: { site: { siteMetadata: { title: 'dudulu' } } } };
    },
    153(e, t, a) {
      a.r(t);
      a(34);
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const l = a.n(i);
      const o = a(55);
      const c = a(2);
      const u = function(e) {
        const t = e.location;
        const a = c.default.getResourcesForPathnameSync(t.pathname);
        return r.a.createElement(
          o.a,
          Object.assign({ location: t, pageResources: a }, a.json),
        );
      };
      (u.propTypes = {
        location: l.a.shape({ pathname: l.a.string.isRequired }).isRequired,
      }),
      (t.default = u);
    },
    154(e, t, a) {
      const n = a(152);
      const r = a(0);
      const i = a.n(r);
      const l = a(4);
      const o = a.n(l);
      const c = a(150);
      const u = function(e) {
        const t = e.siteTitle;
        return i.a.createElement(
          'header',
          { className: 'header' },
          i.a.createElement(
            'h1',
            null,
            i.a.createElement(c.a, { to: '/' }, t),
          ),
          i.a.createElement(
            'ul',
            null,
            i.a.createElement(
              'li',
              null,
              i.a.createElement(c.a, { to: '/about' }, 'About'),
            ),
          ),
        );
      };
      (u.propTypes = { siteTitle: o.a.string }),
      (u.defaultProps = { siteTitle: '' });
      const s = u;
      const d = (a(158),
      function(e) {
        const t = e.children;
        return i.a.createElement(c.b, {
          query: '755544856',
          render(e) {
            return i.a.createElement(
              i.a.Fragment,
              null,
              i.a.createElement(s, { siteTitle: e.site.siteMetadata.title }),
              i.a.createElement(
                'div',
                null,
                i.a.createElement('main', { className: 'main' }, t),
                i.a.createElement(
                  'footer',
                  null,
                  '© ',
                  new Date().getFullYear(),
                  ', Built with',
                  ' ',
                  i.a.createElement(
                    'a',
                    { href: 'https://www.gatsbyjs.org' },
                    'Build by Gatsby',
                  ),
                  '  ',
                  '🚀',
                ),
              ),
            );
          },
          data: n,
        });
      });
      d.propTypes = { children: o.a.node.isRequired };
      t.a = d;
    },
    155(e, t, a) {
      const n = a(156);
      const r = a(0);
      const i = a.n(r);
      const l = a(4);
      const o = a.n(l);
      const c = a(157);
      const u = a.n(c);
      function s(e) {
        const t = e.description;
        const a = e.lang;
        const r = e.meta;
        const l = e.keywords;
        const o = e.title;
        const c = n.data.site;
        const s = t || c.siteMetadata.description;
        return i.a.createElement(u.a, {
          htmlAttributes: { lang: a },
          title: o,
          titleTemplate: `%s | ${c.siteMetadata.title}`,
          meta: [
            { name: 'description', content: s },
            { property: 'og:title', content: o },
            { property: 'og:description', content: s },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: c.siteMetadata.author },
            { name: 'twitter:title', content: o },
            { name: 'twitter:description', content: s },
          ]
            .concat(
              l.length > 0 ? { name: 'keywords', content: l.join(', ') } : [],
            )
            .concat(r),
        });
      }
      (s.defaultProps = {
        lang: 'en',
        meta: [],
        keywords: [],
        description: '',
      }),
      (s.propTypes = {
        description: o.a.string,
        lang: o.a.string,
        meta: o.a.arrayOf(o.a.object),
        keywords: o.a.arrayOf(o.a.string),
        title: o.a.string.isRequired,
      }),
      (t.a = s);
    },
    156(e) {
      e.exports = {
        data: {
          site: {
            siteMetadata: {
              title: 'dudulu',
              description:
                "dudulu's blog, write, code, listen to music, watch movie, etc",
              author: 'dudulu',
            },
          },
        },
      };
    },
  },
]);
// # sourceMappingURL=component---src-pages-index-js-24ba38a0e648c96df336.js.map
