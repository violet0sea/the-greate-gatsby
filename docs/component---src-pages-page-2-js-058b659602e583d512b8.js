(window.webpackJsonp = window.webpackJsonp || []).push([
  [6],
  {
    145(e, t, a) {
      a.r(t);
      const n = a(0);
      const r = a.n(n);
      const i = a(147);
      const o = a(153);
      const c = a(151);
      t.default = function() {
        return r.a.createElement(
          o.a,
          null,
          r.a.createElement(c.a, { title: 'Page two' }),
          r.a.createElement('h1', null, 'Hi from the second page'),
          r.a.createElement('p', null, 'Welcome to page 2'),
          r.a.createElement(i.a, { to: '/' }, 'Go back to the homepage'),
        );
      };
    },
    147(e, t, a) {
      a.d(t, 'b', () => {
        return u;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const c = a(33);
      const s = a.n(c);
      a.d(t, 'a', () => {
        return s.a;
      });
      a(148);
      const l = r.a.createContext({});
      var u = function(e) {
        return r.a.createElement(l.Consumer, null, (t) => {
          return e.data || (t[e.query] && t[e.query].data)
            ? (e.render || e.children)(e.data ? e.data.data : t[e.query].data)
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
    148(e, t, a) {
      let n;
      e.exports = ((n = a(150)) && n.default) || n;
    },
    149(e) {
      e.exports = {
        data: { site: { siteMetadata: { title: 'Gatsby Default Starter' } } },
      };
    },
    150(e, t, a) {
      a.r(t);
      a(34);
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const c = a(55);
      const s = a(2);
      const l = function(e) {
        const t = e.location;
        const a = s.default.getResourcesForPathnameSync(t.pathname);
        return r.a.createElement(
          c.a,
          Object.assign({ location: t, pageResources: a }, a.json),
        );
      };
      (l.propTypes = {
        location: o.a.shape({ pathname: o.a.string.isRequired }).isRequired,
      }),
      (t.default = l);
    },
    151(e, t, a) {
      const n = a(152);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const c = a.n(o);
      const s = a(155);
      const l = a.n(s);
      function u(e) {
        const t = e.description;
        const a = e.lang;
        const r = e.meta;
        const o = e.keywords;
        const c = e.title;
        const s = n.data.site;
        const u = t || s.siteMetadata.description;
        return i.a.createElement(l.a, {
          htmlAttributes: { lang: a },
          title: c,
          titleTemplate: `%s | ${s.siteMetadata.title}`,
          meta: [
            { name: 'description', content: u },
            { property: 'og:title', content: c },
            { property: 'og:description', content: u },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: s.siteMetadata.author },
            { name: 'twitter:title', content: c },
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
        description: c.a.string,
        lang: c.a.string,
        meta: c.a.arrayOf(c.a.object),
        keywords: c.a.arrayOf(c.a.string),
        title: c.a.string.isRequired,
      }),
      (t.a = u);
    },
    152(e) {
      e.exports = {
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
    153(e, t, a) {
      const n = a(149);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const c = a.n(o);
      const s = a(147);
      const l = function(e) {
        const t = e.siteTitle;
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
                s.a,
                {
                  to: '/',
                  style: { color: 'white', textDecoration: 'none' },
                },
                t,
              ),
            ),
            i.a.createElement(
              'ul',
              null,
              i.a.createElement(
                'li',
                null,
                i.a.createElement(s.a, { to: '/about' }, 'About'),
              ),
            ),
          ),
        );
      };
      (l.propTypes = { siteTitle: c.a.string }),
      (l.defaultProps = { siteTitle: '' });
      const u = l;
      const d = (a(154),
      function(e) {
        const t = e.children;
        return i.a.createElement(s.b, {
          query: '755544856',
          render(e) {
            return i.a.createElement(
              i.a.Fragment,
              null,
              i.a.createElement(u, { siteTitle: e.site.siteMetadata.title }),
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
                i.a.createElement('main', null, t),
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
      d.propTypes = { children: c.a.node.isRequired };
      t.a = d;
    },
  },
]);
// # sourceMappingURL=component---src-pages-page-2-js-058b659602e583d512b8.js.map
