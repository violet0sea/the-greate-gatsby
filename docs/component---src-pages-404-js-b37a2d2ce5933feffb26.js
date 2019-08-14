(window.webpackJsonp = window.webpackJsonp || []).push([
  [4],
  {
    145(e, t, a) {
      a.r(t);
      const n = a(0);
      const r = a.n(n);
      const i = a(154);
      const o = a(155);
      t.default = function() {
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
    150(e, t, a) {
      a.d(t, 'b', () => {
        return s;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const u = a(33);
      const c = a.n(u);
      a.d(t, 'a', () => {
        return c.a;
      });
      a(151);
      const l = r.a.createContext({});
      var s = function(e) {
        return r.a.createElement(l.Consumer, null, (t) => {
          return e.data || (t[e.query] && t[e.query].data)
            ? (e.render || e.children)(e.data ? e.data.data : t[e.query].data)
            : r.a.createElement('div', null, 'Loading (StaticQuery)');
        });
      };
      s.propTypes = {
        data: o.a.object,
        query: o.a.string.isRequired,
        render: o.a.func,
        children: o.a.func,
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
      const o = a.n(i);
      const u = a(55);
      const c = a(2);
      const l = function(e) {
        const t = e.location;
        const a = c.default.getResourcesForPathnameSync(t.pathname);
        return r.a.createElement(
          u.a,
          Object.assign({ location: t, pageResources: a }, a.json),
        );
      };
      (l.propTypes = {
        location: o.a.shape({ pathname: o.a.string.isRequired }).isRequired,
      }),
      (t.default = l);
    },
    154(e, t, a) {
      const n = a(152);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const u = a.n(o);
      const c = a(150);
      const l = function(e) {
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
      (l.propTypes = { siteTitle: u.a.string }),
      (l.defaultProps = { siteTitle: '' });
      const s = l;
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
      d.propTypes = { children: u.a.node.isRequired };
      t.a = d;
    },
    155(e, t, a) {
      const n = a(156);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const u = a.n(o);
      const c = a(157);
      const l = a.n(c);
      function s(e) {
        const t = e.description;
        const a = e.lang;
        const r = e.meta;
        const o = e.keywords;
        const u = e.title;
        const c = n.data.site;
        const s = t || c.siteMetadata.description;
        return i.a.createElement(l.a, {
          htmlAttributes: { lang: a },
          title: u,
          titleTemplate: `%s | ${c.siteMetadata.title}`,
          meta: [
            { name: 'description', content: s },
            { property: 'og:title', content: u },
            { property: 'og:description', content: s },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: c.siteMetadata.author },
            { name: 'twitter:title', content: u },
            { name: 'twitter:description', content: s },
          ]
            .concat(
              o.length > 0 ? { name: 'keywords', content: o.join(', ') } : [],
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
        description: u.a.string,
        lang: u.a.string,
        meta: u.a.arrayOf(u.a.object),
        keywords: u.a.arrayOf(u.a.string),
        title: u.a.string.isRequired,
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
// # sourceMappingURL=component---src-pages-404-js-b37a2d2ce5933feffb26.js.map
