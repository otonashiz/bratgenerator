'use client';

interface ShowcaseItem {
  id: number;
  text: string;
  format: "square" | "story";
  scribble: boolean;
}

export default function ShowcaseSection() {
  const showcaseItems: ShowcaseItem[] = [
    { id: 1, text: "HARD PASS", format: "square", scribble: true },
    { id: 2, text: "PLAY THE REMIX", format: "square", scribble: false },
    { id: 3, text: "I SAID NO", format: "square", scribble: true },
    { id: 4, text: "NOT MY PROBLEM", format: "square", scribble: false },
    { id: 5, text: "READ THE ROOM", format: "square", scribble: true },
    { id: 6, text: "TRY AGAIN", format: "square", scribble: false }
  ];

  // 简化的scribble生成 - 确保一致效果
  const generateScribblePaths = (item: ShowcaseItem, textBounds: { x: number, y: number, width: number, height: number }) => {
    const paths: string[] = [];
    
    // 固定生成4条线，确保一致性
    const strokeConfigs = [
      { type: 'horizontal' as const, position: 0.4, thickness: 3, opacity: 0.7 },
      { type: 'horizontal' as const, position: 0.6, thickness: 2.5, opacity: 0.6 },
      { type: 'diagonal-down' as const, thickness: 3, opacity: 0.6 },
      { type: 'diagonal-up' as const, thickness: 2, opacity: 0.5 }
    ];
    
    strokeConfigs.forEach((config, index) => {
      let pathData = '';
      
             if (config.type === 'horizontal') {
         // 横向线条
         const startX = textBounds.x - 25;
         const endX = textBounds.x + textBounds.width + 25;
         const y = textBounds.y + textBounds.height * (config.position || 0.5);
        
        // 创建略带波动的线条
        const points = [];
        for (let i = 0; i <= 8; i++) {
          const progress = i / 8;
          const x = startX + (endX - startX) * progress;
          const waveOffset = Math.sin(progress * Math.PI * 2 + index) * 3;
          points.push({ x, y: y + waveOffset });
        }
        
        pathData = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          pathData += ` L${points[i].x},${points[i].y}`;
        }
        
      } else if (config.type === 'diagonal-down') {
        // 左上到右下的对角线
        const startX = textBounds.x - 15;
        const startY = textBounds.y - 10;
        const endX = textBounds.x + textBounds.width + 15;
        const endY = textBounds.y + textBounds.height + 10;
        
        // 创建略带波动的对角线
        const points = [];
        for (let i = 0; i <= 6; i++) {
          const progress = i / 6;
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;
          const offset = Math.sin(progress * Math.PI * 3) * 2;
          points.push({ x: x + offset, y: y + offset });
        }
        
        pathData = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          pathData += ` L${points[i].x},${points[i].y}`;
        }
        
      } else if (config.type === 'diagonal-up') {
        // 右上到左下的对角线
        const startX = textBounds.x + textBounds.width + 15;
        const startY = textBounds.y - 10;
        const endX = textBounds.x - 15;
        const endY = textBounds.y + textBounds.height + 10;
        
        // 创建略带波动的对角线
        const points = [];
        for (let i = 0; i <= 6; i++) {
          const progress = i / 6;
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;
          const offset = Math.sin(progress * Math.PI * 2.5) * 2;
          points.push({ x: x - offset, y: y + offset });
        }
        
        pathData = `M${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          pathData += ` L${points[i].x},${points[i].y}`;
        }
      }
      
      paths.push(`<path d="${pathData}" stroke="#000" stroke-width="${config.thickness}" fill="none" stroke-linecap="round" stroke-opacity="${config.opacity}"/>`);
    });
    
    return paths.join('');
  };

  // 生成SVG预览图片 - 统一1:1格式
  const generateSVG = (item: ShowcaseItem) => {
    const width = 300;
    const height = 300; // 统一正方形
    
    // 统一字体大小
    const fontSize = 32;
    const lineHeight = fontSize * 1.2;
    
    // 文本换行 - 基于字符数
    const words = item.text.split(' ');
    const maxCharsPerLine = 10;
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // 计算文本位置 - 居中显示
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize * 0.35;
    
    // 计算文本边界
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const approxTextWidth = maxLineLength * fontSize * 0.6;
    const textBounds = {
      x: (width - approxTextWidth) / 2,
      y: startY - fontSize * 0.3,
      width: approxTextWidth,
      height: totalTextHeight
    };
    
    // 生成SVG
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#8ACE00"/>
        <g font-family="Arial" font-weight="bold" font-size="${fontSize}" text-anchor="middle" fill="#000">
          ${lines.map((line, index) => 
            `<text x="${width/2}" y="${startY + index * lineHeight}">${line}</text>`
          ).join('')}
        </g>
        ${item.scribble ? generateScribblePaths(item, textBounds) : ''}
      </svg>
    `;
  };

  return (
    <section className="mt-12 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Popular Brat Covers
        </h2>
        <p className="text-gray-600 text-sm">
          Trending designs created with our <strong>brat generator</strong>
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
        {showcaseItems.map((item) => {
          const svgContent = generateSVG(item);
          const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
          
          // 调试信息 - 只在开发环境输出
          if (process.env.NODE_ENV === 'development' && item.scribble) {
            console.log(`SVG for ${item.text}:`, svgContent);
          }
          
          return (
            <div key={item.id} className="group relative">
              <img 
                src={dataUrl}
                alt={`Brat generator showcase: '${item.text}' album cover in square format${item.scribble ? ' with scribble effect' : ' clean text'} - Created with free brat text generator`}
                className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
                width={300}
                height={300}
              />
              
              {/* 悬停效果 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-300" />
            </div>
          );
        })}
      </div>
    </section>
  );
} 