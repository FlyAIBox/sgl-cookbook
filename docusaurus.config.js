// ====================================
// TypeScript 类型检查配置
// ====================================
// @ts-check：启用 TypeScript 编译器对 JavaScript 文件的类型检查
// 即使这是 .js 文件，也能获得类型安全和编辑器智能提示

// `@type` JSDoc 注释允许编辑器提供自动补全和类型检查功能
// （需要与 @ts-check 配合使用）
// Docusaurus 配置有多种等效的声明方式
// 参考：https://docusaurus.io/docs/api/docusaurus-config

// ====================================
// 依赖导入
// ====================================
// 导入 Prism 主题：用于代码块的语法高亮
import { themes as prismThemes } from 'prism-react-renderer';

// 导入 Node.js 路径模块：用于处理文件路径
import path from 'path';

// 导入 URL 转换工具：将 ES 模块的 URL 转换为文件路径
import { fileURLToPath } from 'url';

// ====================================
// 运行环境说明
// ====================================
// 这个文件在 Node.js 环境中运行（构建时），不是在浏览器中运行
// 因此不能使用浏览器 API（如 window、document）或 JSX 语法
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ====================================
// Docusaurus 配置对象
// ====================================
/** @type {import('@docusaurus/types').Config} */
// 上面这行为 config 对象提供 TypeScript 类型定义，帮助编辑器提供智能提示
const config = {
  // ====================================
  // 网站基本信息
  // ====================================
  // 网站标题：显示在浏览器标签页和导航栏
  title: 'SGLang Cookbook',

  // 网站标语：简短描述网站的主要用途
  // 通常显示在首页标题下方
  tagline: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.',

  // 网站图标（Favicon）：显示在浏览器标签页
  // 路径相对于 static 目录
  favicon: 'img/favicon.png',

  // ====================================
  // 未来特性标志
  // ====================================
  // 参考：https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    // 启用 v4 兼容性：提前适配即将到来的 Docusaurus v4 版本
    // 这有助于在升级时减少破坏性变更
    v4: true,
  },

  // ====================================
  // 网站 URL 配置
  // ====================================
  // 生产环境的完整 URL（不包含路径）
  // 这对 SEO、sitemap 生成和社交媒体分享非常重要
  url: 'https://cookbook.sglang.io',

  // 基础路径：网站部署在域名下的哪个路径
  // '/' 表示部署在根路径
  // 对于 GitHub Pages，通常是 '/<projectName>/'
  // 可以通过环境变量 BASE_URL 覆盖（例如：在不同环境使用不同路径）
  baseUrl: process.env.BASE_URL || '/',

  // ====================================
  // GitHub Pages 部署配置
  // ====================================
  // 如果不使用 GitHub Pages 部署，可以省略这些配置

  // GitHub 组织或用户名
  // 用于生成正确的部署 URL
  organizationName: 'sgl-project',

  // GitHub 仓库名称
  // 用于生成正确的部署 URL 和编辑链接
  projectName: 'sgl-cookbook',

  // ====================================
  // 构建和 URL 行为配置
  // ====================================
  // 损坏链接的处理方式
  // 'throw'：遇到损坏链接时抛出错误，构建失败（推荐，确保链接质量）
  // 'warn'：仅显示警告，构建继续
  // 'ignore'：忽略损坏链接
  onBrokenLinks: 'throw',

  // URL 尾部斜杠配置
  // false：URL 不以斜杠结尾（/docs 而不是 /docs/）
  // true：URL 必须以斜杠结尾（/docs/）
  // 保持一致对 SEO 很重要
  trailingSlash: false,

  // ====================================
  // 国际化（i18n）配置
  // ====================================
  // 即使不使用多语言功能，也可以用这个字段设置有用的元数据
  // 例如 HTML 的 lang 属性，这对 SEO 和可访问性很重要
  // 
  // 如果网站是中文的，可以将 "en" 替换为 "zh-Hans"（简体中文）或 "zh-Hant"（繁体中文）
  i18n: {
    // 默认语言：网站的主要语言
    defaultLocale: 'en',

    // 支持的语言列表
    // 如果要支持多语言，在这里添加其他语言代码
    // 例如：['en', 'zh-Hans', 'ja']
    locales: ['en'],
  },

  // ====================================
  // SEO 配置
  // ====================================
  // 是否阻止搜索引擎索引网站
  // false：允许搜索引擎索引（生产环境推荐）
  // true：阻止搜索引擎索引（开发/测试环境使用）
  noIndex: false,

  // ====================================
  // 预设配置（Presets）
  // ====================================
  //预设是一组预配置的插件和主题的集合
  //这里使用的 'classic' 预设包含了文档、博客、页面等常用功能
  presets: [
    [
      // 使用 classic 预设：Docusaurus 最常用的预设
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // ====================================
        // 文档功能配置
        // ====================================
        docs: {
          // 文档的路由基础路径
          // '/'：文档直接在网站根路径显示（而不是 /docs/）
          // 这意味着访问 https://cookbook.sglang.io/intro 而不是 https://cookbook.sglang.io/docs/intro
          routeBasePath: '/',

          // 侧边栏配置文件的路径
          // 相对于项目根目录
          sidebarPath: './sidebars.js',

          // 编辑链接的 URL 前缀
          // 在每个文档页面底部显示“编辑此页”链接
          // 点击后直接跳转到 GitHub 仓库的对应文件
          editUrl:
            'https://github.com/sgl-project/sgl-cookbook/tree/main',
        },

        // ====================================
        // 主题配置
        // ====================================
        theme: {
          // 自定义 CSS 文件的路径
          // 用于覆盖默认样式或添加自定义样式
          customCss: './src/css/custom.css',
        },

        // ====================================
        // Sitemap 配置
        // ====================================
        // Sitemap 是提供给搜索引擎的网站地图
        sitemap: {
          // 更新频率提示：告诉搜索引擎页面多久可能变化一次
          // 可选值：always, hourly, daily, weekly, monthly, yearly, never
          changefreq: 'weekly',

          // 优先级：表示该 URL 相对于网站其他 URL 的重要性
          // 范围：0.0 - 1.0，0.5 是中等优先级
          priority: 0.5,

          // Sitemap 文件名称
          // 生成的文件将位于 build/sitemap.xml
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],
  plugins: [
    function (context, options) {
      return {
        name: 'webpack-alias-plugin',
        configureWebpack(config, isServer, utils) {
          return {
            resolve: {
              alias: {
                '@diffusion': path.resolve(__dirname, 'docs', 'diffusion'),
                '@specbundle': path.resolve(__dirname, 'docs', 'specbundle'),
                '@optimal-configs': path.resolve(__dirname, 'data', 'optimal-configs', 'generated'),
              },
            },
          };
        },
      };
    },
  ],
  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'SGLang Team',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'publisher',
        content: 'SGLang Team',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://cookbook.sglang.io/',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: 'B137E28CCDDFD715',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'fE6yfJhRYZw5wDa8b-KyjhoGyUUXcRV5gyanHUoDmV4',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'SGLang Cookbook - Production Deployment Guides',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://cookbook.sglang.io',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://cookbook.sglang.io/img/logo.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image:alt',
        content: 'SGLang Cookbook Logo',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'SGLang Cookbook',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'en_US',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'SGLang Cookbook - Production Deployment Guides',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://cookbook.sglang.io/img/logo.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image:alt',
        content: 'SGLang Cookbook Logo',
      },
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SGLang Cookbook',
        description: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.',
        url: 'https://cookbook.sglang.io',
        publisher: {
          '@type': 'Organization',
          name: 'SGLang Team',
          logo: {
            '@type': 'ImageObject',
            url: 'https://cookbook.sglang.io/img/logo.png',
          },
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://cookbook.sglang.io/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: 'SGLang Cookbook - Production Deployment Guides',
        description: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.',
        author: {
          '@type': 'Organization',
          name: 'SGLang Team',
        },
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0],
      }),
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        { name: 'description', content: 'The SGLang Cookbook is a practical collection of examples and guides that show developers how to efficiently run SGLang with a variety of models on different platforms.' },
        { name: 'keywords', content: 'SGLang, LLM, deployment, inference, GPU, production, guides, cookbook, DeepSeek, Qwen, Llama, AI inference, model serving, CUDA, PyTorch, HuggingFace, transformer models, language models, vision models, diffusion models, performance optimization, distributed inference, model optimization' },
      ],
      navbar: {
        title: 'SGLang Cookbook',
        logo: {
          alt: 'SGLang Cookbook Logo',
          src: 'img/logo.png',
          href: '/',
          target: '_self',
        },
        items: [
          {
            href: 'https://github.com/sgl-project/sgl-cookbook',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} SGLang Team.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        appId: '5PDGY21FSS',
        apiKey: '58c29a0ac6c2759e581d630b54e57564',
        indexName: 'sgl-cookbook',
      },
    }),
};

export default config;
