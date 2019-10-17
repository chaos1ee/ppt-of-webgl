window.onload = function() {
  // 创建着色器的方法
  function createShader(gl, type, source) {
    // 创建着色器对象
    const shader = gl.createShader(type);
    // 设置数据源
    gl.shaderSource(shader, source);
    // 编译着色器
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }

  function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return program;
    }

    console.log(gl.getProgramInfoLog(shader));
    gl.deleteProgram(program);
  }

  function main() {
    // 获取WebGL上下文
    const canvas = document.querySelector('#canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
      return;
    }

    // 顶点着色器数据源
    const vertexShaderSource = `
      // 一个属性，将会从缓冲中获取数据
      attribute vec4 a_position;

      void main() {
        // gl_position是顶点着色器主要设置的变量
        gl_Position = a_position;
      }
    `;

    // 片段着色器数据源
    const fragmentShaderSource = `
      // 设置片段着色器的精度
      precision mediump float;

      void main() {
        // gl_FragColor是片段着色器主要设置的变量
        gl_FragColor = vec4(1, 0, 0.5, 1);
      }
    `;

    // 生成GLSL着色器，加载GLSL资源，编译着色器
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // 将两个着色器link到program
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 从创建的GLSL着色程序中找到'a_position'这个属性所在的位置。
    const positionAttributeLocation = gl.getAttribLocation(
      program,
      'a_position'
    );

    // 创建缓冲，将3个二维点放入其中
    const positionBuffer = gl.createBuffer();

    // 将positionBuffer绑定到ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 三个二维点坐标
    // prettier-ignore
    const positions = [
      0, 0, 
      0, 0.5, 
      0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // 位于此行代码之上的为初始化代码
    // 位于此行代码之下的为渲染代码

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // 告知WebGL如何从裁剪空间坐标转换成像素坐标
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 清空canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 告知WebGL使用program（着色器对）
    gl.useProgram(program);

    // 启用属性
    gl.enableVertexAttribArray(positionAttributeLocation);

    // 将positionBuffer绑定到ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // 告诉属性怎么从positionBuffer中读取数据（ARRAY_BUFFER)
    const size = 2; // 每次迭代运行提取两个单位数据
    const type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
    const normalize = false; // 不需要归一化数据
    const stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)），每次迭代运行运动多少内存到下一个数据开始点
    const offset = 0; // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(
      positionAttributeLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // 绘制
    const primitiveType = gl.TRIANGLES;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }

  main();
};
