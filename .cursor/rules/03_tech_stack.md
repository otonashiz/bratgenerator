## **Part 3: 技术栈与架构设计 (Development Stack & Architecture)**

### **3.1 技术选型总览**

基于产品需求分析和竞品对比，我们选择以下技术栈：

| 技术层 | 选择方案 | 版本 | 选择理由 |
|--------|----------|------|----------|
| **前端框架** | Next.js | 14.x (App Router) | SEO友好、性能优秀、生态成熟 |
| **开发语言** | TypeScript | 5.x | 类型安全、开发效率、代码质量 |
| **样式方案** | Tailwind CSS | 3.x | 快速开发、响应式设计、体积优化 |
| **图片生成** | Canvas API | 原生 | 像素级控制、导出能力、涂抹效果实现 |
| **状态管理** | React Hooks | 原生 | 轻量、简单、符合项目规模 |
| **构建工具** | Next.js内置 | Webpack 5 | 自动优化、代码分割、性能优化 |
| **部署平台** | Vercel | - | 自动CDN、性能优化、简单部署 |
| **分析监控** | Google Analytics + Vercel Analytics | - | SEO监控、用户行为分析 |

### **3.2 项目架构设计**

#### **目录结构**
```
brat-generator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 主页面 (/)
│   │   ├── layout.tsx         # 根布局 (SEO配置)
│   │   ├── globals.css        # 全局样式
│   │   ├── loading.tsx        # 加载状态
│   │   └── not-found.tsx      # 404页面
│   ├── components/            # 可复用组件
│   │   ├── BratGenerator.tsx  # 核心生成器组件
│   │   ├── Canvas.tsx         # Canvas渲染组件
│   │   ├── Controls/          # 控制面板组件组
│   │   │   ├── TextInput.tsx
│   │   │   ├── ToggleSwitch.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   └── DownloadButton.tsx
│   │   └── UI/                # 基础UI组件
│   │       ├── Button.tsx
│   │       └── Toggle.tsx
│   ├── hooks/                 # 自定义Hooks
│   │   ├── useCanvas.ts       # Canvas状态与渲染逻辑
│   │   ├── useBratText.ts     # 文本处理逻辑
│   │   ├── useDownload.ts     # 图片下载功能
│   │   └── useDebounce.ts     # 防抖Hook
│   ├── utils/                 # 工具函数
│   │   ├── canvas-renderer.ts # Canvas绘制逻辑
│   │   ├── scribble-effect.ts # 涂抹效果算法
│   │   ├── text-processor.ts  # 智能文本处理
│   │   ├── font-loader.ts     # 字体加载管理
│   │   └── image-exporter.ts  # 图片导出工具
│   ├── constants/             # 常量配置
│   │   ├── config.ts          # 应用配置
│   │   ├── colors.ts          # 颜色定义
│   │   └── fonts.ts           # 字体配置
│   └── types/                 # TypeScript类型定义
│       ├── canvas.ts
│       ├── generator.ts
│       └── index.ts
├── public/                    # 静态资源
│   ├── fonts/                 # 字体文件
│   │   └── arial-narrow.woff2
│   ├── images/                # 图片资源
│   └── favicon.ico
├── docs/                      # 项目文档
├── package.json
├── next.config.js             # Next.js配置
├── tailwind.config.js         # Tailwind配置
├── tsconfig.json              # TypeScript配置
└── vercel.json                # 部署配置
```

### **3.3 核心技术实现**

#### **3.3.1 Canvas渲染引擎**
```typescript
// utils/canvas-renderer.ts
export class BratCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  
  render(config: RenderConfig) {
    this.clearCanvas();
    this.drawBackground(config.backgroundColor);
    this.drawText(config.text, config.font, config.color);
    
    if (config.hasScribble) {
      this.drawScribbleEffect(config.textBounds);
    }
  }
  
  private drawScribbleEffect(bounds: TextBounds) {
    // 高级涂抹效果实现
    // 多层贝塞尔曲线 + 压感模拟 + 纹理效果
  }
}
```

