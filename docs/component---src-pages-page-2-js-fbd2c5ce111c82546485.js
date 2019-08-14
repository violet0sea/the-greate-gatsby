(window.webpackJsonp = window.webpackJsonp || []).push([
  [7],
  {
    148(e, t, a) {
      a.r(t);
      const n = a(0);
      const r = a.n(n);
      const i = a(150);
      const o = a(154);
      const c = a(155);
      t.default = function() {
        return r.a.createElement(
          o.a,
          null,
          r.a.createElement(c.a, { title: 'Page two' }),
          r.a.createElement('h1', null, 'Hi from the second page'),
          r.a.createElement('p', null, 'Welcome to page 2'),
          r.a.createElement('script', {
            src:
              'https://gist.github.com/violet0sea/1e00e52006ba4b719e061a6bd9d009f4.js?file=keybase.md',
          }),
          r.a.createElement(i.a, { to: '/' }, 'Go back to the homepage'),
        );
      };
    },
    150(e, t, a) {
      a.d(t, 'b', () => {
        return u;
      });
      const n = a(0);
      const r = a.n(n);
      const i = a(4);
      const o = a.n(i);
      const c = a(33);
      const l = a.n(c);
      a.d(t, 'a', () => {
        return l.a;
      });
      a(151);
      const s = r.a.createContext({});
      var u = function(e) {
        return r.a.createElement(s.Consumer, null, (t) => {
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
      const c = a(55);
      const l = a(2);
      const s = function(e) {
        const t = e.location;
        const a = l.default.getResourcesForPathnameSync(t.pathname);
        return r.a.createElement(
          c.a,
          Object.assign({ location: t, pageResources: a }, a.json),
        );
      };
      (s.propTypes = {
        location: o.a.shape({ pathname: o.a.string.isRequired }).isRequired,
      }),
      (t.default = s);
    },
    154(e, t, a) {
      const n = a(152);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const c = a.n(o);
      const l = a(150);
      const s = function(e) {
        const t = e.siteTitle;
        return i.a.createElement(
          'header',
          { className: 'header' },
          i.a.createElement(
            'h1',
            null,
            i.a.createElement(l.a, { to: '/' }, t),
          ),
          i.a.createElement(
            'ul',
            null,
            i.a.createElement(
              'li',
              null,
              i.a.createElement(l.a, { to: '/about' }, 'About'),
            ),
          ),
        );
      };
      (s.propTypes = { siteTitle: c.a.string }),
      (s.defaultProps = { siteTitle: '' });
      const u = s;
      const d = (a(158),
      function(e) {
        const t = e.children;
        return i.a.createElement(l.b, {
          query: '755544856',
          render(e) {
            return i.a.createElement(
              i.a.Fragment,
              null,
              i.a.createElement(u, { siteTitle: e.site.siteMetadata.title }),
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
      d.propTypes = { children: c.a.node.isRequired };
      t.a = d;
    },
    155(e, t, a) {
      const n = a(156);
      const r = a(0);
      const i = a.n(r);
      const o = a(4);
      const c = a.n(o);
      const l = a(157);
      const s = a.n(l);
      function u(e) {
        const t = e.description;
        const a = e.lang;
        const r = e.meta;
        const o = e.keywords;
        const c = e.title;
        const l = n.data.site;
        const u = t || l.siteMetadata.description;
        return i.a.createElement(s.a, {
          htmlAttributes: { lang: a },
          title: c,
          titleTemplate: `%s | ${l.siteMetadata.title}`,
          meta: [
            { name: 'description', content: u },
            { property: 'og:title', content: c },
            { property: 'og:description', content: u },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:creator', content: l.siteMetadata.author },
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
// # sourceMappingURL=component---src-pages-page-2-js-fbd2c5ce111c82546485.js.map
