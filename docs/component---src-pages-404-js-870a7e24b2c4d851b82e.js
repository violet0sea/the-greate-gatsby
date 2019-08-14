(window.webpackJsonp = window.webpackJsonp || []).push([
  [3],
  {
    142(t, e, a) {
      a.r(e);
      const n = a(0);
      const r = a.n(n);
      const i = a(153);
      const o = a(151);
      e.default = function() {
        return r.a.createElement(
          i.a,
          null,
          r.a.createElement(o.a, { title: '404: Not found' }),
          r.a.createElement('h1', null, 'NOT FOUND'),
          r.a.createElement(
            'p',
            null,
            "You just hit a route that doesn't exist... the sadness.",
          ),
        );
      };
    },
    147(t, e, a) {
      a.d(e, 'b', () => {
        return u;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const s = a(33);
      const c = a.n(s);
      a.d(e, 'a', () => {
        return c.a;
      });
      a(148);
      const l = r.a.createContext({});
      var u = function(t) {
        return r.a.createElement(l.Consumer, null, (e) => {
          return t.data || (e[t.query] && e[t.query].data)
            ? (t.render || t.children)(t.data ? t.data.data : e[t.query].data)
            : r.a.createElement('div', null, 'Loading (StaticQuery)');
        });
      };
      u.propTypes = {
        data: o.a.object,
        query: o.a.string.isRequired,
        render: o.a.func,
        children: o.a.func,
      };
    },
    148(t, e, a) {
      let n;
      t.exports = ((n = a(150)) && n.default) || n;
    },
    149(t) {
      t.exports = {
        data: { site: { siteMetadata: { title: 'Gatsby Default Starter' } } },
      };
    },
    150(t, e, a) {
      a.r(e);
      a(34);
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const s = a(55);
      const c = a(2);
      const l = function(t) {
        const e = t.location;
        const a = c.default.getResourcesForPathnameSync(e.pathname);
        return r.a.createElement(
          s.a,
          Object.assign({ location: e, pageResources: a }, a.json),
        );
      };
      (l.propTypes = {
        location: o.a.shape({ pathname: o.a.string.isRequired }).isRequired,
      }),
      (e.default = l);
    },
    151(t, e, a) {
      const n = a(152);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const s = a.n(o);
      const c = a(155);
      const l = a.n(c);
      function u(t) {
        const e = t.description;
        const a = t.lang;
        const r = t.meta;
        const o = t.keywords;
        const s = t.title;
        const c = n.data.site;
        const u = e || c.siteMetadata.description;
        return i.a.createElement(l.a, {
          htmlAttributes: { lang: a },
          title: s,
          titleTemplate: `%s | ${c.siteMetadata.title}`,
          meta: [
            { name: 'description', content: u },
            { property: 'og:title', content: s },
            { property: 'og:description', content: u },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: c.siteMetadata.author },
            { name: 'twitter:title', content: s },
            { name: 'twitter:description', content: u },
          ]
            .concat(
              o.length > 0 ? { name: 'keywords', content: o.join(', ') } : [],
            )
            .concat(r),
        });
      }
      (u.defaultProps = {
        lang: 'en',
        meta: [],
        keywords: [],
        description: '',
      }),
      (u.propTypes = {
        description: s.a.string,
        lang: s.a.string,
        meta: s.a.arrayOf(s.a.object),
        keywords: s.a.arrayOf(s.a.string),
        title: s.a.string.isRequired,
      }),
      (e.a = u);
    },
    152(t) {
      t.exports = {
        data: {
          site: {
            siteMetadata: {
              title: 'Gatsby Default Starter',
              description:
                'Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.',
              author: '@gatsbyjs',
            },
          },
        },
      };
    },
    153(t, e, a) {
      const n = a(149);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const s = a.n(o);
      const c = a(147);
      const l = function(t) {
        const e = t.siteTitle;
        return i.a.createElement(
          'header',
          { style: { background: 'rebeccapurple', marginBottom: '1.45rem' } },
          i.a.createElement(
            'div',
            {
              style: {
                margin: '0 auto',
                maxWidth: 960,
                padding: '1.45rem 1.0875rem',
              },
            },
            i.a.createElement(
              'h1',
              { style: { margin: 0 } },
              i.a.createElement(
                c.a,
                {
                  to: '/',
                  style: { color: 'white', textDecoration: 'none' },
                },
                e,
              ),
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
          ),
        );
      };
      (l.propTypes = { siteTitle: s.a.string }),
      (l.defaultProps = { siteTitle: '' });
      const u = l;
      const d = (a(154),
      function(t) {
        const e = t.children;
        return i.a.createElement(c.b, {
          query: '755544856',
          render(t) {
            return i.a.createElement(
              i.a.Fragment,
              null,
              i.a.createElement(u, { siteTitle: t.site.siteMetadata.title }),
              i.a.createElement(
                'div',
                {
                  style: {
                    margin: '0 auto',
                    maxWidth: 960,
                    padding: '0px 1.0875rem 1.45rem',
                    paddingTop: 0,
                  },
                },
                i.a.createElement('main', null, e),
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
                    'Gatsby',
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
      d.propTypes = { children: s.a.node.isRequired };
      e.a = d;
    },
  },
]);
// # sourceMappingURL=component---src-pages-404-js-870a7e24b2c4d851b82e.js.map