#### **3.3.2 智能文本处理**
```typescript
// utils/text-processor.ts
export class SmartTextProcessor {
  static processText(text: string, maxWidth: number): ProcessedText {
    // 1. 自动换行
    const lines = this.wrapText(text, maxWidth);
    
    // 2. 字号自适应
    const fontSize = this.calculateOptimalFontSize(lines, maxWidth);
    
    // 3. 布局优化
    const layout = this.optimizeLayout(lines, fontSize);
    
    return { lines, fontSize, layout };
  }
  
  private static wrapText(text: string, maxWidth: number): string[] {
    // 智能换行算法
  }
  
  private static calculateOptimalFontSize(lines: string[], maxWidth: number): number {
    // 自适应字号计算
  }
}
```

#### **3.3.3 性能优化策略**
```typescript
// hooks/useCanvas.ts
export const useOptimizedCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<BratCanvasRenderer>();
  const lastConfigRef = useRef<RenderConfig>();
  
  // 防抖渲染
  const debouncedRender = useMemo(
    () => debounce((config: RenderConfig) => {
      // 智能缓存：相同配置不重复渲染
      if (isConfigEqual(config, lastConfigRef.current)) return;
      
      requestAnimationFrame(() => {
        rendererRef.current?.render(config);
        lastConfigRef.current = config;
      });
    }, 150),
    []
  );
  
  return { canvasRef, render: debouncedRender };
};
```

### **3.4 SEO技术实现**

#### **3.4.1 元数据配置**
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Brat Generator - Create Your Custom Brat Album Cover',
  description: 'The fastest, ad-free Brat Generator. Create your Charli XCX album cover meme for Instagram and Twitter in seconds. Choose with or without strikethrough. Try now!',
  keywords: 'Brat Generator, Charli XCX, album cover maker, brat green image generator',
  openGraph: {
    title: 'Brat Generator',
    description: 'Create custom Brat album covers instantly',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Brat Generator Preview'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brat Generator',
    description: 'Create custom Brat album covers instantly',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

#### **3.4.2 结构化数据**
```typescript
// components/StructuredData.tsx
export const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Brat Generator",
    "description": "Create custom Brat album covers instantly",
    "url": "https://yourdomain.com",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
```

### **3.5 性能优化配置**

#### **3.5.1 Next.js配置**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // 字体优化
  optimizeFonts: true,
  
  // 压缩配置
  compress: true,
  
  // 实验性功能
  experimental: {
    optimizeCss: true,
  },
  
  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

#### **3.5.2 字体加载优化**
```typescript
// utils/font-loader.ts
export class FontLoader {
  private static instance: FontLoader;
  private fontsLoaded = new Set<string>();
  
  static getInstance() {
    if (!FontLoader.instance) {
      FontLoader.instance = new FontLoader();
    }
    return FontLoader.instance;
  }
  
  async loadArialNarrow(): Promise<void> {
    if (this.fontsLoaded.has('arial-narrow')) return;
    
    const font = new FontFace(
      'Arial Narrow',
      'url(/fonts/arial-narrow.woff2) format("woff2")'
    );
    
    await font.load();
    document.fonts.add(font);
    this.fontsLoaded.add('arial-narrow');
  }
}
```

### **3.6 部署与监控配置**

#### **3.6.1 Vercel配置**
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/sitemap.xml",
      "destination": "/api/sitemap"
    }
  ]
}
```

#### **3.6.2 分析配置**
```typescript
// app/layout.tsx - Google Analytics配置
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

### **3.7 开发工具配置**

#### **3.7.1 TypeScript配置**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/constants/*": ["./src/constants/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### **3.7.2 Tailwind配置**
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brat-green': '#BEFF34',
        'brat-text': '#000000',
      },
      fontFamily: {
        'arial-narrow': ['Arial Narrow', 'Helvetica Neue Condensed', 'sans-serif'],
        'ui': ['Inter', 'Helvetica', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### **3.8 技术优势总结**

1. **开发效率**: TypeScript + Next.js + Tailwind 提供快速开发体验
2. **性能优化**: 自动代码分割、图片优化、字体优化
3. **SEO友好**: 内置SSG、元数据管理、结构化数据
4. **可扩展性**: 清晰的架构设计，易于添加新功能
5. **部署简便**: Vercel一键部署，自动CDN和性能优化
6. **监控完善**: 多层监控体系，实时掌握应用状态

这个技术栈设计确保了我们能够快速构建一个高性能、SEO友好、易于维护的Brat图片生成工具。 