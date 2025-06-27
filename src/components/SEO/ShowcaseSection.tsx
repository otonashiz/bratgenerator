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
    { id: 2, text: "PLAY THE REMIX", format: "story", scribble: false },
    { id: 3, text: "I SAID NO", format: "square", scribble: true },
    { id: 4, text: "NOT MY PROBLEM", format: "square", scribble: false },
    { id: 5, text: "READ THE ROOM", format: "story", scribble: true },
    { id: 6, text: "TRY AGAIN", format: "square", scribble: false }
  ];

  // 简单的伪随机数生成器，基于文本内容
  const seededRandom = (seed: string, index: number = 0) => {
    let hash = 0;
    const fullSeed = seed + index;
    for (let i = 0; i < fullSeed.length; i++) {
      const char = fullSeed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash % 1000) / 1000;
  };

  // 生成更真实的scribble路径
  const generateScribblePaths = (item: ShowcaseItem, textBounds: { x: number, y: number, width: number, height: number }) => {
    const paths: string[] = [];
    const numStrokes = 4 + Math.floor(seededRandom(item.text, 0) * 3); // 4-6条线
    
    for (let i = 0; i < numStrokes; i++) {
      const isHorizontal = seededRandom(item.text, i * 10) < 0.6;
      const pathSeed = item.text + i;
      
      let pathData = '';
      
      if (isHorizontal) {
        // 横向涂抹线
        const startX = textBounds.x - 20 - seededRandom(pathSeed, 1) * 15;
        const endX = textBounds.x + textBounds.width + 20 + seededRandom(pathSeed, 2) * 15;
        const baseY = textBounds.y + textBounds.height * (0.3 + seededRandom(pathSeed, 3) * 0.4);
        
        pathData = `M${startX} ${baseY}`;
        
        // 生成5-8个中间点，形成自然曲线
        const numPoints = 5 + Math.floor(seededRandom(pathSeed, 4) * 3);
        for (let j = 1; j < numPoints; j++) {
          const progress = j / (numPoints - 1);
          const x = startX + (endX - startX) * progress;
          const yOffset = (seededRandom(pathSeed, j + 10) - 0.5) * 12;
          const y = baseY + yOffset;
          
          if (j === 1) {
            pathData += ` Q${x} ${y}`;
          } else {
            pathData += ` ${x} ${y}`;
          }
        }
        
      } else {
        // 斜向涂抹线
        const direction = seededRandom(pathSeed, 5) < 0.5 ? 1 : -1;
        
        let startX, startY, endX, endY;
        if (direction > 0) {
          // 左上到右下
          startX = textBounds.x - 15 - seededRandom(pathSeed, 6) * 10;
          startY = textBounds.y - 15 - seededRandom(pathSeed, 7) * 10;
          endX = textBounds.x + textBounds.width + 15 + seededRandom(pathSeed, 8) * 10;
          endY = textBounds.y + textBounds.height + 15 + seededRandom(pathSeed, 9) * 10;
        } else {
          // 右上到左下
          startX = textBounds.x + textBounds.width + 15 + seededRandom(pathSeed, 6) * 10;
          startY = textBounds.y - 15 - seededRandom(pathSeed, 7) * 10;
          endX = textBounds.x - 15 - seededRandom(pathSeed, 8) * 10;
          endY = textBounds.y + textBounds.height + 15 + seededRandom(pathSeed, 9) * 10;
        }
        
        pathData = `M${startX} ${startY}`;
        
        // 生成中间点
        const numPoints = 4 + Math.floor(seededRandom(pathSeed, 11) * 3);
        for (let j = 1; j < numPoints; j++) {
          const progress = j / (numPoints - 1);
          const baseX = startX + (endX - startX) * progress;
          const baseY = startY + (endY - startY) * progress;
          
          // 垂直于主方向的随机偏移
          const perpOffset = (seededRandom(pathSeed, j + 20) - 0.5) * 8;
          const angle = Math.atan2(endY - startY, endX - startX) + Math.PI / 2;
          const x = baseX + Math.cos(angle) * perpOffset;
          const y = baseY + Math.sin(angle) * perpOffset;
          
          if (j === 1) {
            pathData += ` Q${x} ${y}`;
          } else {
            pathData += ` ${x} ${y}`;
          }
        }
      }
      
      // 不同的线条粗细和透明度
      const thickness = 2 + seededRandom(pathSeed, 30) * 2; // 2-4px
      const opacity = 0.4 + seededRandom(pathSeed, 31) * 0.4; // 0.4-0.8
      
      paths.push(`<path d="${pathData}" stroke="#000" stroke-width="${thickness}" fill="none" stroke-linecap="round" stroke-opacity="${opacity}"/>`);
    }
    
    return paths.join('');
  };

  // 生成SVG预览图片
  const generateSVG = (item: ShowcaseItem) => {
    const isSquare = item.format === "square";
    const width = 300;
    const height = isSquare ? 300 : 375;
    
    // 计算文本换行
    const words = item.text.split(' ');
    const maxCharsPerLine = isSquare ? 12 : 10;
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
    
    // 计算字体大小和位置
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const baseFontSize = Math.min(40, Math.max(24, Math.floor((width * 0.8) / (maxLineLength * 0.6))));
    const fontSize = Math.floor(baseFontSize / Math.max(1, lines.length * 0.3));
    const lineHeight = fontSize * 1.2;
    
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize / 2;
    
    // 计算文本边界用于scribble
    const textBounds = {
      x: width * 0.1,
      y: startY - fontSize * 0.6,
      width: width * 0.8,
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
          
          return (
            <div key={item.id} className="group relative">
              <img 
                src={dataUrl}
                alt={`Brat generator showcase: '${item.text}' album cover in ${item.format} format${item.scribble ? ' with scribble effect' : ' clean text'} - Created with free brat text generator`}
                className="w-full h-auto rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
                width={300}
                height={item.format === 'story' ? 375 : 300}
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