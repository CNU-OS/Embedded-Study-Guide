import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';

const vitepressSidebarOptions = {
  /* Options... */
};

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "嵌入式学习路线",
  description: "首都师范大学计算机协会嵌入式",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
    ],

    search: { 
      provider: 'local'
    }, 
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },
    
    sidebar: generateSidebar({
      /*
       * For detailed instructions, see the links below:
       * https://vitepress-sidebar.jooy2.com/guide/api
       */
      documentRootPath: '/docs', //文档根目录
      // scanStartPath: null,
      // resolvePath: null,
      // useTitleFromFileHeading: true,
      // useTitleFromFrontmatter: true,
      // frontmatterTitleFieldName: 'title',
      // useFolderTitleFromIndexFile: false, //是否使用层级首页文件名做分级标题
      // useFolderLinkFromIndexFile: false, //是否链接至层级首页文件
      // hyphenToSpace: true,
      // underscoreToSpace: true,
      // capitalizeFirst: false,
      // capitalizeEachWords: false,
      collapsed: false, //折叠组关闭
      collapseDepth: 2, //折叠组2级菜单
      // sortMenusByName: false,
      // sortMenusByFrontmatterOrder: false,
      // sortMenusByFrontmatterDate: false,
      // sortMenusOrderByDescending: false,
      // sortMenusOrderNumericallyFromTitle: false,
      // sortMenusOrderNumericallyFromLink: false,
      // frontmatterOrderDefaultValue: 0,
      // manualSortFileNameByPriority: ['first.md', 'second', 'third.md'], //手动排序，文件夹不用带后缀
      removePrefixAfterOrdering: false, //删除前缀，必须与prefixSeparator一起使用
      prefixSeparator: '.', //删除前缀的符号
      // excludeFiles: ['first.md', 'secret.md'],
      // excludeFilesByFrontmatterFieldName: 'exclude',
      // excludeFolders: ['secret-folder'],
      // includeDotFiles: false,
      // includeRootIndexFile: false,
      // includeFolderIndexFile: false, //是否包含层级主页
      // includeEmptyFolder: false,
      // rootGroupText: 'Contents',
      // rootGroupLink: 'https://github.com/jooy2',
      // rootGroupCollapsed: false,
      // convertSameNameSubFileToGroupIndexPage: false,
      // folderLinkNotIncludesFileName: false,
      // keepMarkdownSyntaxFromTitle: false,
      // debugPrint: false,
    }),
  }
})
