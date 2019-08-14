(window.webpackJsonp = window.webpackJsonp || []).push([
  [8],
  {
    144(e, t, a) {
      a.r(t),
      a.d(t, 'query', () => {
        return i;
      });
      const n = a(0);
      const r = a.n(n);
      const l = a(157);
      const u = a(154);
      t.default = function(e) {
        const t = e.data.markdownRemark;
        return r.a.createElement(
          u.a,
          null,
          r.a.createElement(
            l.Helmet,
            null,
            r.a.createElement('meta', {
              name: 'keywords',
              content: t.frontmatter.title,
            }),
            r.a.createElement('title', null, t.frontmatter.title),
          ),
          r.a.createElement(
            'div',
            null,
            r.a.createElement('h1', null, t.frontmatter.title),
            r.a.createElement('article', {
              dangerouslySetInnerHTML: { __html: t.html },
            }),
          ),
        );
      };
      var i = '3604184052';
    },
    150(e, t, a) {
      a.d(t, 'b', () => {
        return s;
      });
      const n = a(0);
      const r = a.n(n);
      const l = a(4);
      const u = a.n(l);
      const i = a(33);
      const c = a.n(i);
      a.d(t, 'a', () => {
        return c.a;
      });
      a(151);
      const o = r.a.createContext({});
      var s = function(e) {
        return r.a.createElement(o.Consumer, null, (t) => {
          return e.data || (t[e.query] && t[e.query].data)
            ? (e.render || e.children)(e.data ? e.data.data : t[e.query].data)
            : r.a.createElement('div', null, 'Loading (StaticQuery)');
        });
      };
      s.propTypes = {
        data: u.a.object,
        query: u.a.string.isRequired,
        render: u.a.func,
        children: u.a.func,
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
      const l = a(4);
      const u = a.n(l);
      const i = a(55);
      const c = a(2);
      const o = function(e) {
        const t = e.location;
        const a = c.default.getResourcesForPathnameSync(t.pathname);
        return r.a.createElement(
          i.a,
          Object.assign({ location: t, pageResources: a }, a.json),
        );
      };
      (o.propTypes = {
        location: u.a.shape({ pathname: u.a.string.isRequired }).isRequired,
      }),
      (t.default = o);
    },
    154(e, t, a) {
      const n = a(152);
      const r = a(0);
      const l = a.n(r);
      const u = a(4);
      const i = a.n(u);
      const c = a(150);
      const o = function(e) {
        const t = e.siteTitle;
        return l.a.createElement(
          'header',
          { className: 'header' },
          l.a.createElement(
            'h1',
            null,
            l.a.createElement(c.a, { to: '/' }, t),
          ),
          l.a.createElement(
            'ul',
            null,
            l.a.createElement(
              'li',
              null,
              l.a.createElement(c.a, { to: '/about' }, 'About'),
            ),
          ),
        );
      };
      (o.propTypes = { siteTitle: i.a.string }),
      (o.defaultProps = { siteTitle: '' });
      const s = o;
      const d = (a(158),
      function(e) {
        const t = e.children;
        return l.a.createElement(c.b, {
          query: '755544856',
          render(e) {
            return l.a.createElement(
              l.a.Fragment,
              null,
              l.a.createElement(s, { siteTitle: e.site.siteMetadata.title }),
              l.a.createElement(
                'div',
                null,
                l.a.createElement('main', { className: 'main' }, t),
                l.a.createElement(
                  'footer',
                  null,
                  '© ',
                  new Date().getFullYear(),
                  ', Built with',
                  ' ',
                  l.a.createElement(
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
      d.propTypes = { children: i.a.node.isRequired };
      t.a = d;
    },
  },
]);
// # sourceMappingURL=component---src-templates-blog-js-e6caa12dc36e7395b9bb.js.map
